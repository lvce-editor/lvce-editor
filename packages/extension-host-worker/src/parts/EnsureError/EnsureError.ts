// ensureError based on https://github.com/sindresorhus/ensure-error/blob/main/index.ts (License MIT)
import { NonError } from '../NonError/NonError.ts'

export const ensureError = (input) => {
  if (!(input instanceof Error)) {
    return new NonError(input)
  }
  return input
}
