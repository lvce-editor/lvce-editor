import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const playBell = async () => {
  const src = '/sounds/bell.oga'
  await RendererProcess.invoke(/* Audio.play */ 3211, /* src */ src)
}
