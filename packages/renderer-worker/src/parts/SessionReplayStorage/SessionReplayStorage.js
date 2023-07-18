import * as IndexedDb from '../IndexedDb/IndexedDb.js'

export const saveValue = async (sessionId, value) => {
  await IndexedDb.saveValue(sessionId, value)
}

export const getValuesByIndexName = async (indexId, filterKey, filterValue) => {
  const events = await IndexedDb.getValuesByIndexName(indexId, filterKey, filterValue)
  return events
}
