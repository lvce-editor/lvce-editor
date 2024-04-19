import * as Assert from '../Assert/Assert.js'

export const handleMessagePortForEmbedsProcess = async (port) => {
  Assert.object(port)
  // TODO send port to embeds process
  console.log({ port })
}
