import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import cpy from 'cpy'
import { VError } from '@lvce-editor/verror'
import execa from 'execa'
import { getTmpDir, root } from '../Shared/Shared.js'

const PACKAGE_EXTENSION_HOST = join(root, 'packages', 'extension-host')
const PACKAGE_MAIN_PROCESS = join(root, 'packages', 'main-process')
const PACKAGE_RENDERER_PROCESS = join(root, 'packages', 'renderer-process')
const PACKAGE_RENDERER_WORKER = join(root, 'packages', 'renderer-worker')
const PACKAGE_SHARED_PROCESS = join(root, 'packages', 'shared-process')
const PACKAGE_WEB = join(root, 'packages', 'web')

const TO_COPY = [
  // extension host
  {
    from: 'packages/extension-host/bin',
    to: 'packages/build/.tmp/packages/extension-host/bin',
  },
  {
    from: 'packages/extension-host/src',
    to: 'packages/build/.tmp/packages/extension-host/src',
  },
  {
    from: 'packages/extension-host/package.json',
    to: 'packages/build/.tmp/packages/extension-host',
  },
  {
    from: 'packages/extension-host/package-lock.json',
    to: 'packages/build/.tmp/packages/extension-host',
  },
  // renderer process
  {
    from: 'packages/renderer-process/src',
    to: 'packages/build/.tmp/packages/renderer-process/src',
  },
  // renderer worker
  {
    from: 'packages/renderer-worker/src',
    to: 'packages/build/.tmp/packages/renderer-worker/src',
  },
  // shared process
  {
    from: 'packages/shared-process/bin',
    to: 'packages/build/.tmp/packages/shared-process/bin',
  },
  {
    from: 'packages/shared-process/src',
    to: 'packages/build/.tmp/packages/shared-process/src',
  },
  {
    from: 'packages/shared-process/package-lock.json',
    to: 'packages/build/.tmp/packages/shared-process',
  },
  {
    from: 'packages/shared-process/package.json',
    to: 'packages/build/.tmp/packages/shared-process',
  },
  // web
  {
    from: 'packages/web/bin',
    to: 'packages/build/.tmp/packages/web/bin',
  },
  {
    from: 'packages/web/src',
    to: 'packages/build/.tmp/packages/web/src',
  },
  {
    from: 'packages/web/package-lock.json',
    to: 'packages/build/.tmp/packages/web',
  },
  {
    from: 'packages/web/package.json',
    to: 'packages/build/.tmp/packages/web',
  },
  {
    from: 'static',
    to: 'packages/build/.tmp/static',
  },
]

const copySources = async () => {
  for (const { from, to } of TO_COPY) {
    const absoluteFrom = join(root, from)
    const absoluteTo = join(root, to)
    await mkdir(dirname(absoluteTo), { recursive: true })
    await cpy(absoluteFrom, absoluteTo, {})
  }
  await mkdir(join(root, 'packages/build/.tmp/playground'))
}

const TO_INSTALL_DEPENDENCIES = ['packages/build/.tmp/packages/extension-host', 'packages/build/.tmp/packages/shared-process']

const installDependencies = async () => {
  for (const to of TO_INSTALL_DEPENDENCIES) {
    try {
      await execa('npm', ['ci', '--prod'], { cwd: join(root, to) })
    } catch (error) {
      throw new VError(error, `failed to install dependencies in ${to}`)
    }
  }
}

export const build = async () => {
  console.time('copySources')
  await copySources()
  console.timeEnd('copySources')

  console.time('installDependencies')
  await installDependencies()
  console.timeEnd('installDependencies')
}
