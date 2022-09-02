const Electron = require('electron')
const Platform = require('../Platform/Platform.js')

const getName = (object) => {
  return object.name
}

const getVersions = () => {
  return [
    {
      name: Platform.ProductName,
      version: Platform.version,
    },
    {
      name: 'Electron',
      version: process.versions.electron,
    },
    {
      name: 'Chrome',
      version: process.versions.chrome,
    },
    {
      name: 'Node',
      version: process.versions.node,
    },
  ]
}
const getLength = (string) => {
  return string.length
}

const getVersionString = () => {
  const versions = getVersions()
  const names = versions.map(getName)
  const lengths = names.map(getLength)
  const longestLength = Math.max(...lengths)
  const lines = []
  for (const version of versions) {
    lines.push(version.name.padEnd(longestLength, ' ') + ': ' + version.version)
  }
  return lines.join('\n')
}

const handleCliArgs = (parsedArgs) => {
  const versionString = getVersionString()
  console.info(versionString)
  Electron.app.exit(0)
  return true
}

exports.handleCliArgs = handleCliArgs
