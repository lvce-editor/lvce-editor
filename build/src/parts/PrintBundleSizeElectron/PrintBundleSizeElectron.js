import { readdir } from 'fs/promises'
import { join } from 'path'
import { exec } from '../Exec/Exec.js'
import { root } from '../Root/Root.js'

const bundlePath = join(root, 'build/.tmp/linux/deb/amd64/app/usr/lib/lvce-oss')

const getAbsolutePath = (relativePath) => {
  return join(bundlePath, relativePath)
}

const getSize = async (relativePath) => {
  const { stdout } = await exec('du', ['-sb', relativePath], {
    cwd: bundlePath,
  })
  return {
    relativePath,
    size: parseInt(stdout),
  }
}

const parseLine = (line) => {
  const [size, path] = line.split('\t')
  return {
    size,
    path: path.slice(2),
  }
}

const isRelevant = ({ path }) => {
  console.log({ path })
  return !path.includes('/')
}

const sortBySize = (results) => {
  return results.slice().sort((a, b) => b.size - a.size)
}

const getResults = async () => {
  const dirents = await readdir(bundlePath)
  const results = await Promise.all(dirents.map(getSize))
  const sortedResults = sortBySize(results)
  return sortedResults
}

const getStringLength = (string) => {
  return string.length
}

const getLongestStringLength = (strings) => {
  return Math.max(...strings.map(getStringLength))
}

const getProperty = (key) => (object) => object[key]

const prettifySize = (size) => {
  return `${(size / 1_000_000).toFixed(1)}MB`
}

const getDescription = (path) => {
  switch (path) {
    case 'lvce-oss':
      return 'the binary including nodejs'
    case 'LICENSES.chromium.html':
      return 'chromium licenses'
    case 'locales':
      return 'different language packs for chromium, might not all be needed'
    case 'resources':
      return 'the application source code'
    case 'resources.pak':
      return 'unknown'
    case 'libvulkan.so.1':
    case 'libvk_swiftshader.so':
    case 'libGLESv2.so':
    case 'icudtl.dat':
    case 'libEGL.so':
      return 'something from chromium'
    case 'libffmpeg.so':
      return 'ffmpeg libary, needed for playing mp3/mp4'
    default:
      return ''
  }
}

const printResults = (results) => {
  const longestName = getLongestStringLength(
    results.map(getProperty('relativePath'))
  )
  const longestSize = getLongestStringLength(
    results.map(getProperty('size')).map(prettifySize)
  )
  const longestDescription = getLongestStringLength(
    results.map(getProperty('relativePath')).map(getDescription)
  )
  const lines = []
  let line = ''
  line += '| '
  line += 'name'.padEnd(longestName)
  line += ' |'
  line += ' '
  line += 'size'.padEnd(longestSize)
  line += ' |'
  line += ' '
  line += 'description'.padEnd(longestDescription)
  line += ' |'
  lines.push(line)

  line = ''
  line += '| '
  line += '-'.repeat(longestName)
  line += ' |'
  line += ' '
  line += '-'.repeat(longestSize)
  line += ' |'
  line += ' '
  line += '-'.repeat(longestDescription)
  line += ' |'
  lines.push(line)
  // lines.push('|' + '-'.repeat(longestName) + '|')
  for (const result of results) {
    line = ''
    line += '| '
    line += result.relativePath.padEnd(longestName)
    line += ' |'
    line += ' '
    line += prettifySize(result.size).padEnd(longestSize)
    line += ' |'
    line += ' '
    line += getDescription(result.relativePath).padEnd(longestDescription)
    line += ' |'
    lines.push(line)
  }
  const table = lines.join('\n')
  console.info(table)
  // for (const result of results) {
  //   console.info(
  //     `${result.relativePath}: ${(result.size / 1_000_000).toFixed(1)}MB`
  //   )
  // }
}

const main = async () => {
  const results = await getResults()
  printResults(results)
}

main()
