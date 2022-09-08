import * as Preferences from './Preferences.js'

// prettier-ignore
export const Commands = {
  'Preferences.hydrate': Preferences.hydrate,
  'Preferences.openKeyBindingsJson': Preferences.openKeyBindingsJson,
  'Preferences.openSettingsJson': Preferences.openSettingsJson,
  // TODO is this needed?
  // TODO rename to openKeyBindingsJson -> similar to openSettingsJson
}
