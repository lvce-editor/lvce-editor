import { WebContentsView } from 'electron'

/**
 *
 * @param {unknown} value
 * @returns {value is WebContentsView}
 */
export const isWebContentsView = (value) => {
  if (value && value.constructor && value.constructor.name === 'WebContentsView') {
    return true
  }
  return false
}
