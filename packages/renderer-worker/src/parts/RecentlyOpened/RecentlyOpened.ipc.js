import * as RecentlyOpened from './RecentlyOpened.js'

export const name = 'RecentlyOpened'

// prettier-ignore
export const Commands = {
  addToRecentlyOpened: RecentlyOpened.addToRecentlyOpened,
  clearRecentlyOpened: RecentlyOpened.clearRecentlyOpened,
  getRecentlyOpened: RecentlyOpened.getRecentlyOpened,
  hydrate: RecentlyOpened.hydrate,
}
