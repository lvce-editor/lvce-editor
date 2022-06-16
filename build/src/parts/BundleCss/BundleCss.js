import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import * as Root from '../Root/Root.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

export const bundleCss = async ({ to, additionalCss = '' }) => {
  let css = ``
  const cssLibNormalize = join(
    Root.root,
    'static',
    'lib-css',
    'modern-normalize.css'
  )
  if (additionalCss) {
    css += additionalCss
    css += '\n\n'
  }
  const cssLibTermTerm = join(Root.root, 'static', 'lib-css', 'termterm.css')
  css += await readFile(cssLibNormalize, 'utf-8')
  css += '\n'
  css += await readFile(cssLibTermTerm, 'utf-8')
  css += '\n'
  const cwd = join(Root.root, 'static', 'css', 'parts')
  const dirents = await readdir(cwd)
  dirents.sort().reverse()
  for (const dirent of dirents) {
    const absolutePath = join(cwd, dirent)
    const content = await readFile(absolutePath, 'utf-8')
    css += `/*************/\n`
    css += `/* ${dirent} */\n`
    css += `/*************/\n`
    css += content
  }
  await WriteFile.writeFile({
    to,
    content: css,
  })
}
