import { parse } from '@lvce-editor/jsonc-parser'
import { readFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

const applicationName = 'lvce-oss'
const keyPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/
const optionsWithSeparateValues = new Set(['--connection-token', '--idle-timeout', '--link', '--only-extension', '--port', '--test-path'])

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
