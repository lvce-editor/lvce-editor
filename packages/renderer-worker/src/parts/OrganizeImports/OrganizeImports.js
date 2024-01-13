import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostOrganizeImports from '../ExtensionHost/ExtensionHostOrganizeImports.js'

export const organizeImports = (editor) => {
  Assert.object(editor)
  return ExtensionHostOrganizeImports.executeOrganizeImports(editor)
}
