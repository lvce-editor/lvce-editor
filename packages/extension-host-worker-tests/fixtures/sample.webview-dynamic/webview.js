const time = document.querySelector('time')

const updateTime = (dateString) => {
  time.textContent = dateString
}

const handleMessage = (event) => {
  const message = event.data
  updateTime(...message.params)
}

const handleFirstMessage = (event) => {
  const message = event.data
  const port = message.params[0]
  port.onmessage = handleMessage
  port.postMessage('ready')
}

window.addEventListener('message', handleFirstMessage, {
  once: true,
})
