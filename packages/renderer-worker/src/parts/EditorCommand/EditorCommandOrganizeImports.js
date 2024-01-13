import * as OrganizeImports from '../OrganizeImports/OrganizeImports.js'

export const organizeImports = async (editor) => {
  const edits = await OrganizeImports.organizeImports(editor)
  console.log({
    edits,
  })
  // 1. ask extension host for import edits
  // 2. if edits are empty, ignore
  // 3. else, apply import edits and return new editor
  return editor
}
