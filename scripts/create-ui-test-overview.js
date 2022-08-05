import { mkdir, readdir, rm, symlink, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..')

const generateHtml = (dirents) => {
  const pre = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tests</title>
  </head>
  <body>
    <h1>Tests</h1>
    <p>Available Tests</p>
    <ul>
`
  let middle = ``
  for (const dirent of dirents) {
    if (dirent.endsWith('.js') && !dirent.startsWith('_')) {
      const name = dirent.slice(0, -'.js'.length)
      middle += `      <li><a href="./${name}.html">${name}</a></li>
`
    }
  }

  const post = `    </ul>
  </body>
</html>
`
  return pre + middle + post
}

const TEMPLATE_TEST_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/css/App.css" />
    <link
      rel="preload"
      href="/fonts/FiraCode-VariableFont.ttf"
      as="font"
      type="font/ttf"
      crossorigin
    />
    <script
      type="module"
      src="/packages/renderer-process/src/rendererProcessMain.js"
    ></script>
    <link
      rel="modulepreload"
      href="/packages/renderer-worker/src/rendererWorkerMain.js"
    />
  </head>
  <body></body>
</html>
`

const main = async () => {
  const dirents = await readdir(
    join(root, 'packages', 'extension-host-worker-tests', 'src')
  )
  await rm(join(root, 'static', 'tests'), { recursive: true, force: true })
  await mkdir(join(root, 'static', 'tests'), { recursive: true })
  const html = generateHtml(dirents)
  await writeFile(join(root, 'static', 'tests', 'index.html'), html)
  await writeFile(
    join(root, 'static', 'tests', '_template.html'),
    TEMPLATE_TEST_HTML
  )
  for (const dirent of dirents) {
    if (dirent.startsWith('_')) {
      continue
    }
    const name = dirent.replace(/\.js$/, '')
    const to = join(root, 'static', 'tests', `${name}.html`)
    const from = './_template.html'
    await symlink(from, to)
  }
}

main()
