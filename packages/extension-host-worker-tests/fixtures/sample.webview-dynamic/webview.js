const time = document.querySelector('time')

const handleMessage = (event) => {
  console.log('got port message')
}

const handleFirstMessage = (event) => {
  const message = event.data
  const port = message.params[0]
  port.onmessage = handleMessage
  port.postMessage('ready')
}

const updateTime = () => {
  const dateString = new Date().toLocaleTimeString()
  time.textContent = dateString
}

updateTime()
setInterval(updateTime, 1000)

window.addEventListener('message', handleFirstMessage, {
  once: true,
})
