import * as Remove from '../Remove/Remove.ts'

export const clean = async () => {
  await Remove.remove('packages/build/.tmp')
}
