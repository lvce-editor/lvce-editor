// parse ps output based on vscode https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

import * as Assert from '../Assert/Assert.js'
import * as Character from '../Character/Character.js'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

const PID_CMD = /^\s*(\d+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+(.+)$/s

const parsePsOutputLine = (line) => {
  Assert.string(line)
  const matches = PID_CMD.exec(line.trim())
  if (matches && matches.length === 6) {
    return {
      pid: Number.parseInt(matches[1]),
      ppid: Number.parseInt(matches[2]),
      cmd: matches[5],
      // load: parseInt(matches[3]),
      // mem: parseInt(matches[4]),
    }
  }
  throw new Error(`line could not be parsed: ${line}`)
}

export const parsePsOutput = (stdout, rootPid, pidMap) => {
  Assert.string(stdout)
  Assert.number(rootPid)
  Assert.object(pidMap)
  if (stdout === Character.EmptyString) {
    return []
  }
  const lines = SplitLines.splitLines(stdout)
  const result = []
  const depthMap = Object.create(null)
  depthMap[rootPid] = 1
  const parsedLines = lines.map(parsePsOutputLine)
  for (const parsedLine of parsedLines) {
    const { pid, ppid, cmd } = parsedLine
    const depth = pid === rootPid ? 1 : depthMap[ppid]
    if (!depth) {
      continue
    }
    result.push({
      ...parsedLine,
      depth,
      name: ListProcessGetName.getName(pid, cmd, rootPid, pidMap),
    })
    depthMap[pid] = depth + 1
  }
  return result
}
