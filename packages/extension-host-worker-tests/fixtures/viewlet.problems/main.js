const diagnosticProvider = {
  languageId: 'xyz',
  provideDiagnostics(textDocument, offset) {
    return []
  },
}

export const activate = () => {
  vscode.registerDiagnosticProvider(diagnosticProvider)
}
