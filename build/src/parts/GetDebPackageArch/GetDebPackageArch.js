import * as ArchType from '../ArchType/ArchType.js'
import * as DebArchType from '../DebArchType/DebArchType.js'

export const getDebPackageArch = (arch) => {
  switch (arch) {
    case ArchType.X64:
    case ArchType.Amd64:
      return DebArchType.Amd64
    case ArchType.ArmHf:
    case ArchType.Armv7l:
      return DebArchType.ArmHf
    case ArchType.Arm64:
      return DebArchType.Arm64
    default:
      throw new Error(`unsupported arch "${arch}"`)
  }
}
