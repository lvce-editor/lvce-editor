import { cp, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const main = async () => {
  const playgroundSource = join(__dirname, '..', 'packages', 'build', 'files', 'playground-source')
  const playground = join(__dirname, '..', 'playground')
  await rm(playground, { recursive: true, force: true })
  await cp(playgroundSource, playground, { recursive: true })
}

main()
