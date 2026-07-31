import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.js'
import * as Dialog from '../Dialog/Dialog.js'
import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getConfirmationMessage = ({ cookieCount, profileDirectory, profileName }) => {
  const cookieLabel = cookieCount === 1 ? 'cookie' : 'cookies'
  return `Import ${cookieCount} ${cookieLabel} from Chrome profile "${profileName}" (${profileDirectory})? This gives Simple Browser the same website access as Chrome.`
}

const getResultMessage = ({ failed, imported, skipped }) => {
  return `Imported ${imported} Chrome cookies (${skipped} skipped, ${failed} failed).`
}

const getErrorMessage = (error) => {
  return error instanceof Error ? error.message : String(error)
}

export const importChromeCookies = async (state) => {
  try {
    const info = await SharedProcess.invoke('ChromeCookieImport.getInfo')
    const confirmed = await ConfirmPrompt.prompt(getConfirmationMessage(info), {
      confirmMessage: 'Import',
      title: 'Import Chrome Cookies',
    })
    if (!confirmed) {
      return state
    }
    const result = await SharedProcess.invoke('ChromeCookieImport.importCookies')
    await ElectronBrowserViewFunctions.reload(state.browserViewId)
    await Dialog.show({
      message: getResultMessage(result),
      title: 'Chrome Cookies Imported',
      type: 'info',
    })
    return {
      ...state,
      isLoading: true,
    }
  } catch (error) {
    await Dialog.show({
      message: `Failed to import Chrome cookies: ${getErrorMessage(error)}`,
      title: 'Chrome Cookie Import Failed',
      type: 'error',
    })
    return state
  }
}
