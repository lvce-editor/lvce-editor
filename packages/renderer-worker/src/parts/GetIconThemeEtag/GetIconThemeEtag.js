import * as IconThemeEtag from '../IconThemeEtag/IconThemeEtag.js'
import * as IsProduction from '../IsProduction/IsProduction.js'

export const getIconThemeEtag = (iconThemeId, isProduction = IsProduction.isProduction, etag = IconThemeEtag.etag) => {
  if (!isProduction || iconThemeId !== 'vscode-icons') {
    return ''
  }
  return etag
}
