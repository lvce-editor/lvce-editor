const button = document.querySelector('button')

const rpc = globalThis.lvceRpc({
  commands: {
    setButtonText(text) {
      // @ts-ignore
      button.textContent = text
    },
  },
})

const handleClick = async () => {
  await rpc.invoke('handleClick')
}

button?.addEventListener('click', handleClick)
