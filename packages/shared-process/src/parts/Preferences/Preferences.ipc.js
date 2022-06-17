import * as Command from '../Command/Command.js'
import * as Preferences from '../Preferences/Preferences.js'

export const __initialize__ = () => {
  Command.register("Preferences.getAll", Preferences.getAll)
}
