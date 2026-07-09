import { tmpdir } from 'node:os'

export const getTmpDir = (): any => {
  return tmpdir()
}
