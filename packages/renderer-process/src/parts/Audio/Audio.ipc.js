import * as Command from '../Command/Command.js'
import * as Audio from './Audio.js'

export const __initialize__ = () => {
  Command.register('Audio.play', Audio.play)
}
