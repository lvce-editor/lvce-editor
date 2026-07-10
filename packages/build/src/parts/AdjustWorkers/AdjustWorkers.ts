import * as Path from '../Path/Path.ts'
import * as Replace from '../Replace/Replace.ts'

export const adjustWorkers = async ({ toRoot, commitHash, date, version }) => {
  const aboutWorkerPath = Path.join(toRoot, 'packages/about-view-worker', 'dist', 'aboutWorkerMain.js')
  await Replace.replace({
    path: aboutWorkerPath,
    occurrence: `const commit = 'unknown commit'`,
    replacement: `const commit = '${commitHash}'`,
  })
  await Replace.replace({
    path: aboutWorkerPath,
    occurrence: `commitDate = ''`,
    replacement: `commitDate = '${date}'`,
  })
  await Replace.replace({
    path: aboutWorkerPath,
    occurrence: `version = '0.0.0-dev'`,
    replacement: `version = '${version}'`,
  })
}
