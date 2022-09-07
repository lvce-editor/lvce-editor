import * as Command from '../Command/Command.js'
import * as Audio from './Audio.js'
import * as CommandId from '../CommandId/CommandId.js'

export const __initialize__ = () => {
  Command.register(CommandId.AUDIO_PLAY, Audio.play)
}
