import * as RuntimeConfig from '../RuntimeConfig/RuntimeConfig.ts'

export const isEnabled = (): boolean => RuntimeConfig.runtimeConfig.staticFileIcons !== undefined

const getFileIcon = (file: string | { readonly name: string }): string => {
  const name = typeof file === 'string' ? file : file.name
  const baseName = name.slice(name.lastIndexOf('/') + 1)
  const icons = RuntimeConfig.runtimeConfig.staticFileIcons
  return icons?.[baseName] || icons?.defaultFileIcon || ''
}

const getFolderIcon = (folder?: string | { readonly name: string }): string => {
  const name = typeof folder === 'string' ? folder : folder?.name || ''
  const baseName = name.slice(name.lastIndexOf('/') + 1)
  const icons = RuntimeConfig.runtimeConfig.staticFileIcons
  return icons?.[`folder:${baseName}`] || icons?.defaultFolderIcon || ''
}

const getFileIcons = (names: readonly string[]): readonly string[] => names.map(getFileIcon)
const getIcon = (request: { readonly name: string; readonly type: number }): string => {
  if (request.type === 1) return getFileIcon(request.name)
  if (request.type === 2) return getFolderIcon(request.name)
  return ''
}

const getIcons = (requests: readonly { readonly name: string; readonly type: number }[]): readonly string[] => requests.map(getIcon)

export const commandMap = {
  'IconTheme.addLanguages': (): void => {},
  'IconTheme.getFileIcon': getFileIcon,
  'IconTheme.getFileIcons': getFileIcons,
  'IconTheme.getFolderIcon': getFolderIcon,
  'IconTheme.getIcon': getIcon,
  'IconTheme.getIcons': getIcons,
}
