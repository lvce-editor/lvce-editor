import * as LaunchSharedProcess from '../LaunchSharedProcess/LaunchSharedProcess.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const hydrate = async ({ method, env = {} }) => {
  if (!SharedProcessState.state.promise) {
    SharedProcessState.state.promise = LaunchSharedProcess.launchSharedProcess({ method, env })
  }
  return SharedProcessState.state.promise
}
