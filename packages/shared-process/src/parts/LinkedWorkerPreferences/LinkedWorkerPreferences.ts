import workers from '../../../../renderer-worker/src/parts/Workers/Workers.json' with { type: 'json' }
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Path from '../Path/Path.ts'
import * as TransientLinkedExtensions from '../TransientLinkedExtensions/TransientLinkedExtensions.ts'

interface Worker {
  readonly defaultPath: string
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

const getPackageJson = async (path: string): Promise<any> => {
  try {
    return await FileSystem.readJson(Path.join(path, 'package.json'))
  } catch {
    return undefined
  }
}

export const getLinkedWorkerPreferences = async (): Promise<Record<string, string>> => {
  const preferences: Record<string, string> = {}
  for (const link of TransientLinkedExtensions.getLinkedExtensions()) {
    const packageJson = await getPackageJson(link.resolvedPath)
    const worker = workersByPackageName.get(packageJson?.name)
    if (!worker || typeof packageJson.main !== 'string') {
      continue
    }
    preferences[worker.settingName] = Path.join(link.resolvedPath, packageJson.main)
  }
  return preferences
}
