import { createServer } from 'node:http'
import * as Assert from '../Assert/Assert.js'

/** @type {Record<string, {
  server: import('node:http').Server | undefined,
  portPromise: Promise<number> | undefined,
  codeQueue: string[],
  codePromise: Promise<string> | undefined,
  resolveCode: ((value: string) => void) | undefined,
  rejectCode: ((reason?: unknown) => void) | undefined,
}>} */
const states = Object.create(null)

const getOrCreateState = (id) => {
  if (!states[id]) {
    states[id] = {
      server: undefined,
      portPromise: undefined,
      codeQueue: [],
      codePromise: undefined,
      resolveCode: undefined,
      rejectCode: undefined,
    }
  }
  return states[id]
}

const clearPendingCodePromise = (state) => {
  state.codePromise = undefined
  state.resolveCode = undefined
  state.rejectCode = undefined
}

const resolveCode = (state, code) => {
  if (state.resolveCode) {
    const { resolveCode } = state
    clearPendingCodePromise(state)
    resolveCode(code)
    return
  }
  state.codeQueue.push(code)
}

const rejectPendingCode = (state, error) => {
  if (!state.rejectCode) {
    return
  }
  const { rejectCode } = state
  clearPendingCodePromise(state)
  rejectCode(error)
}

const getCodeFromRequest = (request) => {
  if (!request.url) {
    return undefined
  }
  const url = new URL(request.url, 'http://localhost')
  const code = url.searchParams.get('code')
  return code || undefined
}

const getSuccessPage = () => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Authentication Complete</title>
    <style>
      :root {
        color-scheme: light;
        --background: linear-gradient(180deg, #f4f7fb 0%, #e9eef8 100%);
        --panel: rgba(255, 255, 255, 0.92);
        --panel-border: rgba(33, 52, 88, 0.08);
        --text: #132238;
        --muted: #5f6f86;
        --accent: #1f7a5a;
        --accent-soft: #e7f6ef;
        --shadow: 0 24px 60px rgba(44, 65, 98, 0.16);
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        min-height: 100%;
        font-family: Inter, 'Segoe UI', sans-serif;
        background: var(--background);
        color: var(--text);
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }

      .card {
        width: min(100%, 460px);
        padding: 32px 28px;
        border: 1px solid var(--panel-border);
        border-radius: 20px;
        background: var(--panel);
        box-shadow: var(--shadow);
        text-align: center;
        backdrop-filter: blur(12px);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        margin-bottom: 20px;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
      }

      h1 {
        margin: 0;
        font-size: 28px;
        line-height: 1.15;
        letter-spacing: -0.03em;
      }

      p {
        margin: 14px 0 0;
        font-size: 15px;
        line-height: 1.6;
        color: var(--muted);
      }

      .hint {
        margin-top: 22px;
        padding: 12px 14px;
        border-radius: 12px;
        background: rgba(19, 34, 56, 0.04);
        font-size: 14px;
      }

      .button {
        margin-top: 20px;
        border: 0;
        border-radius: 999px;
        background: var(--text);
        color: #fff;
        padding: 10px 18px;
        font: inherit;
        cursor: pointer;
      }

      .button:hover {
        background: #0d182a;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <div class="badge" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" role="presentation">
          <path d="M20 7L10 17L5 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </div>
      <h1>Authentication complete</h1>
      <p>Your sign-in finished successfully. You can return to the app now.</p>
      <p class="hint">This window is no longer needed and can be closed.</p>
      <button class="button" type="button" id="close-button">Close Window</button>
    </main>
    <script>
      const closeWindow = () => {
        window.close()
      }

      document.getElementById('close-button')?.addEventListener('click', closeWindow)
      window.setTimeout(closeWindow, 1200)
    </script>
  </body>
</html>`
}

const handleRequest = (id, request, response) => {
  const state = states[id]
  if (state) {
    const code = getCodeFromRequest(request)
    if (code) {
      resolveCode(state, code)
    }
  }
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(getSuccessPage())
}

const listen = (server) => {
  const { promise, resolve, reject } = Promise.withResolvers()

  const onError = (error) => {
    server.off('listening', onListening)
    reject(error)
  }

  const onListening = () => {
    server.off('error', onError)
    const address = server.address()
    if (!address || typeof address === 'string') {
      reject(new Error('failed to determine oauth server port'))
      return
    }
    resolve(address.port)
  }

  server.once('error', onError)
  server.once('listening', onListening)
  server.listen(0, 'localhost')
  return promise
}

const getOrCreateCodePromise = (state) => {
  if (!state.codePromise) {
    const { promise, resolve, reject } = Promise.withResolvers()
    state.codePromise = promise
    state.resolveCode = resolve
    state.rejectCode = reject
  }
  return state.codePromise
}

export const create = async (id) => {
  Assert.string(id)
  const state = getOrCreateState(id)
  if (state.portPromise) {
    return state.portPromise
  }
  const server = createServer((request, response) => {
    handleRequest(id, request, response)
  })
  state.server = server
  state.portPromise = listen(server)
  try {
    return await state.portPromise
  } catch (error) {
    state.server = undefined
    state.portPromise = undefined
    delete states[id]
    throw error
  }
}

export const getCode = async (id) => {
  Assert.string(id)
  const state = states[id]
  if (!state || !state.server) {
    throw new Error(`oauth server ${id} not found`)
  }
  if (state.codeQueue.length > 0) {
    return state.codeQueue.shift()
  }
  return getOrCreateCodePromise(state)
}

export const dispose = async (id) => {
  Assert.string(id)
  const state = getOrCreateState(id)
  if (!state.server) {
    delete states[id]
    return
  }
  const { server } = state
  state.server = undefined
  state.portPromise = undefined
  state.codeQueue = []
  rejectPendingCode(state, new Error('oauth server disposed'))
  const { promise, resolve, reject } = Promise.withResolvers()
  server.close((error) => {
    if (error) {
      reject(error)
      return
    }
    resolve(undefined)
  })
  await promise
  delete states[id]
}
