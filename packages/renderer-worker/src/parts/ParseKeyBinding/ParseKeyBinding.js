import * as ParseKey from '../ParseKey/ParseKey.js'

export const parseKeyBinding = (keyBinding) => {
  return {
    ...keyBinding,
    rawKey: keyBinding.key,
    ...ParseKey.parseKey(keyBinding.key),
  }
}
