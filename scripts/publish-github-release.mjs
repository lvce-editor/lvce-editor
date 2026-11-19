import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { pathToFileURL } from 'node:url'

const execFileAsync = promisify(execFile)
const RELEASE_VERSION_PATTERN = /^v\d+\.\d+\.\d+$/

const runGh = async (args) => {
  const { stdout } = await execFileAsync('gh', args, { encoding: 'utf8' })
  return stdout
}

export const finalizeRelease = async ({ version, run = runGh, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) }) => {
  if (!RELEASE_VERSION_PATTERN.test(version)) throw new Error(`Invalid release version: ${version}`)

  let lastError
  for (const attempt of [0, 1, 2]) {
    try {
      const release = JSON.parse(await run(['release', 'view', version, '--json', 'isDraft']))
      if (!release.isDraft) return

      await run(['release', 'edit', version, '--draft=false'])
      const publishedRelease = JSON.parse(await run(['release', 'view', version, '--json', 'isDraft']))
      if (!publishedRelease.isDraft) return
      throw new Error(`GitHub release ${version} is still a draft after publication`)
    } catch (error) {
      lastError = error
      if (attempt < 2) await sleep([5000, 15000][attempt])
    }
  }

  throw new Error(`Failed to publish GitHub release ${version} after 3 attempts`, { cause: lastError })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { RELEASE_VERSION } = process.env
  if (!RELEASE_VERSION) throw new Error('Missing RELEASE_VERSION')
  await finalizeRelease({ version: RELEASE_VERSION })
}
