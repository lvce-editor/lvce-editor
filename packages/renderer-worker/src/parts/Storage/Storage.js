export const save = (key, value) => {
  let db
  const request = indexedDB.open('vscode-db', 4)

  request.onsuccess = (event) => {
    // @ts-ignore
    const db = event.target.result
    const tx = db.transaction('vscode', 'readwrite')
    // var store = tx.objectStore('vscode')

    // Add some data
  }

  // This event is only implemented in recent browsers
  request.onupgradeneeded = (event) => {
    // Save the IDBDatabase interface
    // @ts-ignore
    const db = event.target.result

    // Create an objectStore for this database
    const store = db.createObjectStore('vscode')

    store.put(value, key)
    // store.put({ name: { first: 'Bob', last: 'Smith' }, age: 35 }, 'user-2')
    // objectStore.
  }
}
