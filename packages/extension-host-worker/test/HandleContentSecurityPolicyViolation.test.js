import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js', () => {
  return {
    addError: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const HandleContentSecurityPolicyViolation = await import('../src/parts/HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.js')
const ContentSecurityPolicyErrorState = await import('../src/parts/ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js')

test('handleContentSecurityPolicyViolation', () => {
  const event = {
    violatedDirective: 'script-src-elem',
    sourceFile: 'http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-import-data-url-csp-violation/main.js',
    lineNumber: 1,
    columnNumber: 11,
  }
  HandleContentSecurityPolicyViolation.handleContentSecurityPolicyViolation(event)
  expect(ContentSecurityPolicyErrorState.addError).toHaveBeenCalledTimes(1)
  expect(ContentSecurityPolicyErrorState.addError).toHaveBeenCalledWith({
    violatedDirective: 'script-src-elem',
    sourceFile: 'http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-import-data-url-csp-violation/main.js',
    lineNumber: 1,
    columnNumber: 11,
  })
})
