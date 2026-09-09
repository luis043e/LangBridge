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