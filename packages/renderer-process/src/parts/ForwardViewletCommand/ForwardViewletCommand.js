import * as ExecuteViewletCommand from '../ExecuteViewletCommand/ExecuteViewletCommand.js'

export const forwardViewletCommand = (name) => {
  return (uid, ...args) => {
    ExecuteViewletCommand.executeViewletCommand(uid, name, ...args)
  }
}
