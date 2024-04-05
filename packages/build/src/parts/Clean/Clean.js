import * as Remove from '../Remove/Remove.js'

export const clean = async () => {
  await Remove.remove('packages/build/.tmp')
}
