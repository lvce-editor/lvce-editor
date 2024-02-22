import { readdir } from 'node:fs/promises'

const generateTestOverviewHtml = (dirents) => {
  const pre = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tests</title>
  </head>
  <body>
    <h1>Tests</h1>
    <p>Available Tests</p>
    <ul>
`
  let middle = ``
  // TODO properly escape name
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

export const createTestOverview = async (testPathSrc) => {
  const dirents = await readdir(testPathSrc)
  const testOverviewHtml = generateTestOverviewHtml(dirents)
  return testOverviewHtml
}
