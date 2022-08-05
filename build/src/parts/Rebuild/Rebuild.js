import * as ElectronRebuild from 'electron-rebuild'
import VError from 'verror'

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
    throw new VError(
      // @ts-ignore
      error,
      `Failed to rebuild native dependendencies in ${buildPath}`
    )
  }
}
