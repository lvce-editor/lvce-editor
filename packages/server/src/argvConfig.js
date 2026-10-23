import { parse } from '@lvce-editor/jsonc-parser'
import { readFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

const applicationName = 'lvce-oss'
const keyPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/
const optionsWithSeparateValues = new Set(['--connection-token', '--idle-timeout', '--link', '--only-extension', '--port', '--test-path'])
const reclaimerFeatureName = 'PartitionAllocMemoryReclaimer'
const reclaimerFeature = `${reclaimerFeatureName}:interval/1800s`

const getArgument = (key, value) => {
  return `--${key}=${value}`
}

const getArgumentsForValue = (key, value) => {
  if (value === true) {
    return [`--${key}`]
  }
  if (value === false) {
    return []
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return [getArgument(key, value)]
  }
  if (Array.isArray(value) && value.every((item) => typeof item === 'string' || typeof item === 'number')) {
    return value.map((item) => getArgument(key, item))
  }
  throw new TypeError(`Invalid argv.json value for "${key}": expected a boolean, string, number, or array of strings and numbers`)
}

export const parseArgvConfig = (content) => {
  const config = parse(content)
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('Invalid argv.json: expected an object')
  }
  const argumentsFromConfig = []
  for (const [key, value] of Object.entries(config)) {
    if (!keyPattern.test(key)) {
      throw new TypeError(`Invalid argv.json key "${key}"`)
    }
    argumentsFromConfig.push(...getArgumentsForValue(key, value))
  }
  return argumentsFromConfig
}

export const getArgvConfigPath = (env = process.env, homeDirectory = homedir()) => {
  const configDirectory = env.XDG_CONFIG_HOME || (homeDirectory ? join(homeDirectory, '.config') : tmpdir())
  return join(configDirectory, applicationName, 'argv.json')
}

export const load = async (path) => {
  try {
    const content = await readFile(path, 'utf8')
    return parseArgvConfig(content)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

export const prepend = (argv, argumentsToPrepend) => {
  argv.splice(2, 0, ...argumentsToPrepend)
}

const getFeatureName = (feature) => feature.split(/[:<]/, 1)[0].trim()

export const addDefaultMemoryReclaimerFeature = (args) => {
  const enabledFeatures = []
  const disabledFeatures = []
  const keptArgs = []
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === '--enable-features' || arg === '--disable-features') {
      const target = arg === '--enable-features' ? enabledFeatures : disabledFeatures
      target.push(
        ...(args[index + 1] || '')
          .split(',')
          .map((feature) => feature.trim())
          .filter(Boolean),
      )
      index++
      continue
    }
    if (arg.startsWith('--enable-features=')) {
      enabledFeatures.push(
        ...arg
          .slice('--enable-features='.length)
          .split(',')
          .map((feature) => feature.trim())
          .filter(Boolean),
      )
      continue
    }
    if (arg.startsWith('--disable-features=')) {
      disabledFeatures.push(
        ...arg
          .slice('--disable-features='.length)
          .split(',')
          .map((feature) => feature.trim())
          .filter(Boolean),
      )
      continue
    }
    keptArgs.push(arg)
  }

  if (disabledFeatures.some((feature) => getFeatureName(feature) === reclaimerFeatureName)) {
    return args
  }

  const reclaimerIndices = enabledFeatures.flatMap((feature, index) => (getFeatureName(feature) === reclaimerFeatureName ? [index] : []))
  const explicitReclaimerIndex = reclaimerIndices.findLast((index) => enabledFeatures[index].includes(':'))
  const featureIndex = reclaimerIndices[0] ?? enabledFeatures.length
  const selectedReclaimerFeature = explicitReclaimerIndex === undefined ? reclaimerFeature : enabledFeatures[explicitReclaimerIndex]
  const mergedFeatures = enabledFeatures.filter((feature) => getFeatureName(feature) !== reclaimerFeatureName)
  mergedFeatures.splice(featureIndex, 0, selectedReclaimerFeature)

  const featureArguments = [`--enable-features=${mergedFeatures.join(',')}`]
  keptArgs.unshift(...featureArguments)
  return keptArgs
}

export const getWorkspaceArgument = (args) => {
  for (let index = 0; index < args.length; index++) {
    const argument = args[index]
    if (optionsWithSeparateValues.has(argument)) {
      index++
      continue
    }
    if (!argument.startsWith('-')) {
      return argument
    }
  }
  return ''
}
