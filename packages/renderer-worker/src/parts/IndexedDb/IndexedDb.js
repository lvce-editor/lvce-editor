import {
  openDB,
  deleteDB,
  wrap,
  unwrap,
} from 'https://cdn.jsdelivr.net/npm/idb@7/+esm'

export const state = {
  databases: Object.create(null),
  eventId: 0,
}

export const saveValue = async (value) => {
  const db = await openDB('session', 2, {
    async upgrade(db) {
      await db.createObjectStore('session')
    },
  })

  const eventId = state.eventId++
  // const value = await db.get(storeName, key);
  // Set a value in a store:
  await db.put('session', value, eventId)
  // console.log({ db })
}
