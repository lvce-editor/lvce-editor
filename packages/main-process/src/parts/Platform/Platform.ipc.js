import * as Platform from './Platform.cjs'

export const name = 'Platform'

export const Commands = {
  getCommit: Platform.getCommit,
  getVersion: Platform.getVersion,
}
