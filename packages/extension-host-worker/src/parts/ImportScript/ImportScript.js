import { ContentSecurityPolicyError } from '../ContentSecurityPolicyError/ContentSecurityPolicyError.js'
import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js'
import * as IsUnhelpfulImportError from '../IsUnhelpfulImportError/IsUnhelpfulImportError.js'
import * as Timeout from '../Timeout/Timeout.js'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'

export const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    if (IsUnhelpfulImportError.isUnhelpfulImportError(error)) {
      const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(url, error)
      throw new Error(actualErrorMessage)
    }
    // csp errors arrive a little bit later
    await Timeout.sleep(0)
    if (ContentSecurityPolicyErrorState.hasRecentErrors()) {
      const recentError = ContentSecurityPolicyErrorState.getRecentError()
      throw new ContentSecurityPolicyError(recentError.violatedDirective, recentError.sourceFile, recentError.lineNumber, recentError.columnNumber)
    }
    throw error
  }
}
