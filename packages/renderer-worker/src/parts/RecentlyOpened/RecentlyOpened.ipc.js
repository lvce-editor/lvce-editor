import * as RecentlyOpened from './RecentlyOpened.js'

export const name = 'RecentlyOpened'

// prettier-ignore
export const Commands = {
  addToRecentlyOpened: RecentlyOpened.addToRecentlyOpened,
  clearRecentlyOpened: RecentlyOpened.clearRecentlyOpened,
  getRecentlyOpened: RecentlyOpened.getRecentlyOpened,
  removeRecentlyOpened: RecentlyOpened.removeRecentlyOpened,
  hydrate: RecentlyOpened.hydrate,
}
