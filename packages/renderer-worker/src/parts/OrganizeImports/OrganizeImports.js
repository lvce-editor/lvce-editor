import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostOrganizeImports from '../ExtensionHost/ExtensionHostOrganizeImports.js'

export const organizeImports = (editor) => {
  Assert.object(editor)
  return ExtensionHostOrganizeImports.executeOrganizeImports(editor)
}
