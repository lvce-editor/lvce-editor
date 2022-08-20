import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// TODO this should be in platform module
const getConfigDir = () => {
  return process.env.CONFIG_DIR || ''
}

export const state = {
  cachedConfiguration: undefined,
}

export const configurationChanged = () => {
  state.cachedConfiguration = undefined
}

export const getConfiguration = (key) => {
  console.log('get config', key)
  if (!state.cachedConfiguration) {
    const configDir = getConfigDir()
    if (!configDir) {
      throw new Error('config dir not found')
    }
    try {
      const file = readFileSync(join(configDir, 'settings.json'), 'utf-8')
      const parsed = JSON.parse(file)
      state.cachedConfiguration = parsed
    } catch (error) {
      // @ts-ignore
      if (error && error.code === 'ENOENT') {
        state.cachedConfiguration = Object.create(null)
      } else {
        throw error
      }
    }
  }
  // @ts-ignore
  return state.cachedConfiguration[key]
}
