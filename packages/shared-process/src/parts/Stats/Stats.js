// parse ps output based on vscode https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

import * as Exec from '../Exec/Exec.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as ParseInt from '../ParseInt/ParseInt.js'

const PID_CMD = /^\s*(\d+)\s+(\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(.+)$/

const parsePsOutputLine = (line) => {
  const matches = PID_CMD.exec(line.trim())
  if (matches && matches.length === 6) {
    return {
      pid: ParseInt.parseInt(matches[1]),
      ppid: ParseInt.parseInt(matches[2]),
      cwd: matches[5],
      load: ParseInt.parseInt(matches[3]),
      mem: ParseInt.parseInt(matches[4]),
    }
  }
}
const parsePsOutput = (stdout, rootPid) => {
  const lines = SplitLines.splitLines(stdout)
  return lines.map(parsePsOutputLine)
}

const getPsOutput = async (rootPid) => {
  const { stdout } = await Exec.exec('ps', ['-g', `${rootPid}`, '-a', '-o', 'pid=,ppid=,pcpu=,pmem=,command='], {
    shell: true,
  })
  return stdout
}

export const listProcessesWithMemoryUsage = async (rootPid) => {
  const stdout = await getPsOutput(rootPid)
  const parsed = parsePsOutput(stdout, rootPid)
  console.log(parsed)
}

const main = async () => {
  await listProcessesWithMemoryUsage(process.pid)
}

main()
