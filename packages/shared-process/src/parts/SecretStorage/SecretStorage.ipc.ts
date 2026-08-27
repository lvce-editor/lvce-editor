import * as SecretStorage from './SecretStorage.ts'

export const name = 'SecretStorage'

export const Commands = {
  delete: SecretStorage.deleteSecret,
  get: SecretStorage.get,
  list: SecretStorage.list,
  store: SecretStorage.store,
}
