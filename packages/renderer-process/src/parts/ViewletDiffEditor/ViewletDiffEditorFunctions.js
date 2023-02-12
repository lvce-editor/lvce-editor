export const handleWheel = (deltaY) => {
  RendererWorker.send(/* DiffEditor.handleWheel */ 'DiffEditor.handleWheel', /* value */ deltaY)
}
