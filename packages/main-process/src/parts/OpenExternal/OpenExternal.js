import { shell } from 'electron'
import { VError } from '../VError/VError.js'
import * as ShouldOpenExternal from '../ShouldOpenExternal/ShouldOpenExternal.js'

export const openExternal = async (url) => {
  if (!ShouldOpenExternal.shouldOpenExternal(url)) {
    throw new VError(`only http or https urls are allowed`)
  }
  await shell.openExternal(url)
}
