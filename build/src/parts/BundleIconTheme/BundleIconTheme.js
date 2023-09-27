import { VError } from '@lvce-editor/verror'
import * as GetIconThemeCss from '../GetIconThemeCss/GetIconThemeCss.js'
import * as JsonFile from '../JsonFile/JsonFile.js'

export const bundleIconTheme = async ({ iconThemePath }) => {
  try {
    const iconTheme = await JsonFile.readJson(iconThemePath)
    if (!iconTheme) {
      throw new Error(`missing iconTheme property`)
    }
    const extensionPath = '/file-icons'
    const css = GetIconThemeCss.getIconThemeCss(iconTheme, extensionPath)
    return css
  } catch (error) {
    throw new VError(error, `Failed to bundle icon theme`)
  }
}
