import * as Os from 'node:os'
import * as Platform from '../Platform/Platform.js'
import * as ByteSize from '../ByteSize/ByteSize.js'

const UiStrings = {
  OsVersion: 'Os Version',
  Cpus: 'CPUs',
  Memory: 'Memory (System)',
}

const visitVersion = {
  key: UiStrings.OsVersion,
  getValue() {
    const { version } = Platform
    return version
  },
}

const visitCpus = {
  key: UiStrings.Cpus,
  getValue() {
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
}

const visitMemory = {
  key: UiStrings.Memory,
  getValue() {
    const totalMemory = Os.totalmem()
    const freeMemory = Os.freemem()
    const totalGb = totalMemory / ByteSize.GB
    const freeGb = freeMemory / ByteSize.GB
    const totalGbShort = totalGb.toFixed(2)
    const freeGbShort = freeGb.toFixed(2)
    return `${totalGbShort} GB (${freeGbShort} GB free)`
  },
}

const getKeyLength = (visitor) => {
  return visitor.key.length
}

const getLongestKeyLength = (visitors) => {
  return Math.max(...visitors.map(getKeyLength))
}

const combineVisitors = (visitors) => {
  const longestKeyLength = getLongestKeyLength(visitors)
  const result = []
  for (const visitor of visitors) {
    const { key } = visitor
    const value = visitor.getValue()
    result.push(`${key}: ${value}`)
  }
  return result.join('\n')
}

export const getStatusString = async () => {
  const visitors = [visitVersion, visitCpus, visitMemory]
  const result = combineVisitors(visitors)
  return result
}
