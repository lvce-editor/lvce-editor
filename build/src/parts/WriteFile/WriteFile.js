import * as fs from 'node:fs/promises'
import * as Path from '../Path/Path.js'

export const writeFile = async ({ to, content }) => {
  const absolutePath = Path.isAbsolute(to) ? to : Path.absolute(to)
  await fs.mkdir(Path.dirname(absolutePath), { recursive: true })
  await fs.writeFile(absolutePath, content)
}
