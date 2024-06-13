// @ts-ignore
export const applyEdits = (editor, cursor) => {
  // TODO multiple cursors
  console.assert(cursor)
  editor.cursor = cursor
}
