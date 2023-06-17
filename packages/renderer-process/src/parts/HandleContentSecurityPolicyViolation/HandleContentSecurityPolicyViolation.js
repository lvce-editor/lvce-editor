import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js'

export const handleContentSecurityPolicyViolation = (event) => {
  const { violatedDirective, sourceFile, lineNumber, columnNumber } = event
  ContentSecurityPolicyErrorState.addError({
    violatedDirective,
    sourceFile,
    lineNumber,
    columnNumber,
  })
}
