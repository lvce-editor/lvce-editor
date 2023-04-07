import { ContentSecurityPolicyError } from '../src/parts/ContentSecurityPolicyError/ContentSecurityPolicyError.js'

test('ContentSecurityPolicyError', () => {
  const violatedDirective = 'script-src-elem'
  const sourceFile = 'http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-import-data-url-csp-violation/main.js'
  const lineNumber = 1
  const columnNumber = 11
  const error = new ContentSecurityPolicyError(violatedDirective, sourceFile, lineNumber, columnNumber)
  expect(error.message).toBe('Content Security Policy Violation: script-src-elem')
  expect(error.stack).toMatch(`Content Security Policy Violation
    at http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-import-data-url-csp-violation/main.js:1:11`)
})
