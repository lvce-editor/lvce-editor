import * as Platform from '../Platform/Platform.cjs'

export const getHelpString = () => {
  return `${Platform.applicationName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]
`
}
