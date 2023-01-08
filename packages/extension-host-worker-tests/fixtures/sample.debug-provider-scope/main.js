const debugProvider = {
  id: 'test-debug',
  listProcesses() {
    setTimeout(() => {
      this.emitter.handlePaused({
        callFrames: [
          {
            callFrameId: '-1562041251033202176.1.0',
            functionName: 'processTimers',
            functionLocation: {
              scriptId: '18',
              lineNumber: 491,
              columnNumber: 24,
            },
            location: { scriptId: '18', lineNumber: 492, columnNumber: 4 },
            url: '',
            scopeChain: [
              {
                type: 'local',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-1562041251033202176.1.16',
                },
                name: 'processTimers',
                startLocation: {
                  scriptId: '18',
                  lineNumber: 491,
                  columnNumber: 24,
                },
                endLocation: {
                  scriptId: '18',
                  lineNumber: 509,
                  columnNumber: 3,
                },
              },
              {
                type: 'closure',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-1562041251033202176.1.17',
                },
                name: 'getTimerCallbacks',
                startLocation: {
                  scriptId: '18',
                  lineNumber: 419,
                  columnNumber: 26,
                },
                endLocation: {
                  scriptId: '18',
                  lineNumber: 603,
                  columnNumber: 1,
                },
              },
              {
                type: 'closure',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-1562041251033202176.1.18',
                },
                startLocation: {
                  scriptId: '18',
                  lineNumber: 0,
                  columnNumber: 0,
                },
                endLocation: {
                  scriptId: '18',
                  lineNumber: 680,
                  columnNumber: 0,
                },
              },
              {
                type: 'global',
                object: {
                  type: 'object',
                  className: 'global',
                  description: 'global',
                  objectId: '-1562041251033202176.1.19',
                },
              },
            ],
            this: {
              type: 'object',
              className: 'process',
              description: 'process',
              objectId: '-1562041251033202176.1.20',
            },
          },
        ],
        reason: 'other',
        hitBreakpoints: [],
      })
    }, 0)
    return []
  },
  async start(emitter) {
    this.emitter = emitter
  },
  async getProperties() {
    return {
      id: 4,
      result: {
        result: [
          {
            name: 'now',
            value: { type: 'number', value: 1985388, description: '1985388' },
            writable: true,
            configurable: true,
            enumerable: true,
            isOwn: true,
          },
          {
            name: 'list',
            value: { type: 'undefined' },
            writable: true,
            configurable: true,
            enumerable: true,
            isOwn: true,
          },
          {
            name: 'ranAtLeastOneList',
            value: { type: 'undefined' },
            writable: true,
            configurable: true,
            enumerable: true,
            isOwn: true,
          },
        ],
      },
    }
  },
}

export const activate = () => {
  vscode.registerDebugProvider(debugProvider)
}
