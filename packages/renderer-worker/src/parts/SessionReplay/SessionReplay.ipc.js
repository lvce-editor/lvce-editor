import * as Command from '../Command/Command.js'
import * as SessionReplay from './SessionReplay.js'

export const __initialize__ = () => {
  Command.register('SessionReplay.replaySession', SessionReplay.replaySession)
}
