import * as Exec from '../Exec/Exec.js'
import * as Root from '../Root/Root.js'
import * as Path from '../Path/Path.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import * as os from 'node:os'
import { rm } from 'node:fs/promises'
import * as Verdaccio from '../Verdaccio/Verdaccio.js'

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
    // @ts-ignore
  }
}

const getName = (object) => {
  return object.name
}

const publishPackages = async () => {
  await Exec.exec('node', ['build/bin/build.js', '--target=server'], {
    cwd: Root.root,
    stdio: 'inherit',
  })
  const packages = await ReadDir.readDir('build/.tmp/server')
  await Promise.all(packages.map(getName).map(publishPackage))
}

const installPackagesLocally = async () => {
  const tmpDir = Path.join(os.tmpdir(), 'lvce-local-packages-test')
  await Mkdir.mkdir(tmpDir)
  await rm(tmpDir, { force: true, recursive: true })
  await WriteFile.writeFile({
    to: Path.join(tmpDir, 'package.json'),
    content: '{}',
  })
  await Exec.exec(
    'npm',
    ['install', '--prefer-offline', '--no-audit', '@lvce-editor/server'],
    {
      cwd: tmpDir,
      env: {
        ...process.env,
        npm_config_registry: registryUrl,
      },
    }
  )
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

  console.info('published packages successfully')

  process.exit(0)
}

main()
