import { rm } from 'node:fs/promises'
import { startVerdaccio } from 'verdaccio'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Mkdir from '../Mkdir/Mkdir.js'

export const start = async () => {
  console.log({ startVerdaccio })
  const cachePath = Path.absolute('build/.tmp/verdaccio-cache')
  await Remove.remove(cachePath)
  await Mkdir.mkdir(cachePath)
  await new Promise((resolve) => {
    startVerdaccio(
      {
        storage: cachePath,
        self_path: './',
        port: 4873, // default
        max_body_size: `1000mb`,
        web: {
          enable: true,
          title: `lvce`,
        },
        packages: {
          '**': {
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
      },
      4873,
      undefined,
      '1.0.0',
      'verdaccio',
      (webServer, addrs) => {
        webServer.listen(addrs.port || addrs.path, addrs.host, () => {
          resolve(undefined)
        })
      }
    )
  })
}
