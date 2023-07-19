import * as IsString from '../IsString/IsString.js'

export const isValid = (recentlyOpened) => {
  if (!recentlyOpened || !Array.isArray(recentlyOpened)) {
    return false
  }
  return recentlyOpened && Array.isArray(recentlyOpened) && recentlyOpened.every(IsString.isString)
}
