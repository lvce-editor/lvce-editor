const handleMessage = (event) => {
  console.log({ event })
}

const main = () => {
  console.info('[test-service-worker] activated')
  onmessage = handleMessage

  // @ts-ignore
  for (const client of clients) {
    client.postMessage('ready')
  }
}

main()
