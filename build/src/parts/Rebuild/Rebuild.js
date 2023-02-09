import * as ElectronRebuild from '@electron/rebuild'
import VError from 'verror'
import * as Process from '../Process/Process.js'

export const rebuild = async ({ electronVersion, buildPath, arch }) => {
  console.log({ electronVersion, buildPath, arch })
  try {
    await ElectronRebuild.rebuild({
      buildPath,
      electronVersion,
      arch,
      force: true,
    })
  } catch (error) {
    if (Process.argv.includes('--force')) {
      console.error(`Failed to rebuild native dependendencies in ${buildPath}: ${error}`)
    } else {
      throw new VError(
        // @ts-ignore
        error,
        `Failed to rebuild native dependendencies in ${buildPath}`
      )
    }
  }
}
