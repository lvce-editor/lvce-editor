const diagnosticProvider = {
  languageId: 'javascript',
  provideDiagnostics(textDocument, offset) {
    return [
      {
        rowIndex: 1,
        columnIndex: 1,
        endRowIndex: 1,
        endColumnIndex: 4,
        message: 'error',
        type: 'error',
      },
    ]
  },
}

export const activate = () => {
  vscode.registerDiagnosticProvider(diagnosticProvider)
}
