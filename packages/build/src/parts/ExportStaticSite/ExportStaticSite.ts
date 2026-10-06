import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as Copy from '../Copy/Copy.ts'
import * as Mkdir from '../Mkdir/Mkdir.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const exportStaticSite = async ({ root, serverRoot }: { root: string; serverRoot: string }): Promise<any> => {
  await Remove.remove(root)
  const packagesPath = join(root, 'node_modules', '@lvce-editor')
  await Mkdir.mkdir(packagesPath)
  await Copy.copy({
    from: serverRoot,
    to: packagesPath,
  })
  await Copy.copy({
    from: 'packages/shared-process/node_modules/@lvce-editor/verror',
    to: join(packagesPath, 'shared-process', 'node_modules', '@lvce-editor', 'verror'),
  })
  const serverSharedProcessPath = join(packagesPath, 'shared-process', 'index.js')
  const sharedProcess = await import(pathToFileURL(Path.absolute(serverSharedProcessPath)).toString())
  return sharedProcess.exportStatic({
    extensionPath: '',
    root,
  })
}
