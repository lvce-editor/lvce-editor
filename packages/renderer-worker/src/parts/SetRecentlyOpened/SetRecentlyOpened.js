import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Json from '../Json/Json.js'

export const setRecentlyOpened = async (newRecentlyOpened) => {
  const stringified = Json.stringify(newRecentlyOpened)
  await FileSystem.writeFile('app://recently-opened.json', stringified)
}
