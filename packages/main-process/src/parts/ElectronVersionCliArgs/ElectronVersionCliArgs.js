const ElectronVersionFlags = new Set(['--electron-version', '--electronVersion'])

export const normalizeElectronVersion = (electronVersion) => {
  if (electronVersion.startsWith('v')) {
    return electronVersion.slice(1)
  }
  return electronVersion
}

const getFlagName = (arg) => {
  const equalsIndex = arg.indexOf('=')
  if (equalsIndex === -1) {
    return arg
  }
  return arg.slice(0, equalsIndex)
}

const getFlagValue = (arg) => {
  const equalsIndex = arg.indexOf('=')
  if (equalsIndex === -1) {
    return ''
  }
  return arg.slice(equalsIndex + 1)
}

const isMissingElectronVersionValue = (value) => {
  return !value || value.startsWith('--')
}

export const parseElectronVersionCliArgs = (argv) => {
  let electronVersion = ''
  const filteredArgv = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    const flagName = getFlagName(arg)
    if (!ElectronVersionFlags.has(flagName)) {
      filteredArgv.push(arg)
      continue
    }
    const hasInlineValue = arg.includes('=')
    const value = hasInlineValue ? getFlagValue(arg) : argv[i + 1]
    if (isMissingElectronVersionValue(value)) {
      throw new Error(`${flagName} requires an Electron version`)
    }
    if (!electronVersion) {
      electronVersion = value
    }
    if (!hasInlineValue) {
      i++
    }
  }
  if (!electronVersion) {
    return undefined
  }
  return {
    electronVersion: normalizeElectronVersion(electronVersion),
    filteredArgv,
  }
}
