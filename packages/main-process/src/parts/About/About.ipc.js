const Command = require('../Command/Command.js')
const About = require('./About.js')

exports.__initialize__ = () => {
  Command.register('About.open', About.open)
}
