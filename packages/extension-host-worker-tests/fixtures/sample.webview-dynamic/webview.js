const time = document.querySelector('time')
const handleMessage = (event) => {
  const { data } = event
  time.value = data.value
}

const updateTime = () => {
  const dateString = new Date().toLocaleTimeString()
  time.textContent = dateString
}

updateTime()
setInterval(updateTime, 1000)
window.addEventListener('message', handleMessage)
