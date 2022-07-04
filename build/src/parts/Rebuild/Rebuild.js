import * as ElectronRebuild from 'electron-rebuild'

export const rebuild = async ({ electronVersion, buildPath, arch }) => {
  console.log({ electronVersion, buildPath, arch })
  await ElectronRebuild.rebuild({
    buildPath,
    electronVersion,
    arch,
    force: true,
  })
}
