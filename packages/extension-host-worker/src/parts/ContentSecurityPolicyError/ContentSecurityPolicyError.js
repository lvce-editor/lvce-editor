export class ContentSecurityPolicyError extends Error {
  constructor(violatedDirective, sourceFile, lineNumber, columnNumber) {
    super(`Content Security Policy Violation: ${violatedDirective}`)
    this.name = 'ContentSecurityPolicyError'
    if (sourceFile) {
      this.stack = `Content Security Policy Violation
    at ${sourceFile}:${lineNumber}:${columnNumber}`
    } else {
      this.stack = `Content Security Policy Violation
    at <unknown>`
    }
  }
}
