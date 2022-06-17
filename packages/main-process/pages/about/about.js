const create$Version = (key, value) => {
  const $VersionKey = document.createElement('td')
  $VersionKey.textContent = key
  const $VersionValue = document.createElement('td')
  $VersionValue.textContent = ' : ' + value
  const $Version = document.createElement('tr')
  $Version.append($VersionKey, $VersionValue)
  return $Version
}

const VERSION_ELECTRON = process.versions.electron || 'n/a'
const VERSION_NODE = process.versions.node || 'n/a'
const VERSION_CHROME = process.versions.chrome || 'n/a'
const VERSION_V8 = process.versions.v8 || 'n/a'

document.getElementById('VersionElectron').textContent = VERSION_ELECTRON
document.getElementById('VersionNode').textContent = VERSION_NODE
document.getElementById('VersionChrome').textContent = VERSION_CHROME
document.getElementById('VersionV8').textContent = VERSION_V8
