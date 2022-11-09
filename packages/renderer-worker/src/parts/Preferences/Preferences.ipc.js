import * as Preferences from './Preferences.js'

export const name = 'Preferences'

// prettier-ignore
export const Commands = {
  // TODO is this needed?
  // TODO rename to openKeyBindingsJson -> similar to openSettingsJson
  hydrate: Preferences.hydrate,
  openKeyBindingsJson: Preferences.openKeyBindingsJson,
  openSettingsJson: Preferences.openSettingsJson,
}
