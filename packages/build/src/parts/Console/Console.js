import * as Logger from '../Logger/Logger.js'

// Netlify throws error TypeError: process.stdout.clearLine is not a function
const isNetlify = typeof process.stdout.clearLine !== 'function'

export const time = (name) => {
  if (isNetlify) {
    return
  }
  console.time(name)
}

export const timeEnd = (name) => {
  if (isNetlify) {
    Logger.info(`finished ${name}`)
    return
  }
  console.timeEnd(name)
}
