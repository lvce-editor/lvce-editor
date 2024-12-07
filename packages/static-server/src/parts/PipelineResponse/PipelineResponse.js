export const pipelineResponse = async (response, stream) => {
  console.log('before font stream')
  const { resolve, promise } = Promise.withResolvers()
  stream.on('end', resolve)
  stream.on('data', (x) => {
    response.write(x)
  })
  await promise
  response.end()
}
