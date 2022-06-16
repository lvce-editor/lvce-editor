import { ExecutionError } from '../Error/Error.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const state = {
  pending: {},
}

export const handleQuickPickResult = (index) => {
  const item = state.pending.items[index]
  state.pending.resolve(item)
  state.pending = {}
}

export const showQuickPick = async ({ getPicks, toPick }) => {
  try {
    const items = await getPicks()
    const picks = items.map(toPick)
    const item = await new Promise(async (resolve, reject) => {
      state.pending = { resolve, reject, items }
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
