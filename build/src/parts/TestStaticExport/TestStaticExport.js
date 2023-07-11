import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Copy from '../Copy/Copy.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Remove from '../Remove/Remove.js'
import * as Root from '../Root/Root.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import VError from 'verror'

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
  try {
    await module.exportStatic({
      extensionPath,
      testPath,
      root: tmpDir,
    })
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `static export failed`)
  }
}

main()
