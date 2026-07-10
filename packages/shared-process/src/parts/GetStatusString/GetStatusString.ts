import * as Os from 'node:os'
import * as ByteSize from '../ByteSize/ByteSize.ts'
import * as Platform from '../Platform/Platform.ts'

const UiStrings = {
  Cpus: 'CPUs',
  Memory: 'Memory (System)',
  OsVersion: 'Os Version',
}

const visitVersion = {
  getValue(): any {
    const { version } = Platform
    return version
  },
  key: UiStrings.OsVersion,
}

const visitCpus = {
  getValue(): any {
    const cpus = Os.cpus()
    if (!cpus || cpus.length === 0) {
      return ''
    }
    const firstCpu = cpus[0]
    const { model } = firstCpu
    const cpuLength = cpus.length
    const { speed } = firstCpu
    return `${model} (${cpuLength} x ${speed})`
  },
  key: UiStrings.Cpus,
}

const visitMemory = {
  getValue(): any {
    const totalMemory = Os.totalmem()
    const freeMemory = Os.freemem()
    const totalGb = totalMemory / ByteSize.GB
    const freeGb = freeMemory / ByteSize.GB
    const totalGbShort = totalGb.toFixed(2)
    const freeGbShort = freeGb.toFixed(2)
    return `${totalGbShort} GB (${freeGbShort} GB free)`
  },
  key: UiStrings.Memory,
}

const getKeyLength = (visitor: any): any => {
  return visitor.key.length
}

const getLongestKeyLength = (visitors: any): any => {
  return Math.max(...visitors.map(getKeyLength))
}

const combineVisitors = (visitors: any): any => {
  const longestKeyLength = getLongestKeyLength(visitors)
  const result: any[] = []
  for (const visitor of visitors) {
    const { key } = visitor
    const value = visitor.getValue()
    result.push(`${key}: ${value}`)
  }
  return result.join('\n')
}

export const getStatusString = async (): Promise<any> => {
  const visitors = [visitVersion, visitCpus, visitMemory]
  const result = combineVisitors(visitors)
  return result
}
