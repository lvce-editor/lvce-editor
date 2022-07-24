// TODO high memory usage in idb because of transactionDoneMap

import { openDB } from '../../../../../static/js/idb/with-async-ittr.js'

export const state = {
  databases: Object.create(null),
  eventId: 0,
  dbVersion: 1,
  /**
   * @type {any}
   */
  cachedDb: undefined,
}

const getDb = async () => {
  // @ts-ignore
  const db = await openDB('session', state.dbVersion, {
    async upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains('session')) {
        const objectStore = await db.createObjectStore('session', {
          autoIncrement: true,
        })
        objectStore.createIndex('sessionId', 'sessionId', { unique: false })
      }
    },
  })
  return db
}

const getDbMemoized = async () => {
  if (!state.cachedDb) {
    state.cachedDb = await getDb()
  }
  return state.cachedDb
}

export const saveValue = async (storeId, value) => {
  try {
    const db = await getDbMemoized()
    await db.add('session', value)
  } catch (error) {
    throw new Error('Failed to save value to indexed db', {
      // @ts-ignore
      cause: error,
    })
  }
}

export const getValues = async (storeId) => {
  try {
    const db = await getDbMemoized()
    const tx = db.transaction(storeId, 'readwrite')
    const [objects] = await Promise.all([tx.store.getAll(), tx.done])
    console.log({ objects })
    return objects
  } catch (error) {
    throw new Error('Failed to get values from indexed db', {
      // @ts-ignore
      cause: error,
    })
  }
}

export const getValuesByIndexName = async (storeId, indexName, only) => {
  const db = await getDbMemoized()
  const transaction = db.transaction(storeId)
  const index = transaction.store.index(indexName)
  const iterator = index.iterate(only)
  const objects = []
  for await (const cursor of iterator) {
    objects.push(cursor.value)
  }
  return objects
}
