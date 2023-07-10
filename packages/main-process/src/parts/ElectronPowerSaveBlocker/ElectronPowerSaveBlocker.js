import { powerSaveBlocker } from 'electron'

/**
 *
 * @param {'prevent-app-suspension'|'prevent-display-sleep'} type
 * @returns
 */
export const start = (type) => {
  return powerSaveBlocker.start(type)
}

/**
 * @param {number} id
 */
export const stop = (id) => {
  powerSaveBlocker.stop(id)
}
