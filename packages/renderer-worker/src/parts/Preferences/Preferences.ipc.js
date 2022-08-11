import * as Preferences from './Preferences.js'

// prettier-ignore
export const Commands = {
  // TODO rename to openKeyBindingsJson -> similar to openSettingsJson
  // TODO is this needed?
  'Preferences.openSettingsJson': Preferences.openSettingsJson,
  'Preferences.openKeyBindingsJson': Preferences.openKeyBindingsJson,
  'Preferences.hydrate': Preferences.hydrate,
}
