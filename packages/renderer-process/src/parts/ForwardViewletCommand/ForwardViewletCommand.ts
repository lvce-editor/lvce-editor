import * as ExecuteViewletCommand from '../ExecuteViewletCommand/ExecuteViewletCommand.ts'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'

export const forwardViewletCommand = (name) => {
  const fn = (uid, ...args) => {
    ExecuteViewletCommand.executeViewletCommand(uid, name, ...args)
  }
  NameAnonymousFunction.nameAnonymousFunction(fn, name)
  return fn
}
