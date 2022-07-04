import * as Command from '../Command/Command.js'
import * as RecentlyOpened from './RecentlyOpened.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('RecentlyOpened.getRecentlyOpened', RecentlyOpened.getRecentlyOpened)
  Command.register('RecentlyOpened.clearRecentlyOpened', RecentlyOpened.clearRecentlyOpened)
  Command.register('RecentlyOpened.addToRecentlyOpened', RecentlyOpened.addToRecentlyOpened)
  Command.register('RecentlyOpened.hydrate', RecentlyOpened.hydrate)
}
