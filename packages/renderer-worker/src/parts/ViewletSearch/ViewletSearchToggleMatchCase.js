import * as ViewletSearchSetValue from './ViewletSearchHandleUpdate.js'

export const toggleMatchCase = (state) => {
  const { matchCase } = state
  return ViewletSearchSetValue.handleUpdate(state, { matchCase: !matchCase })
}
