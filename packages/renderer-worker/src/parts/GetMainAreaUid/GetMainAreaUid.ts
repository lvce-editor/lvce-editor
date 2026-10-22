import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getMainAreaUid = (uid: number): number | undefined => {
  const applicationId = ApplicationRegistry.getOwner(uid)
  if (applicationId !== undefined) {
    return ViewletStates.getInstance(ViewletModuleId.Main, applicationId)?.state.uid
  }
  if (!ViewletStates.getByUid(uid)) {
    return undefined
  }
  const candidates = new Set<number>()
  for (const instance of Object.values(ViewletStates.getAllInstances())) {
    if (instance.moduleId === ViewletModuleId.Main && ApplicationRegistry.getOwner(instance.state.uid) === undefined) {
      candidates.add(instance.state.uid)
    }
  }
  return candidates.size === 1 ? candidates.values().next().value : undefined
}
