import * as Command from '../Command/Command.js'
import * as Preferences from './Preferences.js'

// prettier-ignore
export const __initialize__ = () => {
  // TODO rename to openKeyBindingsJson -> similar to openSettingsJson
  // TODO is this needed?
  Command.register('Preferences.openSettingsJson', Preferences.openSettingsJson)
  Command.register('Preferences.openSettingsJson', Preferences.openSettingsJson)
  Command.register('Preferences.openKeyBindingsJson', Preferences.openKeyBindingsJson)
  Command.register('Preferences.hydrate', Preferences.hydrate)
}
