const { net } = require('electron')
const Assert = require('../Assert/Assert.js')

exports.getJson = async (url) => {
  Assert.string(url)
  const request = net.request({ url })
  let body = ''

  console.log('start', url)
  await new Promise((resolve) => {
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        body += chunk.toString()
      })

      response.on('end', () => {
        resolve(undefined)
      })
    })
    request.end()
  })
  const json = JSON.parse(body)
  return json
}
