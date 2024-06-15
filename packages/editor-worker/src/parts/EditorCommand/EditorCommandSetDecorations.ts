export const setDecorations = (editor: any, decorations: any, diagnostics: any) => {
  if (editor.decorations.length === 0 && decorations.length === 0) {
    return editor
  }
  return {
    ...editor,
    decorations,
    diagnostics,
  }
}
