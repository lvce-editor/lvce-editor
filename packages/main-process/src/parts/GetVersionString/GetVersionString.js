const JoinLines = require('../JoinLines/JoinLines.js')
const Platform = require('../Platform/Platform.js')
const Process = require('../Process/Process.js')

const getName = (object) => {
  return object.name
}

const getVersions = () => {
  return [
    {
      name: Platform.productNameLong,
      version: Platform.version,
    },
    {
      name: 'Electron',
      version: Process.getElectronVersion(),
    },
    {
      name: 'Chrome',
      version: Process.getChromeVersion(),
    },
    {
      name: 'Node',
      version: Process.getNodeVersion(),
    },
  ]
}

const getLength = (string) => {
  return string.length
}

exports.getVersionString = () => {
  const versions = getVersions()
  const names = versions.map(getName)
  const lengths = names.map(getLength)
  const longestLength = Math.max(...lengths)
  const lines = []
  for (const version of versions) {
    lines.push(version.name.padEnd(longestLength, ' ') + ': ' + version.version)
  }
  return JoinLines.joinLines(lines)
}
