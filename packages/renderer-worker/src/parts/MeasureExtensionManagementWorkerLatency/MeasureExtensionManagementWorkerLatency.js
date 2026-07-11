import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as Notification from '../Notification/Notification.js'
import * as Timestamp from '../Timestamp/Timestamp.js'

const messageCount = 100

export const measureExtensionManagementWorkerLatency = async () => {
  await ExtensionManagementWorker.invoke('Extensions.handleData')

  const startTime = Timestamp.now()
  for (let i = 0; i < messageCount; i++) {
    await ExtensionManagementWorker.invoke('Extensions.handleData')
  }
  const endTime = Timestamp.now()
  const averageLatency = (endTime - startTime) / messageCount

  await Notification.create('info', `Average extension management worker latency over ${messageCount} messages: ${averageLatency.toFixed(2)}ms`)
  return averageLatency
}
