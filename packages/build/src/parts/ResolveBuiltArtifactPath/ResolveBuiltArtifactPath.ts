import * as ElectronBuilderConfigType from '../ElectronBuilderConfigType/ElectronBuilderConfigType.ts'
import * as FileExtension from '../FileExtension/FileExtension.ts'
import * as Path from '../Path/Path.ts'

const getArtifactExtension = (config) => {
  switch (config) {
    case ElectronBuilderConfigType.ArchLinux:
      return FileExtension.Pacman
    case ElectronBuilderConfigType.Deb:
      return FileExtension.Deb
    case ElectronBuilderConfigType.WindowsExe:
      return FileExtension.Exe
    case ElectronBuilderConfigType.Snap:
      return FileExtension.Snap
    case ElectronBuilderConfigType.Mac:
      return FileExtension.Dmg
    case ElectronBuilderConfigType.AppImage:
      return FileExtension.AppImage
    default:
      throw new Error(`cannot get artifact extension for target ${config}`)
  }
}

export const resolveBuiltArtifactPath = ({ config, version, expectedPath, distEntries, distPath }) => {
  const expectedFileName = Path.baseName(expectedPath)
  if (distEntries.includes(expectedFileName)) {
    return expectedPath
  }
  const extension = getArtifactExtension(config)
  const matchingEntries = distEntries.filter((entry) => {
    return entry.endsWith(`.${extension}`) && entry.includes(version)
  })
  if (matchingEntries.length === 1) {
    return Path.join(distPath, matchingEntries[0])
  }
  throw new Error(`failed to resolve built artifact path for target ${config}`)
}
