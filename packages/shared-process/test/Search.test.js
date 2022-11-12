import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, sep } from 'node:path'
import { writeFile } from '../src/parts/FileSystem/FileSystem.js'
import * as Search from '../src/parts/Search/Search.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const fixPath = (path) => {
  return path.replaceAll('/', sep)
}

const TIMEOUT_LONG = 10_000

test(
  'search',
  async () => {
    const tmpDir = await getTmpDir()
    await writeFile(
      join(tmpDir, 'index.html'),
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
</html>
`
    )
    expect(await Search.search(tmpDir, 'Document')).toEqual({
      results: [
        [
          fixPath('./index.html'),
          [
            {
              absoluteOffset: 208,
              lineNumber: 6,
              preview: '    <title>Document</title>\n',
            },
          ],
        ],
      ],
      stats: expect.any(Object),
    })
  },
  TIMEOUT_LONG
)
