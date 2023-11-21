const diagnosticProvider = {
  languageId: 'javascript',
  provideDiagnostics(textDocument, offset) {
    return []
  },
}

export const activate = () => {
  vscode.registerDiagnosticProvider(diagnosticProvider)
}
