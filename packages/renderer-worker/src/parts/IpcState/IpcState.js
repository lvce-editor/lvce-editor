const state = {
  shouldLaunchMultipleWorkers: false,
}

export const setConfig = (shouldLaunchMultipleWorkers) => {
  console.log({ shouldLaunchMultipleWorkers })
  state.shouldLaunchMultipleWorkers = shouldLaunchMultipleWorkers
}

export const getConfig = () => {
  return state.shouldLaunchMultipleWorkers
}
