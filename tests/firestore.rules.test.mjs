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
