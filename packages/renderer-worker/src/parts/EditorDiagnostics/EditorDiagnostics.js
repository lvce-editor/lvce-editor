import * as ExtensionHostDiagnostics from '../ExtensionHost/ExtensionHostDiagnostic.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const getDiagnostics = async (editor) => {
  if (Platform.platform === 'web') {
    console.info('diagnostics not yet implemented for web')
    return []
  }
  const diagnostics = await ExtensionHostDiagnostics.executeDiagnosticProvider(
    editor
  )
  console.log({ diagnostics })
  return diagnostics
}

const getDiagnosticType = (diagnostic) => {
  return diagnostic.type
}

const getVisibleDiagnostics = (editor, diagnostics) => {
  const visibleDiagnostics = []
  for (const diagnostic of diagnostics) {
    visibleDiagnostics.push({
      top: (diagnostic.rowIndex - editor.minLineY) * editor.rowHeight,
      left: diagnostic.columnIndex * editor.columnWidth,
      width: 20,
      height: editor.rowHeight,
      type: getDiagnosticType(diagnostic),
    })
  }
  return visibleDiagnostics
}

const getScrollBarDiagnostics = (editor, diagnostics) => {
  const scrollBarDecorations = []
  for (const diagnostic of diagnostics) {
    scrollBarDecorations.push({
      top: (diagnostic.rowIndex / editor.lines.length) * editor.height,
      height: 2,
    })
  }
  return scrollBarDecorations
}

export const runDiagnostics = async (editor) => {
  // Editor.sync(editor)
  const diagnostics = await getDiagnostics(editor)
  const visibleDiagnostics = getVisibleDiagnostics(editor, diagnostics)
  const scrollBarDiagnostics = getScrollBarDiagnostics(editor, diagnostics)
  // TODO only send visible diagnostics
  await RendererProcess.invoke(
    /* Editor.renderDiagnostics */ 770,
    /* id */ editor.id,
    /* diagnostics */ visibleDiagnostics,
    /* scrollBarDiagnostics */ scrollBarDiagnostics
  )
}

const runDiagnosticsAll = () => {
  // TODO loop over all editors
  // const editor = Main.state.activeEditor
  // if (!editor) {
  // return
  // }
  // runDiagnostics(editor)
}

const onceIdle = (fn) => {
  // TODO treeshake the if/else away in production
  // @ts-ignore
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    // @ts-ignore
    requestIdleCallback(fn)
  } else {
    setTimeout(fn, 0)
  }
}

export const scheduleDiagnosticsAll = () => {
  onceIdle(runDiagnosticsAll)
}

export const hydrate = () => {
  // TODO use global event bus to listen to text document changes
  // TODO use debounce with a configurable delay/debounce time specified in settings.json
  // setInterval(scheduleDiagnostics, 1000)
  // setTimeout(scheduleDiagnostics, 1000)
  // TextDocument.map({
  //   created: scheduleDiagnosticsAll,
  //   changed: scheduleDiagnosticsAll,
  //   saved() {},
  // })
}

// TODO use audio cues for screenreader users,
// vscode has implemented something recently, maybe can also use this
//
// var utterance = new SpeechSynthesisUtterance();
// utterance.text = "error on line 10, column 11";
// window.speechSynthesis.speak(utterance);

// see also https://tink.uk/using-the-web-speech-api-to-simulate-css-speech-support/
