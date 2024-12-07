export const pipelineResponse = async (response, stream) => {
  console.log('before font stream')
  const { resolve, promise } = Promise.withResolvers()

  stream.on('close', () => {
    console.log('read close')
  })
  stream.on('end', () => {
    resolve(undefined)
  })
  stream.on('data', (x) => {
    console.log('write chunk')
    response.write(x)
  })
  response.on('finish', () => {
    console.log('response finish')
  })
  response.on('close', () => {
    console.log('response closed')
  })

  await promise

  response.end()
}
