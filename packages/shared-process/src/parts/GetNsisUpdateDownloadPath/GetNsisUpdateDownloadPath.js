import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.js'
import * as Platform from '../Platform/Platform.js'

export const getNsisUpdateDownloadPath = (version) => {
  Assert.string(version)
  const name = Platform.applicationName
  const outFile = join(tmpdir(), `${name}-update-${version}.exe`)
  return outFile
}
