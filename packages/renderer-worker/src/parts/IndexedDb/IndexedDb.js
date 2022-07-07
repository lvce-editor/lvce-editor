import { openDB } from '../../../../../static/js/idb/index.js'

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
        await db.createObjectStore('session', { autoIncrement: true })
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
