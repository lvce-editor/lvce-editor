const ListProcessesWithMemoryUsage = require('./ListProcessesWithMemoryUsage.js')

exports.name = 'ListProcessesWithMemoryUsage'

exports.Commands = {
  listProcessesWithMemoryUsage: ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage,
}
