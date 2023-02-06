import { exec, execFile, execSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { once } from 'node:events'
import { promisify } from 'node:util'

const execPromise = promisify(execFile)

export const execCommand = async (command, args, options) => {
  const bin = execSync(`which ${command}`).toString().trim()
  // execf
  const act = performance.now()
  const { stdout, stderr } = await execPromise(bin, args, options)
  const end = performance.now()
  console.log(`act ${end - act}`)
  console.log({ bin })
  return {
    stdout,
    stderr,
  }
}

export const execCommandHash = async (command, args, options) => {
  const bin = execSync(`which ${command}`).toString().trim()
  // execf
  const act = performance.now()
  const child = spawn(bin, args, options)
  const hash = createHash('sha1')
  child.stdout.pipe(hash)
  await once(child, 'exit')
  const finalHash = hash.digest('hex')
  const end = performance.now()
  console.log(`act ${end - act}`)
  // console.log({ bin })
  return finalHash
}
