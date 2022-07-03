import * as IndexedDb from '../IndexedDb/IndexedDb.js'

export const handleMessage = async (source, message) => {
  try {
    const timestamp = performance.now()
    // console.log({ message, timestamp })
    await IndexedDb.saveValue({ source, ...message })
  } catch (error) {
    console.info(`failed to save event to indexeddb: ${error}`)
    // ignore
  }
}
