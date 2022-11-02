export const create = () => {
  // TODO create websocket ipc connection
  // TODO paint to offscreencanvas
}

export const addCanvas = (canvasId, canvas) => {
  console.log({ canvas })
  const ctx = canvas.getContext('2d', { alpha: false })
  ctx.fillStyle = 'red'
  ctx.font = '30px Arial'
  ctx.fillText('Terminal', 10, 50)
}
