import * as RuntimeConfig from '../RuntimeConfig/RuntimeConfig.ts'

export const isEnabled = (): boolean => RuntimeConfig.runtimeConfig.staticFileIcons !== undefined

const getFileIcon = (file: string | { readonly name: string }): string => {
  const name = typeof file === 'string' ? file : file.name
  const baseName = name.slice(name.lastIndexOf('/') + 1)
  return RuntimeConfig.runtimeConfig.staticFileIcons?.[baseName] || ''
}

const getFileIcons = (names: readonly string[]): readonly string[] => names.map(getFileIcon)
const getIcon = (request: { readonly name: string; readonly type: number }): string => (request.type === 1 ? getFileIcon(request.name) : '')
const getIcons = (requests: readonly { readonly name: string; readonly type: number }[]): readonly string[] => requests.map(getIcon)

export const commandMap = {
  'IconTheme.addLanguages': (): void => {},
  'IconTheme.getFileIcon': getFileIcon,
  'IconTheme.getFileIcons': getFileIcons,
  'IconTheme.getFolderIcon': (): string => '',
  'IconTheme.getIcon': getIcon,
  'IconTheme.getIcons': getIcons,
}
