import {
  readFile,
} from 'node:fs/promises';

import {
  after,
  afterEach,
  before,
  test,
} from 'node:test';

import {
  strict as assert,
} from 'node:assert';

import {
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

const projectId =
  'langbridge-d048f';

let testEnvironment;

before(async () => {
  const firestoreRules =
    await readFile(
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
        rules:
          firestoreRules,
      },
    });
});

afterEach(async () => {
  await testEnvironment
    .clearFirestore();
});

after(async () => {
  await testEnvironment.cleanup();
});

test(
  'the unread query returns only unread messages from the conversation partner',
  async () => {
    const conversationId =
      'user-one_user-two';

    await testEnvironment
      .withSecurityRulesDisabled(
        async (context) => {
          const firestore =
            context.firestore();

          await setDoc(
            doc(
              firestore,
              'conversations',
              conversationId
            ),
            {
              connectionId:
                conversationId,
              participants: [
                'user-one',
                'user-two',
              ],
            }
          );

          const messages =
            collection(
              firestore,
              'conversations',
              conversationId,
              'messages'
            );

          await setDoc(
            doc(
              messages,
              'unread-from-partner'
            ),
            {
              senderId:
                'user-two',
              text:
                'Unread received message',
              readAt:
                null,
            }
          );

          await setDoc(
            doc(
              messages,
              'read-from-partner'
            ),
            {
              senderId:
                'user-two',
              text:
                'Read received message',
              readAt:
                new Date(),
            }
          );

          await setDoc(
            doc(
              messages,
              'unread-from-current-user'
            ),
            {
              senderId:
                'user-one',
              text:
                'Unread sent message',
              readAt:
                null,
            }
          );
        }
      );

    const authenticatedContext =
      testEnvironment
        .authenticatedContext(
          'user-one'
        );

    const firestore =
      authenticatedContext
        .firestore();

    const unreadMessagesQuery =
      query(
        collection(
          firestore,
          'conversations',
          conversationId,
          'messages'
        ),
        where(
          'senderId',
          '==',
          'user-two'
        ),
        where(
          'readAt',
          '==',
          null
        )
      );

    const querySnapshot =
      await assertSucceeds(
        getDocs(
          unreadMessagesQuery
        )
      );

    assert.equal(
      querySnapshot.size,
      1
    );

    assert.equal(
      querySnapshot.docs[0]?.id,
      'unread-from-partner'
    );
  }
);