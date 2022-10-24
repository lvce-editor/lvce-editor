import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Terminal from '../Terminal/Terminal.js'

// TODO support multiple terminals
let globalTerminal

export const name = 'Terminal'

const handleInput = (input) => {
  RendererWorker.send(
    /* viewletSend */ 2133,
    /* viewletId */ 'Terminal',
    /* method */ 'write',
    /* input */ input
  )
}

const handleFocus = () => {
  Focus.setFocus('terminal')
}

export const create = (id) => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminal'
  const terminal = Terminal.create({
    $Element: $Viewlet,
    handleInput,
  })

  $Viewlet.addEventListener('focusin', handleFocus)

  globalTerminal = terminal

  const state = {
    $Viewlet,
    handleUpdate() {
      // const width = $Viewlet.clientWidth
      // const height = $Viewlet.clientHeight
      // RendererWorker.send(
      //   /* viewletSend */ 2133,
      //   /* viewletId */ 'Terminal',
      //   /* method */ 'resize',
      //   /* width */ width,
      //   /* height */ height,
      // )
    },
  }

  window.addEventListener('resize', state.handleUpdate, { passive: true })

  return state
}

export const refresh = (state, context) => {
  // state.element.textContent = context.text
}

export const dispose = (state) => {
  // TODO unregister callback
  // SharedProcess.unregisterChannel(channel )

  window.removeEventListener('resize', state.handleUpdate)
}

export const focus = (state) => {
  Assert.object(state)
  if (!globalTerminal) {
    return
  }
  globalTerminal.terminal.focus()
}

export const reduceFocus = (state, action) => {}

// TODO what is this
export const reduceWrite = (state, action) => {
  if (!globalTerminal) {
    return
  }
  Terminal.write(globalTerminal, state)
}

export const reduce = (state, action) => {
  switch (action.type) {
    case 'write':
      return reduceWrite(state, action)
    case 'focus':
      return reduceFocus(state, action)
    default:
      break
  }
}

export const write = (data) => {
  if (!globalTerminal) {
    return
  }
  Terminal.write(globalTerminal, data)
}

export const Commands = {
  9922: write,
}

export const css = '/css/parts/ViewletTerminal.css'
