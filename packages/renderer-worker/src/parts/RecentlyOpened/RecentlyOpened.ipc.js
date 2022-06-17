import * as Command from '../Command/Command.js'
import * as RecentlyOpened from './RecentlyOpened.js'

export const __initialize__ = () => {
  Command.register(5430, RecentlyOpened.getRecentlyOpened)
  Command.register(5432, RecentlyOpened.clearRecentlyOpened)
  Command.register(5433, RecentlyOpened.addToRecentlyOpened)
  Command.register(5434, RecentlyOpened.hydrate)
}
