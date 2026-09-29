import workers from '../../../../renderer-worker/src/parts/Workers/Workers.json' with { type: 'json' }
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Path from '../Path/Path.ts'

interface Worker {
  readonly defaultPath: string
  readonly settingName: string
}

export interface LinkedWorkerPreference {
  readonly path: string
  readonly settingName: string
}

const getPackageName = (worker: Worker): string => {
  const marker = '/node_modules/'
  const index = worker.defaultPath.indexOf(marker)
  if (index === -1) {
    return ''
  }
  const packagePath = worker.defaultPath.slice(index + marker.length)
  const parts = packagePath.split('/')
  return packagePath.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

const workersByPackageName = new Map((workers as readonly Worker[]).map((worker) => [getPackageName(worker), worker]))

export const getLinkedWorkerPreference = async (path: string): Promise<LinkedWorkerPreference | undefined> => {
  try {
    const packageJson = await FileSystem.readJson(Path.join(path, 'package.json'))
    const worker = workersByPackageName.get(packageJson?.name)
    if (!worker || typeof packageJson.main !== 'string') {
      return undefined
    }
    return {
      path: Path.join(path, packageJson.main),
      settingName: worker.settingName,
    }
  } catch {
    return undefined
  }
}
