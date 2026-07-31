import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.js'
import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
import * as Notification from '../Notification/Notification.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getConfirmationMessage = ({ cookieCount, profileDirectory, profileName }) => {
  const cookieLabel = cookieCount === 1 ? 'cookie' : 'cookies'
  return `Import ${cookieCount} ${cookieLabel} from Firefox profile "${profileName}" (${profileDirectory})? This gives Simple Browser the same website access as Firefox.`
}

const getResultMessage = ({ failed, imported, skipped }) => {
  return `Imported ${imported} Firefox cookies (${skipped} skipped, ${failed} failed).`
}

const getErrorMessage = (error) => {
  return error instanceof Error ? error.message : String(error)
}

export const importFirefoxCookies = async (state) => {
  try {
    const { browserViewId } = state
    const info = await SharedProcess.invoke('FirefoxCookieImport.getInfo')
    const confirmed = await ConfirmPrompt.prompt(getConfirmationMessage(info), {
      confirmMessage: 'Import',
      title: 'Import Firefox Cookies',
    })
    if (!confirmed) {
      return state
    }
    const result = await SharedProcess.invoke('FirefoxCookieImport.importCookies')
    await ElectronBrowserViewFunctions.reload(browserViewId)
    const notificationType = result.failed > 0 ? 'warning' : 'info'
    await Notification.create(notificationType, getResultMessage(result))
    return {
      ...state,
      isLoading: true,
    }
  } catch (error) {
    await Notification.create('error', `Failed to import Firefox cookies: ${getErrorMessage(error)}`)
    return state
  }
}
