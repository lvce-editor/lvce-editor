import { ContentSecurityPolicyError } from '../ContentSecurityPolicyError/ContentSecurityPolicyError.ts'
import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.ts'
import * as IsImportError from '../IsImportError/IsImportError.ts'
import * as Timeout from '../Timeout/Timeout.ts'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.ts'

export const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    if (IsImportError.isImportError(error)) {
      const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(url, error)
      throw new Error(actualErrorMessage)
    }
    // content security policy errors arrive a little bit later
    await Timeout.sleep(0)
    if (ContentSecurityPolicyErrorState.hasRecentErrors()) {
      const recentError = ContentSecurityPolicyErrorState.getRecentError()
      // @ts-ignore
      throw new ContentSecurityPolicyError(recentError.violatedDirective, recentError.sourceFile, recentError.lineNumber, recentError.columnNumber)
    }
    throw error
  }
}
