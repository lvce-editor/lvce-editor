import { execFile, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { once } from 'node:events'
import { promisify } from 'node:util'

const execPromise = promisify(execFile)

export const execCommand = async (command, args, options) => {
  // execf
  const act = performance.now()
  const { stdout, stderr } = await execPromise(command, args, options)
  const end = performance.now()
  console.log(`act ${end - act}`)
  return {
    stdout,
    stderr,
  }
}

export const execCommandHash = async (command, args, options) => {
  // execf
  const act = performance.now()
  const child = spawn(command, args, options)
  const hash = createHash('sha1')
  child.stdout.pipe(hash)
  await once(child, 'exit')
  const finalHash = hash.digest('hex')
  const end = performance.now()
  console.log(`act ${end - act}`)
  // console.log({ bin })
  return finalHash
}
