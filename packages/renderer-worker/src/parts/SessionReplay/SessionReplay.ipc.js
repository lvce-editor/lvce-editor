import * as Command from '../Command/Command.js'
import * as SessionReplay from './SessionReplay.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('SessionReplay.downloadSession', SessionReplay.downloadSession)
  Command.register('SessionReplay.replayCurrentSession', SessionReplay.replayCurrentSession)
  Command.register('SessionReplay.replaySession', SessionReplay.replaySession)
  Command.register('SessionReplay.openSession', SessionReplay.openSession)
}
