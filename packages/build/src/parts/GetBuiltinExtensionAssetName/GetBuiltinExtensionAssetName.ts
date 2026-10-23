import { getBuiltinExtensionRepository } from '../GetBuiltinExtensionRepository/GetBuiltinExtensionRepository.ts'

export const getBuiltinExtensionAssetName = (extension, version = extension.version) => {
  if (!extension.assetName) {
    const repository = getBuiltinExtensionRepository(extension)
    const baseName = repository.slice(repository.lastIndexOf('/') + 1)
    return `${baseName}-v${version}.tar.br`
  }
  if (version === extension.version) {
    return extension.assetName
  }
  const suffix = `-v${extension.version}.tar.br`
  if (!extension.assetName.endsWith(suffix)) {
    throw new Error(`cannot update versioned archive for ${extension.name}`)
  }
  return `${extension.assetName.slice(0, -suffix.length)}-v${version}.tar.br`
}
