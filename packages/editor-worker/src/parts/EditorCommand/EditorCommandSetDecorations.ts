// @ts-ignore
export const setDecorations = (editor, decorations, diagnostics) => {
  if (editor.decorations.length === 0 && decorations.length === 0) {
    return editor
  }
  return {
    ...editor,
    decorations,
    diagnostics,
  }
}
