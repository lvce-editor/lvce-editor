import { runServer } from 'verdaccio'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Promises from '../Promises/Promises.js'
import * as Remove from '../Remove/Remove.js'
import * as Root from '../Root/Root.js'

export const start = async () => {
  const cachePath = Path.absolute('build/.tmp/verdaccio-cache')
  const lvceEditorPath = Path.join(cachePath, '@lvce-editor')
  await Remove.remove(lvceEditorPath)
  await Remove.remove(Path.join(cachePath, 'jest-environment-lvce-editor'))
  await Mkdir.mkdir(cachePath)
  // @ts-ignore
  const app = await runServer({
    self_path: Root.root,
    storage: cachePath,
    port: 4873, // default
    max_body_size: `1000mb`,
    web: {
      enable: true,
      title: `lvce editor`,
    },
    packages: {
      '**': {
        access: `$all`,
        publish: `$all`,
        proxy: `npmjs`,
      },
      '@*/*': {
        access: `$all`,
        publish: `$all`,
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
  })
  const { resolve, promise } = Promises.withResolvers()
  app.listen(4873, (event) => {
    resolve(undefined)
  })
  await promise
}
