import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'

import { dirname } from 'path'
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
    if (dirent.endsWith('.html') && dirent !== 'index.html') {
      const name = dirent.slice(0, -'.html'.length)
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

const main = async () => {
  const dirents = await readdir(
    join(root, 'packages', 'extension-host-worker-tests', 'src')
  )
  const html = generateHtml(dirents)
  await writeFile(
    join(root, 'packages', 'extension-host-worker-tests', 'src', 'index.html'),
    html
  )
}

main()
