import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Copy from '../Copy/Copy.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Remove from '../Remove/Remove.js'
import * as Root from '../Root/Root.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import { VError } from '@lvce-editor/verror'

const main = async () => {
  const indexPath = join(Root.root, 'build', '.tmp', 'server', 'shared-process', 'index.js')
  const module = await import(indexPath)
  const tmpDir = join(tmpdir(), 'export-test')
  await Remove.remove(tmpDir)
  await Mkdir.mkdir(tmpDir)
  const extensionPath = join(tmpDir, 'extension')
  const testPath = join(tmpDir, 'e2e')
  await Mkdir.mkdir(join(testPath, 'src'))
  await WriteFile.writeFile({
    to: join(extensionPath, 'extension.json'),
    content: `{ "id": "test" }`,
  })
  await WriteFile.writeFile({
    to: join(testPath, 'package.json'),
    content: `{}`,
  })
  await Copy.copy({
    from: `build/.tmp/server`,
    to: join(tmpDir, 'node_modules', `@lvce-editor`),
  })
  await Copy.copy({
    from: `packages/shared-process/node_modules/@lvce-editor/verror`,
    to: `build/.tmp/server/shared-process/node_modules/@lvce-editor/verror`,
  })
  try {
    await module.exportStatic({
      extensionPath,
      testPath,
      root: tmpDir,
      pathPrefix: '/test',
    })
  } catch (error) {
    throw new VError(error, `static export failed`)
  }
  await Remove.remove(`build/.tmp/server/shared_process/node_modules`)
}

main()
