// This function is serialized into the static export. Keep it self-contained.
export const createBundledWorkerConstructor = (factories: any, host: any): any => {
  const NativeWorker = host.Worker
  class BundledWorker extends host.EventTarget {
    static [Symbol.hasInstance](value: any): boolean {
      return value instanceof NativeWorker || Object.prototype.isPrototypeOf.call(this.prototype, value)
    }
    onmessage: any = null
    onmessageerror: any = null
    onerror: any = null
    stopped = false
    ports = new Set<any>()
    timers = new Map<any, any>()
    frames = new Map<any, any>()
    children = new Set<any>()
    abortController = new host.AbortController()
    endpoint: any

    constructor(url: any, options: any = {}) {
      super()
      const resolved = new URL(url, host.location.href)
      const factory = factories[resolved.href]
      if (!factory || options.type !== 'module') {
        return new NativeWorker(url, options)
      }
      const channel = new host.MessageChannel()
      this.endpoint = channel.port1
      this.ports.add(channel.port1)
      this.ports.add(channel.port2)
      const dispatch = (event: any): void => {
        if (this.stopped) return
        const copy = new host.MessageEvent(event.type, { data: event.data, ports: event.ports })
        this.dispatchEvent(copy)
        const listener = event.type === 'message' ? this.onmessage : this.onmessageerror
        listener?.call(this, copy)
      }
      channel.port1.addEventListener('message', dispatch)
      channel.port1.addEventListener('messageerror', dispatch)
      channel.port1.start()
      // The nested Worker/MessageChannel constructors have their own this.
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const owner = this
      const schedule =
        (start: any, stop: any, repeat: boolean, registry = owner.timers) =>
        (callback: any, delay: any, ...args: any[]): any => {
          if (owner.stopped) return 0
          const id = start((...callbackArgs: any[]) => {
            if (!repeat) registry.delete(id)
            if (!owner.stopped) callback(...callbackArgs, ...args)
          }, delay)
          registry.set(id, stop)
          return id
        }
      const clear = (id: any): void => {
        owner.timers.get(id)?.(id)
        owner.timers.delete(id)
      }
      const trackedPorts = new WeakSet<any>()
      const trackPort = (port: any): void => {
        if (owner.stopped) {
          port.close()
          return
        }
        if (trackedPorts.has(port)) return
        trackedPorts.add(port)
        owner.ports.add(port)
        const close = port.close.bind(port)
        const postMessage = port.postMessage.bind(port)
        port.close = (): void => {
          owner.ports.delete(port)
          close()
        }
        port.postMessage = (message: any, options: any): void => {
          postMessage(message, options)
          const transfer = Array.isArray(options) ? options : options?.transfer || []
          for (const item of transfer) owner.ports.delete(item)
        }
        port.addEventListener('message', (event: any) => {
          for (const transferred of event.ports) trackPort(transferred)
        })
      }
      trackPort(channel.port2)
      const scope: any = {
        addEventListener: channel.port2.addEventListener.bind(channel.port2),
        cancelAnimationFrame: (id: any) => {
          owner.frames.get(id)?.(id)
          owner.frames.delete(id)
        },
        clearInterval: clear,
        clearTimeout: clear,
        close: () => owner.terminate(),
        document: undefined,
        fetch: (input: any, init: any) => {
          const signal = init?.signal || input?.signal
          return host.fetch(typeof input === 'string' ? new URL(input, resolved) : input, {
            ...init,
            signal: signal ? host.AbortSignal.any([signal, owner.abortController.signal]) : owner.abortController.signal,
          })
        },
        location: resolved,
        MessageChannel: class extends host.MessageChannel {
          constructor() {
            super()
            trackPort(this.port1)
            trackPort(this.port2)
          }
        },
        name: options.name || '',
        postMessage: channel.port2.postMessage.bind(channel.port2),
        removeEventListener: channel.port2.removeEventListener.bind(channel.port2),
        requestAnimationFrame: schedule(host.requestAnimationFrame.bind(host), host.cancelAnimationFrame.bind(host), false, owner.frames),
        setInterval: schedule(host.setInterval.bind(host), host.clearInterval.bind(host), true),
        setTimeout: schedule(host.setTimeout.bind(host), host.clearTimeout.bind(host), false),
        window: undefined,
        Worker: class extends BundledWorker {
          constructor(childUrl: any, childOptions: any) {
            super(new URL(childUrl, resolved), childOptions)
            if (owner.stopped) this.terminate()
            else owner.children.add(this)
          }
        },
        WorkerGlobalScope: class WorkerGlobalScope {},
      }
      Object.defineProperty(scope, 'onmessage', {
        get: (): any => channel.port2.onmessage,
        set: (listener): void => {
          channel.port2.onmessage = listener
        },
      })
      const global = new Proxy(scope, {
        get(target, key): any {
          if (key in target) return target[key]
          return host[key]
        },
        has: (target, key): boolean => key in target || key in host,
      })
      scope.globalThis = global
      scope.self = global
      channel.port2.start()
      // Start after callers have installed readiness/error listeners.
      queueMicrotask(() => {
        if (owner.stopped) return
        Promise.resolve()
          .then(() => factory(global))
          .catch((error) => {
            if (owner.stopped) return
            const event = new host.ErrorEvent('error', { error, filename: resolved.href, message: String(error) })
            try {
              owner.dispatchEvent(event)
              owner.onerror?.call(owner, event)
            } finally {
              owner.terminate()
            }
          })
      })
    }

    postMessage(message: any, transfer: any): void {
      if (!this.stopped) this.endpoint.postMessage(message, transfer)
    }

    terminate(): void {
      if (this.stopped) return
      this.stopped = true
      this.abortController.abort()
      for (const child of this.children) child.terminate()
      for (const [id, cancel] of this.timers) cancel(id)
      for (const [id, cancel] of this.frames) cancel(id)
      for (const port of this.ports) port.close()
      this.children.clear()
      this.timers.clear()
      this.frames.clear()
      this.ports.clear()
      this.onmessage = null
      this.onmessageerror = null
      this.onerror = null
    }
  }
  return BundledWorker
}
