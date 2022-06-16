import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const copySources = async () => {
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/Editor',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Editor',
  })
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/Assert',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Assert',
  })
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/WebWorker',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/WebWorker',
  })
  // await Copy.copy({
  //   from: 'packages/renderer-process/src/parts/EditorCompletion',
  //   to: 'build/.tmp/editor/packages/renderer-process/src/parts/EditorCompletion',
  // })
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/EditorHover',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/EditorHover',
  })
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/Widget',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Widget',
  })
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/Focus',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Focus',
  })
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/Context',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Context',
  })
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/RendererWorker',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/RendererWorker',
  })
  // await Copy.copy({
  //   from: 'packages/renderer-process/src/parts/AssetDir',
  //   to: 'build/.tmp/editor/packages/renderer-process/src/parts/AssetDir',
  // })
  // await Copy.copy({
  //   from: 'packages/renderer-process/src/parts/Worker',
  //   to: 'build/.tmp/editor/packages/renderer-process/src/parts/Worker',
  // })
  await Copy.copy({
    from: 'packages/renderer-process/src/parts/Viewlet',
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Viewlet',
  })
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Viewlet/Viewlet.js',
    content: '',
  })
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Command/Command.js',
    content: `export const execute = () => {}`,
  })
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/packages/renderer-process/src/parts/Platform/Platform.js',
    content: `export const platform = 'web'`,
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/Editor',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/Editor',
  })
  // await Copy.copy({
  //   from: 'packages/renderer-worker/src/parts/EditorCursor',
  //   to: 'build/.tmp/editor/packages/renderer-worker/src/parts/EditorCursor',
  // })
  // await Copy.copy({
  //   from: 'packages/renderer-worker/src/parts/EditorSelection',
  //   to: 'build/.tmp/editor/packages/renderer-worker/src/parts/EditorSelection',
  // })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/TextDocument',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/TextDocument',
  })
  await Replace.replace({
    path: `build/.tmp/editor/packages/renderer-worker/src/parts/TextDocument/TextDocument.js`,
    occurrence: `import * as FileSystem from '../FileSystem/FileSystem.js'`,
    replacement: '',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/Tokenizer',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/Tokenizer',
  })
  // await Copy.copy({
  //   from: 'packages/renderer-worker/src/parts/EditorScrolling',
  //   to: 'build/.tmp/editor/packages/renderer-worker/src/parts/EditorScrolling',
  // })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/RendererProcess',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/RendererProcess',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/Callback',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/Callback',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/EditorCommand',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/EditorCommand',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/Languages',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/Languages',
  })
  // await Copy.copy({
  //   from: 'packages/renderer-worker/src/parts/AssetDir',
  //   to: 'build/.tmp/editor/packages/renderer-worker/src/parts/AssetDir',
  // })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/SharedProcess',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/SharedProcess',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/CacheStorage',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/CacheStorage',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/WebSocket',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/WebSocket',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/JsonRpc',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/JsonRpc',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/FileSystem',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/FileSystem',
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src/parts/Platform',
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/Platform',
  })
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/Viewlet/Viewlet.js',
    content: '',
  })
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/packages/renderer-worker/src/parts/Command/Command.js',
    content: `export const execute = () => {
  // TODO
}
`,
  })
}

const bundle = async () => {
  await BundleJs.bundleJs({
    cwd: Path.absolute('build/.tmp/editor/packages/renderer-process'),
    from: './src/parts/Editor/Editor.js',
    platform: 'web',
    // minify: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute('build/.tmp/editor/packages/renderer-worker'),
    from: './src/parts/Editor/Editor.js',
    platform: 'web',
    minify: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute('build/.tmp/editor/packages/renderer-worker'),
    from: './src/parts/EditorCommand/EditorCommand.ipc.js',
    platform: 'web',
    minify: true,
  })
}

const generateTypings = async () => {
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/dist/editor.d.ts',
    content: `export interface Editor {
  /**
   * Type text into the editor.
   */
  executeCommand(id: 'type', text: string): Promise<void>
  /**
   * Undo the previous operation.
   */
  executeCommand(id: 'undo'): Promise<void>
  /**
   * Redo the previous operation.
   */
  executeCommand(id: 'redo'): Promise<void>
  /**
   * Cut text.
   */
  executeCommand(id: 'cut'): Promise<void>
  /**
   * Copy text.
   */
  executeCommand(id: 'copy'): Promise<void>
  /**
   * Paste text.
   */
  executeCommand(id: 'paste'): Promise<void>
  /**
   * Delete a character left.
   */
  executeCommand(id: 'deleteCharacterLeft'): Promise<void>
  /**
   * Delete a character right.
   */
  executeCommand(id: 'deleteCharacterRight'): Promise<void>
  /**
   * Delete a word left.
   */
  executeCommand(id: 'deleteWordLeft'): Promise<void>
  /**
   * Delete a word right.
   */
  executeCommand(id: 'deleteWordRight'): Promise<void>
  /**
   * Delete a part of a word left.
   */
  executeCommand(id: 'deleteWordPartLeft'): Promise<void>
  /**
   * Delete a part of a word right.
   */
  executeCommand(id: 'deleteWordPartRight'): Promise<void>
  /**
   * Move the cursor left by one character.
   */
  executeCommand(id: 'cursorCharacterLeft'): Promise<void>
  /**
   * Move the cursor right by one character.
   */
  executeCommand(id: 'cursorCharacterRight'): Promise<void>
  /**
   * Move the cursor left by one word.
   */
  executeCommand(id: 'cursorWordLeft'): Promise<void>
  /**
   * Move the cursor right by one word.
   */
  executeCommand(id: 'cursorWordRight'): Promise<void>
  /**
   * Move the cursor to the start of the line.
   */
  executeCommand(id: 'cursorHome'): Promise<void>
  /**
   * Move the cursor to the end of the line.
   */
  executeCommand(id: 'cursorEnd'): Promise<void>
  /**
   * Move the cursor up by one line.
   */
  executeCommand(id: 'cursorUp'): Promise<void>
  /**
   * Move the cursor down by one line.
   */
  executeCommand(id: 'cursorDown'): Promise<void>
  /**
   * Copy the line down.
   */
  executeCommand(id: 'copyLineDown'): Promise<void>
  /**
   * Copy the line up.
   */
  executeCommand(id: 'copyLineUp'): Promise<void>
  /**
   * Move the line down.
   */
  executeCommand(id: 'moveLineDown'): Promise<void>
  /**
   * Move the line up.
   */
  executeCommand(id: 'moveLineUp'): Promise<void>
  /**
   * Select all.
   */
  executeCommand(id: 'selectAll'): Promise<void>
  /**
   * Select the current line.
   */
  executeCommand(id: 'selectLine'): Promise<void>
  /**
   * Increase selection by one character left.
   */
  executeCommand(id: 'selectCharacterLeft'): Promise<void>
  /**
   * Increase selection by one character right.
   */
  executeCommand(id: 'selectCharacterRight'): Promise<void>
  /**
   * Increase selection by one word left.
   */
  executeCommand(id: 'selectWordLeft'): Promise<void>
  /**
   * Increase selection by one word right.
   */
  executeCommand(id: 'selectWordRight'): Promise<void>
  /**
   * Increase selection by one word part left.
   */
  executeCommand(id: 'selectWordPartLeft'): Promise<void>
  /**
   * Increase selection by one word part right.
   */
  executeCommand(id: 'selectWordPartRight'): Promise<void>
  /**
   * Toggle line comment.
   */
  executeCommand(id: 'toggleLineComment'): Promise<void>
  /**
   * Toggle block comment.
   */
  executeCommand(id: 'toggleBlockComment'): Promise<void>
  /**
   * Insert a new line.
   */
  executeCommand(id: 'insertLineBreak'): Promise<void>
  /**
   * Cancel the current selection.
   */
  executeCommand(id: 'cancelSelection'): Promise<void>
  /**
   * Handle a single click.
   */
  executeCommand(id: 'handleSingleClick', x: number, y: number): Promise<void>
  /**
   * Handle a double click.
   */
  executeCommand(id: 'handleDoubleClick', x: number, y: number): Promise<void>
  /**
   * Handle a triple click.
   */
  executeCommand(id: 'handleTripleClick', x: number, y: number): Promise<void>
  /**
   * Indent more.
   */
  executeCommand(id: 'indentMore'): Promise<void>
  /**
   * Indent less.
   */
  executeCommand(id: 'indentLess'): Promise<void>
}

export const create: () => Editor
`,
  })
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/dist/test.ts',
    content: `import { Editor } from './editor.js'

const e = {} as Editor

e.executeCommand('type', 'abc')
e.executeCommand('deleteCharacterLeft')
e.executeCommand('cursorHome')
e.executeCommand('cursorEnd')
e.executeCommand('cursorUp')
e.executeCommand('cursorDown')
e.executeCommand('cursorWordLeft')
e.executeCommand('cursorWordRight')
e.executeCommand('copyLineDown')
e.executeCommand('moveLineDown')
e.executeCommand('moveLineUp')
e.executeCommand('selectAll')
e.executeCommand('selectLine')
e.executeCommand('selectCharacterLeft')
e.executeCommand('selectCharacterRight')
e.executeCommand('toggleLineComment')
e.executeCommand('toggleBlockComment')
e.executeCommand('insertLineBreak')
e.executeCommand('cancelSelection')
e.executeCommand('selectWordPartLeft')
e.executeCommand('selectWordPartRight')
e.executeCommand('selectWordLeft')
e.executeCommand('selectWordRight')
e.executeCommand('handleSingleClick', 0, 0)
e.executeCommand('handleDoubleClick', 0, 0)
e.executeCommand('handleTripleClick', 0, 0)
e.executeCommand('indentMore')
e.executeCommand('indentLess')
`,
  })
}

const generateSampleCode = async () => {
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/index.html',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editor</title>
  </head>
  <body>
    <div id="editor"></div>
    <script type="module">
      import * as Editor from './lib/Editor.js'

      const getTokenizer = (languageId) => {
        switch(languageId){
          case 'javascript':
            return import('./tokenizers/tokenizeJavaScript.js')
          case 'css':
            return import('./tokenizers/tokenizeCss.js')
        }
      }

      const main = () => {
        const editor = Editor.create({
          root: document.getElementById('editor'),
          value: 'sample text',
          languageId: 'html',
          getTokenizer,
          keyBindings: []
        })
      }

      main()

    </script>
  </body>
</html>
`,
  })
  await WriteFile.writeFile({
    to: 'build/.tmp/editor/lib/Editor.js',
    content: `export const state = {
      editors: [],
      messageChannel: undefined,
    }

    const createModel = () => {}

    const createUi = () => {
      const $TextArea = document.createElement('textarea')
      return {
        $TextArea,
      }
    }

    export const create = ({ root, value, languageId, getTokenizer }) => {
      if (state.editors.length === 0) {
        const channel = new MessageChannel()
        const port1 = channel.port1
        const port2 = channel.port2
        port1.onmessage = () => {}
      }
      const model = createModel()
      const ui = createUi()
      ui.$TextArea.value = value
      root.append(ui.$TextArea)
    }

`,
  })
}

export const build = async () => {
  console.time('copySources')
  await copySources()
  console.timeEnd('copySources')

  console.time('generateSampleCode')
  await generateSampleCode()
  console.timeEnd('generateSampleCode')

  // console.time('bundle')
  // await bundle()
  // console.timeEnd('bundle')

  // console.time('generateTypings')
  // await generateTypings()
  // console.timeEnd('generateTypings')
}

build()
