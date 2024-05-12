import { VError } from '@lvce-editor/verror'
import { join } from 'node:path'
import * as Copy from '../Copy/Copy.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const main = async () => {
  const indexPath = Path.absolute('packages/build/.tmp/server/shared-process/index.js')
  const module = await import(indexPath)
  const tmpDir = Path.absolute(`packages/build/.tmp/export-test`)
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
    from: `packages/build/.tmp/server`,
    to: join(tmpDir, 'node_modules', `@lvce-editor`),
  })
  await Copy.copy({
    from: `packages/shared-process/node_modules/@lvce-editor/verror`,
    to: `packages/build/.tmp/server/shared-process/node_modules/@lvce-editor/verror`,
  })
  let commitHash = ''
  try {
    const result = await module.exportStatic({
      extensionPath,
      testPath,
      root: tmpDir,
      pathPrefix: '/test',
    })
    commitHash = result.commitHash
  } catch (error) {
    throw new VError(error, `static export failed`)
  }
  await Remove.remove(`packages/build/.tmp/server/shared_process/node_modules`)

  const testFiles = await ReadDir.readDir('packages/extension-host-worker-tests/src')
  const filteredDirents = testFiles.filter((dirent) => !dirent.startsWith('_'))
  for (const dirent of filteredDirents) {
    const name = dirent.slice(0, -3)
    await Copy.copyFile({
      from: `packages/build/.tmp/export-test/dist/index.html`,
      to: `packages/build/.tmp/export-test/dist/tests/${name}.html`,
    })
    await Copy.copyFile({
      from: `packages/extension-host-worker-tests/src/${name}.js`,
      to: `packages/build/.tmp/export-test/dist/${commitHash}/packages/extension-host-worker-tests/src/${name}.js`,
    })
  }
  await Copy.copy({
    from: `packages/extension-host-worker-tests/fixtures`,
    to: `packages/build/.tmp/export-test/dist/${commitHash}/packages/extension-host-worker-tests/fixtures`,
  })
}

main()
