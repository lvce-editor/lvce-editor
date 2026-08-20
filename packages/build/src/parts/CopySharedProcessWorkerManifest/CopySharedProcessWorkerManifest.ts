import * as Copy from '../Copy/Copy.ts'
import * as Replace from '../Replace/Replace.ts'

const workerManifestSource = 'packages/renderer-worker/src/parts/Workers/Workers.json'
const workerManifestImport = '../../../../renderer-worker/src/parts/Workers/Workers.json'

export const copySharedProcessWorkerManifest = async (cachePath: string): Promise<void> => {
  await Copy.copyFile({
    from: workerManifestSource,
    to: `${cachePath}/src/parts/Workers/Workers.json`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/LinkedWorkerPreferences/LinkedWorkerPreferences.js`,
    occurrence: workerManifestImport,
    replacement: '../Workers/Workers.json',
  })
}
