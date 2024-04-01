import { NonError } from '../NonError/NonError.js'

// ensureError based on https://github.com/sindresorhus/ensure-error/blob/main/index.js (License MIT)
export const ensureError = (input) => {
  if (!(input instanceof Error)) {
    return new NonError(input)
  }
  return input
}
