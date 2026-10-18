import * as IsProduction from '../IsProduction/IsProduction.js'

export const info = (...args) => {
  if (IsProduction.isProduction) {
    return
  }
  console.info(...args)
}

export const warn = (...args) => {
  if (IsProduction.isProduction) {
    return
  }
  console.warn(...args)
}

export const error = (...args) => {
  console.error(...args)
}
