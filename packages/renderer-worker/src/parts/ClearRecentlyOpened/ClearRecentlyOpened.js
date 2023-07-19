import * as SetRecentlyOpened from '../SetRecentlyOpened/SetRecentlyOpened.js'

export const clearRecentlyOpened = async () => {
  await SetRecentlyOpened.setRecentlyOpened([])
}
