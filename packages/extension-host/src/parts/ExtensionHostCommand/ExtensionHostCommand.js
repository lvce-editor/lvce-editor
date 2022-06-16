import VError from 'verror'
import { VALIDATION_ENABLED } from '../Flags/Flags.js'
import { ow } from '../Validation/Validation.js'
import * as Notification from '../ExtensionHostNotification/ExtensionHostNotification.js'

export const state = {
  commands: Object.create(null),
}

export const register = (command) => {
  if (VALIDATION_ENABLED) {
    ow(
      command,
      ow.object.exactShape({
        id: ow.string.nonEmpty,
        execute: ow.function,
      })
    )
  }
  state.commands[command.id] = command
  // TODO check shape of command with ow
}

export const execute = async (commandId, ...args) => {
  // TODO
  const command = state.commands[commandId]
  if (!command) {
    throw new VError(
      `Command "${commandId}" not found. Please try to register the command with \`vscode.registerCommand(myCommand)\``
    )
  }
  try {
    return await command.execute(...args)
  } catch (error) {
    if (command.resolveError && typeof command.resolveError === 'function') {
      const resolvedError = command.resolveError(error)
      await Notification.showNotificationWithOptions(
        resolvedError.type,
        resolvedError.message,
        resolvedError.options
      )
      return
    }
    throw error
  }
}
