import { tmpdir } from 'node:os'

export const getTmpDir = () => {
  return tmpdir()
}
