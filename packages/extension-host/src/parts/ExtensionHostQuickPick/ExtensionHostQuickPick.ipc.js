import { ExecutionError } from '../Error/Error.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const state = {
  pending: {},
}

export const handleQuickPickResult = (item) => {
  state.pending.resolve(item)
  state.pending = {}
}

export const showQuickPick = async ({ getPicks }) => {
  try {
    const picks = await getPicks()
    const item = await new Promise(async (resolve, reject) => {
      state.pending = { resolve, reject }
      await SharedProcess.invoke(
        /* ExtensionHostQuickPick.show */ 18928,
        /* picks */ picks
      )
    })

    return item
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to show quickPick',
    })
  }
}
