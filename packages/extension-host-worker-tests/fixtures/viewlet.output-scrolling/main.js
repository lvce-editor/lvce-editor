const outputChannelProvider = {
  id: 'scrolling',
  label: 'Scrolling',
}

const getContent = () => {
  const lines = []
  for (let index = 1; index <= 100; index++) {
    lines.push(`line ${index} ${'content '.repeat(30)}`)
  }
  return lines.join('\n')
}

export const activate = () => {
  const channel = vscode.registerOutputChannel(outputChannelProvider)
  channel.append(getContent())
}
