const time = document.querySelector('time')
const handleMessage = (event) => {
  const { data } = event
  time.value = data.value
}
window.addEventListener('message', handleMessage)
