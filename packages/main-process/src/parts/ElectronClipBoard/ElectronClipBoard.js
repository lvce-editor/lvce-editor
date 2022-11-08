const { clipboard } = require('electron')

exports.writeText = (text) => {
  clipboard.writeText(text)
}
