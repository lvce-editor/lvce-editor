const diagnosticProvider = {
  languageId: 'xyz',
  provideDiagnostics(textDocument, offset) {
    return [
      {
        uri: textDocument.uri,
        rowIndex: 0,
        columnIndex: 0,
        message: 'error 1',
        source: 'xyz',
      },
    ]
  },
}

export const activate = () => {
  vscode.registerDiagnosticProvider(diagnosticProvider)
}
