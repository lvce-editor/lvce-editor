import * as NodeChildProcess from 'node:child_process'
import { once } from 'node:events'
import * as ExecPromise from '../ExecPromise/ExecPromise.ts'
import * as Hash from '../Hash/Hash.ts'

export const execCommand = async (command: any, args: any, options: any): Promise<any> => {
  const { stderr, stdout } = await ExecPromise.execPromise(command, args, options)
  return {
    stderr,
    stdout,
  }
}

export const execCommandHash = async (command: any, args: any, options: any): Promise<any> => {
  const child = NodeChildProcess.spawn(command, args, options)
  const hash = Hash.createHash('sha1')
  child.stdout.pipe(hash)
  await once(child, 'exit')
  const finalHash = hash.digest('hex')
  return finalHash
}

export const execSync = (command: any): any => {
  return NodeChildProcess.execSync(command).toString().trim()
}
