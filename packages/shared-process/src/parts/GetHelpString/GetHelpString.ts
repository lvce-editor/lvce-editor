import * as Platform from '../Platform/Platform.ts'

export const getHelpString = (): any => {
  return `${Platform.applicationName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]
`
}
