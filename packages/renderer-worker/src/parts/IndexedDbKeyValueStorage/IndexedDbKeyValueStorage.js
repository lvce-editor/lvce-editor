// TODO high memory usage in idb because of transactionDoneMap

import { openDB } from '../../../../../static/js/idb/with-async-ittr.js'
import { VError } from '../VError/VError.js'

export const state = {
  databases: Object.create(null),
  dbVersion: 2,
  /**
   * @type {any}
   */
  cachedDb: undefined,
}

const storeId = 'lvce-keyvalue'

const getDb = async () => {
  // @ts-ignore
  const db = await openDB(storeId, state.dbVersion, {
    async upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(storeId)) {
        await db.createObjectStore(storeId, {
          autoIncrement: true,
        })
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

export const set = async (key, value) => {
  try {
    const db = await getDbMemoized()
    await db.put(storeId, value, key)
  } catch (error) {
    throw new VError(error, 'Failed to save value to indexed db')
  }
}

export const get = async (key) => {
  try {
    const db = await getDbMemoized()
    const value = db.get(storeId, key)
    return value
  } catch (error) {
    throw new VError(error, 'Failed to get value from indexed db')
  }
}
