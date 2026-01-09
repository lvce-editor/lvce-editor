import { runServer } from 'verdaccio'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Root from '../Root/Root.js'
import { dirname, join } from 'node:path'
import { mkdir } from 'node:fs/promises'

export const start = async () => {
  const cachePath = Path.absolute('packages/build/.tmp/verdaccio-cache')
  const lvceEditorPath = Path.join(cachePath, '@lvce-editor')
  await Remove.remove(lvceEditorPath)
  await Mkdir.mkdir(cachePath)
  const passwordPath = join(Root.root, 'packages', 'build', '.tmp', 'verdaccio-auth', 'htpasswd')
  await mkdir(dirname(passwordPath), { recursive: true })

  // @ts-ignore
  const app = await runServer({
    self_path: Root.root,
    storage: cachePath,
    port: 4873, // default
    max_body_size: `1000mb`,
    auth: {
      htpasswd: {
        file: passwordPath,
      },
    },
    web: {
      enable: true,
      title: `lvce editor`,
    },
    packages: {
      '**': {
        access: `$all`,
        publish: `$all`,
        unpublish: `$all`,
        proxy: `npmjs`,
      },
      '@*/*': {
        access: `$all`,
        publish: `$all`,
        unpublish: `$all`,
        proxy: `npmjs`,
      },
    },
    uplinks: {
      npmjs: {
        url: `https://registry.npmjs.org/`,
        max_fails: 10,
      },
    },
    log: {
      type: 'stdout',
      format: 'pretty',
      level: 'http',
    },
    server: {
      keepAliveTimeout: 60,
    },
  })
  const { resolve, promise } = Promise.withResolvers()
  app.listen(4873, (event) => {
    resolve(undefined)
  })
  await promise
}
