import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.ts', () => {
  return {
    addError: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const HandleContentSecurityPolicyViolation = await import('../src/parts/HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.ts')
const ContentSecurityPolicyErrorState = await import('../src/parts/ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.ts')

test('handleContentSecurityPolicyViolation', () => {
  const event = {
    violatedDirective: 'script-src-elem',
    sourceFile: 'http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-import-data-url-csp-violation/main.ts',
    lineNumber: 1,
    columnNumber: 11,
  }
  HandleContentSecurityPolicyViolation.handleContentSecurityPolicyViolation(event)
  expect(ContentSecurityPolicyErrorState.addError).toHaveBeenCalledTimes(1)
  expect(ContentSecurityPolicyErrorState.addError).toHaveBeenCalledWith({
    violatedDirective: 'script-src-elem',
    sourceFile: 'http://localhost:3000/packages/extension-host-worker-tests/fixtures/sample.error-import-data-url-csp-violation/main.ts',
    lineNumber: 1,
    columnNumber: 11,
  })
})
