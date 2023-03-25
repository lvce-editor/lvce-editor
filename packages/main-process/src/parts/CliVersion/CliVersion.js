const ElectronApp = require('../ElectronApp/ElectronApp.js')
const ExitCode = require('../ExitCode/ExitCode.js')
const JoinLines = require('../JoinLines/JoinLines.js')
const Platform = require('../Platform/Platform.js')
const Process = require('../Process/Process.js')

const getName = (object) => {
  return object.name
}

const getVersions = () => {
  return [
    {
      name: Platform.productName,
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

const getVersionString = () => {
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

const handleCliArgs = (parsedArgs) => {
  const versionString = getVersionString()
  console.info(versionString)
  ElectronApp.exit(ExitCode.Sucess)
  return true
}

exports.handleCliArgs = handleCliArgs
