import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'

const pdfData = atob(
  'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
    'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
    'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
    'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
    'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
    'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
    'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
    'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
    'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
    'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
    'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
    'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
    'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G'
)

const main = async () => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })

  console.log('start waiting')
  const canvas = await new Promise((resolve) => {
    onmessage = (event) => {
      console.log(event)
      const { data } = event
      if (data.method === 'setCanvas') {
        const canvas = data.params[0]
        console.log({ canvas })
        resolve(canvas)
      }
    }
  })
  console.log('finish waiting')

  const { pdfjsLib } = await import('./parts/Pdfjs/Pdfjs.js')

  const loadingTask = pdfjsLib.getDocument({ data: pdfData })
  const pdf = await loadingTask.promise

  // Fetch the first page
  const pageNumber = 1
  const page = await pdf.getPage(pageNumber)

  console.log('Page loaded')

  const scale = 1.5
  const viewport = page.getViewport({ scale: scale })

  // Prepare canvas using PDF page dimensions
  const context = canvas.getContext('2d', { alpha: false })

  canvas.height = viewport.height
  canvas.width = viewport.width

  // Render PDF page into canvas context
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  }
  const renderTask = page.render(renderContext)
  await renderTask.promise

  // postMessage('canvas', canvas./)
  console.log('Page rendered')
}

main()
