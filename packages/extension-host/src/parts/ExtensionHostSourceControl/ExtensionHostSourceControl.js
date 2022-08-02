import VError from 'verror'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VALIDATION_ENABLED } from '../Flags/Flags.js'
import * as Notification from '../ExtensionHostNotification/ExtensionHostNotification.js'

export const state = {
  /**
   * @type{any[]}
   */
  sourceControlProviders: [],
}

export const registerSourceControlProvider = (sourceControlProvider) => {
  if (VALIDATION_ENABLED) {
    // TODO validate source control provider
  }
  state.sourceControlProviders.push(sourceControlProvider)
}

const JSON_RPC_VERSION = '2.0'

export const updateGitDecorations = () => {
  SharedProcess.send({
    jsonrpc: JSON_RPC_VERSION,
    method: 'updateGitDecorations',
    params: [],
  })
}

const sum = (values) => {
  let total = 0
  for (const value of values) {
    total += value
  }
  return total
}

export const getBadgeCount = async (cwd) => {
  const getBadgeCountInCwd = (provider) => provider.getBadgeCount(cwd)
  const individualCounts = await Promise.all(
    state.sourceControlProviders.map(getBadgeCountInCwd)
  )
  const total = sum(individualCounts)
  return total
}

export const sourceControlGetModifiedFiles = async () => {
  // TODO maybe use Promise.allsettled so that when one provider fails, it still shows some results
  const result = await Promise.all(
    Object.values(state.sourceControlProviders).map((provider) =>
      provider.getChangedFiles()
    )
  )
  const flatResult = result.flat(1)
  return flatResult
}

const acceptInputInternal = async (text) => {
  const provider = Object.values(state.sourceControlProviders)[0]
  if (!provider) {
    return
  }
  const command = provider.acceptInput
  try {
    await command.execute(text)
  } catch (error) {
    if (command.resolveError && typeof command.resolveError === 'function') {
      const resolvedError = command.resolveError(error)
      if (resolvedError) {
        console.log({ resolvedError })
        const selectedOption = await Notification.showNotificationWithOptions(
          'error',
          resolvedError.message,
          resolvedError.options
        )
        return
      }
    }
    throw error
  }
}

export const acceptInput = async (text) => {
  console.log('ACCEPT INPUT')
  try {
    await acceptInputInternal(text)
  } catch (error) {
    throw new VError(error, 'Failed to accept input')
  }
}
