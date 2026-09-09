import { readFile } from 'node:fs/promises';
import {
    after,
    afterEach,
    before,
    test,
} from 'node:test';

import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

import {
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

const projectId = 'langbridge-d048f';

let testEnvironment;

before(async () => {
  const firestoreRules = await readFile(
    new URL(
      '../firestore.rules',
      import.meta.url
    ),
    'utf8'
  );

  testEnvironment =
    await initializeTestEnvironment({
      projectId,
      firestore: {
        rules: firestoreRules,
      },
    });
});

afterEach(async () => {
  await testEnvironment.clearFirestore();
});

after(async () => {
  await testEnvironment.cleanup();
});

test(
  'an authenticated user can read another user profile',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'users',
            'user-two'
          ),
          {
            uid: 'user-two',
            fullName: 'Test User Two',
            email: 'user-two@example.com',
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertSucceeds(
      getDoc(
        doc(
          firestore,
          'users',
          'user-two'
        )
      )
    );
  }
);

test(
  'an unauthenticated user cannot read user profiles',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'users',
            'user-two'
          ),
          {
            uid: 'user-two',
            fullName: 'Test User Two',
            email: 'user-two@example.com',
          }
        );
      }
    );

    const unauthenticatedContext =
      testEnvironment.unauthenticatedContext();

    const firestore =
      unauthenticatedContext.firestore();

    await assertFails(
      getDoc(
        doc(
          firestore,
          'users',
          'user-two'
        )
      )
    );
  }
);

test(
  'a user can update the user own profile',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'users',
            'user-one'
          ),
          {
            uid: 'user-one',
            fullName: 'Original Name',
            email: 'user-one@example.com',
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertSucceeds(
      updateDoc(
        doc(
          firestore,
          'users',
          'user-one'
        ),
        {
          fullName: 'Updated Name',
        }
      )
    );
  }
);

test(
  'a user cannot update another user profile',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'users',
            'user-two'
          ),
          {
            uid: 'user-two',
            fullName: 'Original Name',
            email: 'user-two@example.com',
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      updateDoc(
        doc(
          firestore,
          'users',
          'user-two'
        ),
        {
          fullName: 'Unauthorized Change',
        }
      )
    );
  }
);

test(
  'an authenticated user cannot read reports',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'reports',
            'report-one'
          ),
          {
            reporterId: 'user-one',
            reporterEmail:
              'user-one@example.com',
            category: 'technical',
            description:
              'Test report description',
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      getDoc(
        doc(
          firestore,
          'reports',
          'report-one'
        )
      )
    );
  }
);

test(
  'a connection request cannot be deleted from the client',
  async () => {
    const requestId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            requestId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      deleteDoc(
        doc(
          firestore,
          'connectionRequests',
          requestId
        )
      )
    );
  }
);
test(
  'a user cannot delete the user own profile document',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'users',
            'user-one'
          ),
          {
            uid: 'user-one',
            fullName: 'Test User One',
            email: 'user-one@example.com',
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      deleteDoc(
        doc(
          firestore,
          'users',
          'user-one'
        )
      )
    );
  }
);

test(
  'a user cannot add an unknown field to the profile',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'users',
            'user-one'
          ),
          {
            uid: 'user-one',
            fullName: 'Test User One',
            email: 'user-one@example.com',
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      updateDoc(
        doc(
          firestore,
          'users',
          'user-one'
        ),
        {
          administrator: true,
        }
      )
    );
  }
);

test(
  'a user cannot change the stored uid',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'users',
            'user-one'
          ),
          {
            uid: 'user-one',
            fullName: 'Test User One',
            email: 'user-one@example.com',
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      updateDoc(
        doc(
          firestore,
          'users',
          'user-one'
        ),
        {
          uid: 'user-two',
        }
      )
    );
  }
);
test(
  'an authenticated user can create a valid email profile',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertSucceeds(
      setDoc(
        doc(
          firestore,
          'users',
          'user-one'
        ),
        {
          uid: 'user-one',
          fullName: 'Test User One',
          email: 'user-one@example.com',
          interfaceLanguage: 'es',
          nativeLanguage: 'es',
          learningLanguage: 'en',
          level: 'a1',
          profileCompleted: true,
          online: false,
          accountCreatedAt: null,
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);
test(
  'an authenticated user can create a valid Google profile without uid',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-google'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertSucceeds(
      setDoc(
        doc(
          firestore,
          'users',
          'user-google'
        ),
        {
          fullName: 'Google Test User',
          email: 'google-user@example.com',
          photoURL:
            'https://example.com/profile.jpg',
          authProvider: 'google',
          interfaceLanguage: 'es',
          isProfileVisible: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);
test(
  'a sender can create a valid connection request',
  async () => {
    const requestId = 'user-one_user-two';

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertSucceeds(
      setDoc(
        doc(
          firestore,
          'connectionRequests',
          requestId
        ),
        {
          senderId: 'user-one',
          recipientId: 'user-two',
          senderName: 'Test User One',
          recipientName: 'Test User Two',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);

test(
  'a recipient can accept a pending connection request',
  async () => {
    const requestId = 'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            requestId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const recipientContext =
      testEnvironment.authenticatedContext(
        'user-two'
      );

    const firestore =
      recipientContext.firestore();

    await assertSucceeds(
      updateDoc(
        doc(
          firestore,
          'connectionRequests',
          requestId
        ),
        {
          status: 'accepted',
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);
test(
  'a connection request cannot contain unknown fields',
  async () => {
    const requestId = 'user-one_user-two';

    const senderContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      senderContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'connectionRequests',
          requestId
        ),
        {
          senderId: 'user-one',
          recipientId: 'user-two',
          senderName: 'Test User One',
          recipientName: 'Test User Two',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          administratorApproved: true,
        }
      )
    );
  }
);

test(
  'a recipient cannot change request names when responding',
  async () => {
    const requestId = 'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            requestId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const recipientContext =
      testEnvironment.authenticatedContext(
        'user-two'
      );

    const firestore =
      recipientContext.firestore();

    await assertFails(
      updateDoc(
        doc(
          firestore,
          'connectionRequests',
          requestId
        ),
        {
          status: 'accepted',
          senderName: 'Changed Name',
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);

test(
  'a recipient cannot use an invalid updatedAt value',
  async () => {
    const requestId = 'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            requestId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const recipientContext =
      testEnvironment.authenticatedContext(
        'user-two'
      );

    const firestore =
      recipientContext.firestore();

    await assertFails(
      updateDoc(
        doc(
          firestore,
          'connectionRequests',
          requestId
        ),
        {
          status: 'accepted',
          updatedAt: 'not-a-server-timestamp',
        }
      )
    );
  }
);
test(
  'a participant can create a valid conversation for an accepted connection',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            conversationId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'accepted',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const participantContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      participantContext.firestore();

    await assertSucceeds(
      setDoc(
        doc(
          firestore,
          'conversations',
          conversationId
        ),
        {
          connectionId: conversationId,
          participants: [
            'user-one',
            'user-two',
          ],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);

test(
  'a conversation participant can read the conversation',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            conversationId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'accepted',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId
          ),
          {
            connectionId: conversationId,
            participants: [
              'user-one',
              'user-two',
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const participantContext =
      testEnvironment.authenticatedContext(
        'user-two'
      );

    const firestore =
      participantContext.firestore();

    await assertSucceeds(
      getDoc(
        doc(
          firestore,
          'conversations',
          conversationId
        )
      )
    );
  }
);
test(
  'a conversation cannot contain unknown fields',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            conversationId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'accepted',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const participantContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      participantContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'conversations',
          conversationId
        ),
        {
          connectionId: conversationId,
          participants: [
            'user-one',
            'user-two',
          ],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          administratorMessage: true,
        }
      )
    );
  }
);

test(
  'a conversation connectionId must match its document id',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            conversationId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'accepted',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const participantContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      participantContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'conversations',
          conversationId
        ),
        {
          connectionId: 'different-connection',
          participants: [
            'user-one',
            'user-two',
          ],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);

test(
  'a conversation cannot use invalid timestamps',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            conversationId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'accepted',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const participantContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      participantContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'conversations',
          conversationId
        ),
        {
          connectionId: conversationId,
          participants: [
            'user-one',
            'user-two',
          ],
          createdAt: 'invalid-date',
          updatedAt: 'invalid-date',
        }
      )
    );
  }
);
test(
  'a conversation participant can send a valid message',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            conversationId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'accepted',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId
          ),
          {
            connectionId: conversationId,
            participants: [
              'user-one',
              'user-two',
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const senderContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      senderContext.firestore();

    await assertSucceeds(
      setDoc(
        doc(
          firestore,
          'conversations',
          conversationId,
          'messages',
          'message-one'
        ),
        {
          senderId: 'user-one',
          text: 'Hello from user one',
          createdAt: serverTimestamp(),
          readAt: null,
        }
      )
    );
  }
);

test(
  'a message recipient can mark a received message as read',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'connectionRequests',
            conversationId
          ),
          {
            senderId: 'user-one',
            recipientId: 'user-two',
            senderName: 'Test User One',
            recipientName: 'Test User Two',
            status: 'accepted',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId
          ),
          {
            connectionId: conversationId,
            participants: [
              'user-one',
              'user-two',
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId,
            'messages',
            'message-one'
          ),
          {
            senderId: 'user-one',
            text: 'Hello from user one',
            createdAt: serverTimestamp(),
            readAt: null,
          }
        );
      }
    );

    const recipientContext =
      testEnvironment.authenticatedContext(
        'user-two'
      );

    const firestore =
      recipientContext.firestore();

    await assertSucceeds(
      updateDoc(
        doc(
          firestore,
          'conversations',
          conversationId,
          'messages',
          'message-one'
        ),
        {
          readAt: serverTimestamp(),
        }
      )
    );
  }
);
test(
  'a message cannot contain unknown fields',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId
          ),
          {
            connectionId: conversationId,
            participants: [
              'user-one',
              'user-two',
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const senderContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      senderContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'conversations',
          conversationId,
          'messages',
          'message-one'
        ),
        {
          senderId: 'user-one',
          text: 'Hello from user one',
          createdAt: serverTimestamp(),
          readAt: null,
          administratorApproved: true,
        }
      )
    );
  }
);

test(
  'a message cannot use an invalid createdAt value',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId
          ),
          {
            connectionId: conversationId,
            participants: [
              'user-one',
              'user-two',
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const senderContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      senderContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'conversations',
          conversationId,
          'messages',
          'message-one'
        ),
        {
          senderId: 'user-one',
          text: 'Hello from user one',
          createdAt: 'invalid-date',
          readAt: null,
        }
      )
    );
  }
);

test(
  'a new message must begin with readAt set to null',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId
          ),
          {
            connectionId: conversationId,
            participants: [
              'user-one',
              'user-two',
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const senderContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      senderContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'conversations',
          conversationId,
          'messages',
          'message-one'
        ),
        {
          senderId: 'user-one',
          text: 'Hello from user one',
          createdAt: serverTimestamp(),
          readAt: serverTimestamp(),
        }
      )
    );
  }
);
test(
  'a message sender cannot mark the sender own message as read',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId
          ),
          {
            connectionId: conversationId,
            participants: [
              'user-one',
              'user-two',
            ],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        await setDoc(
          doc(
            firestore,
            'conversations',
            conversationId,
            'messages',
            'message-one'
          ),
          {
            senderId: 'user-one',
            text: 'Hello from user one',
            createdAt: serverTimestamp(),
            readAt: null,
          }
        );
      }
    );

    const senderContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      senderContext.firestore();

    await assertFails(
      updateDoc(
        doc(
          firestore,
          'conversations',
          conversationId,
          'messages',
          'message-one'
        ),
        {
          readAt: serverTimestamp(),
        }
      )
    );
  }
);
test(
  'an authenticated user can create a valid report',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one',
        {
          email: 'user-one@example.com',
        }
      );

    const firestore =
      authenticatedContext.firestore();

    await assertSucceeds(
      setDoc(
        doc(
          firestore,
          'reports',
          'report-one'
        ),
        {
          reporterId: 'user-one',
          reporterEmail:
            'user-one@example.com',
          category: 'technical',
          description:
            'This is a valid test report.',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);
test(
  'a report cannot use another user as reporter',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'reports',
          'report-one'
        ),
        {
          reporterId: 'user-two',
          reporterEmail:
            'user-two@example.com',
          category: 'technical',
          description:
            'This is a valid test description.',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);

test(
  'a report cannot use an invalid category',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'reports',
          'report-one'
        ),
        {
          reporterId: 'user-one',
          reporterEmail:
            'user-one@example.com',
          category: 'administrator',
          description:
            'This is a valid test description.',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);

test(
  'a report cannot contain unknown fields',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'reports',
          'report-one'
        ),
        {
          reporterId: 'user-one',
          reporterEmail:
            'user-one@example.com',
          category: 'technical',
          description:
            'This is a valid test description.',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          administratorApproved: true,
        }
      )
    );
  }
);
test(
  'an authenticated user can create a valid account deletion request',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertSucceeds(
      setDoc(
        doc(
          firestore,
          'accountDeletionRequests',
          'deletion-request-one'
        ),
        {
          userId: 'user-one',
          userEmail:
            'user-one@example.com',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);
test(
  'an account deletion request cannot use another user id',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'accountDeletionRequests',
          'deletion-request-one'
        ),
        {
          userId: 'user-two',
          userEmail:
            'user-two@example.com',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);

test(
  'an account deletion request cannot use an invalid status',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'accountDeletionRequests',
          'deletion-request-one'
        ),
        {
          userId: 'user-one',
          userEmail:
            'user-one@example.com',
          status: 'approved',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);

test(
  'an account deletion request cannot contain unknown fields',
  async () => {
    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          'accountDeletionRequests',
          'deletion-request-one'
        ),
        {
          userId: 'user-one',
          userEmail:
            'user-one@example.com',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          administratorApproved: true,
        }
      )
    );
  }
);
test(
  'a historical user profile with city can be updated',
  async () => {
    await testEnvironment.withSecurityRulesDisabled(
      async (context) => {
        const firestore = context.firestore();

        await setDoc(
          doc(
            firestore,
            'users',
            'user-one'
          ),
          {
            uid: 'user-one',
            fullName: 'Historical User',
            email: 'user-one@example.com',
            city: 'Historical City',
            countryCode: 'DO',
            countryName: 'Dominican Republic',
            bio: 'Original biography',
            interfaceLanguage: 'es',
            nativeLanguage: 'es',
            learningLanguage: 'en',
            level: 'b1',
            online: false,
            photoURL: '',
            googlePhotoURL: '',
            profileCompleted: true,
            blockedUserIds: [],
            isProfileVisible: true,
            deletionRequested: false,
            updatedAt: serverTimestamp(),
          }
        );
      }
    );

    const authenticatedContext =
      testEnvironment.authenticatedContext(
        'user-one'
      );

    const firestore =
      authenticatedContext.firestore();

    await assertSucceeds(
      updateDoc(
        doc(
          firestore,
          'users',
          'user-one'
        ),
        {
          bio: 'Updated biography',
          updatedAt: serverTimestamp(),
        }
      )
    );
  }
);