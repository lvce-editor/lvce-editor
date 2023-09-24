import { VError } from '@lvce-editor/verror'
import * as os from 'node:os'
import * as Exec from '../Exec/Exec.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Logger from '../Logger/Logger.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Process from '../Process/Process.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'
import * as Root from '../Root/Root.js'
import * as Verdaccio from '../Verdaccio/Verdaccio.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const registryUrl = 'http://localhost:4873'

const publishPackage = async (name) => {
  try {
    await Exec.exec('npm', ['publish'], {
      env: {
        ...process.env,
        npm_config_registry: registryUrl,
      },
      stdio: 'inherit',
      cwd: Path.absolute(`build/.tmp/server/${name}`),
    })
  } catch (error) {
    throw new VError(error, `Failed to publish ${name}`)
  }
}

const getName = (object) => {
  return object.name
}

// https://stackoverflow.com/questions/48728714/how-to-set-env-var-for-npmrc-use#answer-53783077
const addNpmrcFile = async () => {
  await WriteFile.writeFile({
    to: 'build/.tmp/server/.npmrc',
    content: `//localhost:4873/:_authToken="test"`,
  })
}

const isFolder = (dirent) => {
  return dirent.isDirectory()
}

const publishPackages = async () => {
  await Exec.exec('node', ['build/bin/build.js', '--target=server'], {
    cwd: Root.root,
    stdio: 'inherit',
  })
  await addNpmrcFile()
  const packages = await ReadDir.readDirWithFileTypes('build/.tmp/server')
  await Promise.all(packages.filter(isFolder).map(getName).map(publishPackage))
}

const installPackagesLocally = async () => {
  const tmpDir = Path.join(os.tmpdir(), 'lvce-local-packages-test')
  await Mkdir.mkdir(tmpDir)
  await Remove.remove(Path.join(tmpDir, 'node_modules'))
  await Remove.remove(Path.join(tmpDir, 'package.json'))
  await WriteFile.writeFile({
    to: Path.join(tmpDir, 'package.json'),
    content: '{}',
  })
  await Exec.exec('npm', ['install', '--no-audit', '@lvce-editor/server'], {
    cwd: tmpDir,
    env: {
      ...process.env,
      npm_config_registry: registryUrl,
    },
  })
}

const startVerdaccio = async () => {
  await Verdaccio.start()
}

const main = async () => {
  console.time('startVerdaccio')
  await startVerdaccio()
  console.timeEnd('startVerdaccio')

  console.time('publishPackages')
  await publishPackages()
  console.timeEnd('publishPackages')

  console.time('installPackagesLocally')
  await installPackagesLocally()
  console.timeEnd('installPackagesLocally')

  Logger.info('published packages successfully')

  if (!Process.argv.includes('--wait')) {
    Process.exit(ExitCode.Success)
  }
}

main()
