import {
    readFile,
} from 'node:fs/promises';

import {
    strict as assert,
} from 'node:assert';

import {
    after,
    afterEach,
    before,
    test,
} from 'node:test';

import {
    assertSucceeds,
    initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

import {
    collection,
    doc,
    getDocs,
    limitToLast,
    orderBy,
    query,
    setDoc,
    Timestamp,
    writeBatch,
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
  'the recent messages query returns the latest fifty messages in chronological order',
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

          const messagesReference =
            collection(
              firestore,
              'conversations',
              conversationId,
              'messages'
            );

          const batches = [
            writeBatch(firestore),
            writeBatch(firestore),
          ];

          for (
            let index = 1;
            index <= 75;
            index += 1
          ) {
            const batch =
              index <= 50
                ? batches[0]
                : batches[1];

            const paddedIndex =
              String(index)
                .padStart(3, '0');

            batch.set(
              doc(
                messagesReference,
                `message-${paddedIndex}`
              ),
              {
                senderId:
                  index % 2 === 0
                    ? 'user-one'
                    : 'user-two',
                text:
                  `Message ${paddedIndex}`,
                createdAt:
                  Timestamp.fromMillis(
                    index * 1000
                  ),
                readAt:
                  null,
              }
            );
          }

          await batches[0].commit();
          await batches[1].commit();
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

    const messagesQuery =
      query(
        collection(
          firestore,
          'conversations',
          conversationId,
          'messages'
        ),
        orderBy(
          'createdAt',
          'asc'
        ),
        limitToLast(50)
      );

    const querySnapshot =
      await assertSucceeds(
        getDocs(messagesQuery)
      );

    assert.equal(
      querySnapshot.size,
      50
    );

    assert.equal(
      querySnapshot.docs[0]?.id,
      'message-026'
    );

    assert.equal(
      querySnapshot.docs[49]?.id,
      'message-075'
    );

    const messageIds =
      querySnapshot.docs.map(
        (messageDocument) =>
          messageDocument.id
      );

    const sortedMessageIds =
      [...messageIds].sort();

    assert.deepEqual(
      messageIds,
      sortedMessageIds
    );
  }
);