const { shell } = require('electron')

exports.beep = () => {
  shell.beep()
}
