import * as ViewletSearchSetValue from './ViewletSearchHandleUpdate.ts'

export const toggleMatchCase = (state) => {
  const { matchCase } = state
  return ViewletSearchSetValue.handleUpdate(state, { matchCase: !matchCase })
}
