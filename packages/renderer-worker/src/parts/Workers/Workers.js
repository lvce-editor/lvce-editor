import workers from './Workers.json' with { type: 'json' }

export const getWorkers = () => {
  return workers
}

export const getWorkersWithHotReload = () => {
  return workers.filter((worker) => {
    return worker.settingName && worker.hotReloadCommand
  })
}

export const getWorkerByFileName = (fileName) => {
  return workers.find((worker) => {
    return worker.fileName === fileName
  })
}
