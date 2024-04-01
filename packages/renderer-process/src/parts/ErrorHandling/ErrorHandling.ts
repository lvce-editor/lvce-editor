import * as PrettyError from '../PrettyError/PrettyError.ts'

export const state = {
  /**
   * @type {string[]}
   */
  seenWarnings: [],
}

export const logError = async (error, prefix = '') => {
  const prettyError = await PrettyError.prepare(error)
  PrettyError.print(prettyError, prefix)
  return prettyError
}

export const handleError = async (error, notify = true, prefix = '') => {
  try {
    const prettyError = await logError(error, prefix)
    if (notify) {
      alert(PrettyError.getMessage(prettyError))
    }
  } catch (otherError) {
    console.warn(`ErrorHandling error`)
    console.warn(otherError)
    console.error(error)
  }
}
