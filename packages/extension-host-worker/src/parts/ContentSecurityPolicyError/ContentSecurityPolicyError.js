export class ContentSecurityPolicyError extends Error {
  constructor(violatedDirective, sourceFile, lineNumber, columnNumber) {
    super(`Content Security Policy Violation: ${violatedDirective}`)
    this.name = 'ContentSecurityPolicyError'
    this.stack = `Content Security Policy Violation
  at ${sourceFile}:${lineNumber}:${columnNumber}`
  }
}
