import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.ts'

export const handleContentSecurityPolicyViolation = (event) => {
  const { violatedDirective, sourceFile, lineNumber, columnNumber } = event
  ContentSecurityPolicyErrorState.addError({
    violatedDirective,
    sourceFile,
    lineNumber,
    columnNumber,
  })
}
