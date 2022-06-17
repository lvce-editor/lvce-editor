import * as Command from '../Command/Command.js'
import * as Preferences from './Preferences.js'

export const __initialize__ = () => {
  Command.register(1200, Preferences.openSettingsJson)
  Command.register(1201, Preferences.openSettingsJson)
  // TODO rename to openKeyBindingsJson -> similar to openSettingsJson
  // TODO is this needed?
  Command.register(1202, Preferences.openKeyBindingsJson)
  Command.register(1204, Preferences.hydrate)
}
