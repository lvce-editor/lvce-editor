import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getMainAreaUid = (uid: number): number | undefined => {
  const applicationId = ApplicationRegistry.getOwner(uid)
  if (applicationId === undefined) {
    return undefined
  }
  return ViewletStates.getInstance(ViewletModuleId.Main, applicationId)?.state.uid
}
