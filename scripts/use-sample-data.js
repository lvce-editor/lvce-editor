import { cp, rm } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const main = async () => {
  const playgroundSource = join(
    __dirname,
    '..',
    'build',
    'files',
    'playground-source'
  )
  const playground = join(__dirname, '..', 'playground')
  await rm(playground, { recursive: true, force: true })
  await cp(playgroundSource, playground, { recursive: true })
}

main()
