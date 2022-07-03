import {
  openDB,
  deleteDB,
  wrap,
  unwrap,
} from 'https://cdn.jsdelivr.net/npm/idb@7/+esm'

export const state = {
  databases: Object.create(null),
  eventId: 0,
  dbVersion: 2,
}

export const saveValue = async (storeId, value) => {
  try {
    const db = await openDB('session', state.dbVersion, {
      async upgrade(db) {
        console.log('upgrade db')
        await db.createObjectStore(storeId)
      },
    })
    const eventId = state.eventId++
    await db.put(storeId, value, eventId)
  } catch (error) {
    throw new Error('Failed to save value to indexed db', {
      // @ts-ignore
      cause: error,
    })
  }
}

export const getValues = async (storeId) => {
  try {
    console.log({ storeId })
    const db = await openDB('session', state.dbVersion, {
      async upgrade(db) {
        await db.createObjectStore(storeId)
      },
    })

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
