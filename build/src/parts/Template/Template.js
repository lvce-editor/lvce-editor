import { chmod } from 'node:fs/promises'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import * as Path from '../Path/Path.js'

const getTemplate = (name) => {
  return ReadFile.readFile(`build/src/parts/Template/template_${name}.txt`)
}

export const write = async (name, to, replacements, executable = 0) => {
  // TODO use external library for fast replacements
  let template = await getTemplate(name)
  for (const [key, value] of Object.entries(replacements)) {
    template = template.replaceAll(key, value)
  }
  const absoluteTo = Path.absolute(to)
  await WriteFile.writeFile({
    to: absoluteTo,
    content: template,
  })
  if (executable) {
    switch (executable) {
      case 755:
        executable = 0o755
        break
      default:
        throw new Error('unexpected executable')
    }
    await chmod(absoluteTo, 0o755)
  }
}
