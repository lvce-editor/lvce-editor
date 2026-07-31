import * as Hash from '../Hash/Hash.ts'
import * as ReadFile from '../ReadFile/ReadFile.ts'

const defaultIconThemePath = 'extensions/builtin.vscode-icons/icon-theme.json'

export const getIconThemeEtag = async ({ iconThemePath = defaultIconThemePath, iconPath = '/icons' } = {}): Promise<string> => {
  const content = await ReadFile.readFile(iconThemePath)
  const builtContent = content.replaceAll('/icons', iconPath)
  return Hash.computeHash(builtContent)
}
