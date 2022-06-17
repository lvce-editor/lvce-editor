const Command = require('../Command/Command.js')
const About = require('./About.js')

exports.__initialize__ = () => {
  Command.register(20001, About.open)
}
