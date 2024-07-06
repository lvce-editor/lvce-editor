const getHover = (text, offset) => {
  return {
    displayString: 'abc',
    documentation: 'def',
  }
}

const hoverProvider = {
  languageId: 'xyz',
  provideHover(textDocument, offset) {
    const text = vscode.getTextFromTextDocument(textDocument)
    return getHover(text, offset)
  },
}

export const activate = () => {
  vscode.registerHoverProvider(hoverProvider)
}
