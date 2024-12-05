const handleMessageFromParent = (message) => {
  console.log('got message', message)
}

const main = () => {
  process.on('message', handleMessageFromParent)
}

main()
