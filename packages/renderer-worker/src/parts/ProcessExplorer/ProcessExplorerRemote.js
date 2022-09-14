import * as Window from '../Window/Window.js'

const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=600,height=300`

export const open = async () => {
  console.log('open remote')
  await Window.open('/process-explorer/index.html', '_blank', params)
}
