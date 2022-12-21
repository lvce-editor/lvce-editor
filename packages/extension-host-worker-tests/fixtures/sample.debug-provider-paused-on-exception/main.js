const debugProvider = {
  id: 'test-debug',
  listProcesses() {
    setTimeout(() => {
      this.emitter.handlePaused({
        callFrames: [
          {
            callFrameId: '-6093838151779154534.1.0',
            functionName: '',
            functionLocation: {
              scriptId: '464',
              lineNumber: 2,
              columnNumber: 12,
            },
            location: {
              scriptId: '464',
              lineNumber: 4,
              columnNumber: 4,
            },
            url: '',
            scopeChain: [
              {
                type: 'local',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-6093838151779154534.1.15',
                },
                startLocation: {
                  scriptId: '464',
                  lineNumber: 2,
                  columnNumber: 12,
                },
                endLocation: {
                  scriptId: '464',
                  lineNumber: 6,
                  columnNumber: 1,
                },
              },
              {
                type: 'global',
                object: {
                  type: 'object',
                  className: 'global',
                  description: 'global',
                  objectId: '-6093838151779154534.1.16',
                },
              },
            ],
            this: {
              type: 'undefined',
            },
          },
          {
            callFrameId: '-6093838151779154534.1.1',
            functionName: 'listOnTimeout',
            functionLocation: {
              scriptId: '18',
              lineNumber: 511,
              columnNumber: 24,
            },
            location: {
              scriptId: '18',
              lineNumber: 563,
              columnNumber: 16,
            },
            url: '',
            scopeChain: [
              {
                type: 'block',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-6093838151779154534.1.17',
                },
                name: 'listOnTimeout',
                startLocation: {
                  scriptId: '18',
                  lineNumber: 560,
                  columnNumber: 10,
                },
                endLocation: {
                  scriptId: '18',
                  lineNumber: 566,
                  columnNumber: 7,
                },
              },
              {
                type: 'block',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-6093838151779154534.1.18',
                },
                name: 'listOnTimeout',
                startLocation: {
                  scriptId: '18',
                  lineNumber: 518,
                  columnNumber: 43,
                },
                endLocation: {
                  scriptId: '18',
                  lineNumber: 582,
                  columnNumber: 5,
                },
              },
              {
                type: 'local',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-6093838151779154534.1.19',
                },
                name: 'listOnTimeout',
                startLocation: {
                  scriptId: '18',
                  lineNumber: 511,
                  columnNumber: 24,
                },
                endLocation: {
                  scriptId: '18',
                  lineNumber: 597,
                  columnNumber: 3,
                },
              },
              {
                type: 'closure',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-6093838151779154534.1.20',
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
                  objectId: '-6093838151779154534.1.21',
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
                  objectId: '-6093838151779154534.1.22',
                },
              },
            ],
            this: {
              type: 'undefined',
            },
          },
          {
            callFrameId: '-6093838151779154534.1.2',
            functionName: 'processTimers',
            functionLocation: {
              scriptId: '18',
              lineNumber: 491,
              columnNumber: 24,
            },
            location: {
              scriptId: '18',
              lineNumber: 506,
              columnNumber: 6,
            },
            url: '',
            scopeChain: [
              {
                type: 'local',
                object: {
                  type: 'object',
                  className: 'Object',
                  description: 'Object',
                  objectId: '-6093838151779154534.1.23',
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
                  objectId: '-6093838151779154534.1.24',
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
                  objectId: '-6093838151779154534.1.25',
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
                  objectId: '-6093838151779154534.1.26',
                },
              },
            ],
            this: {
              type: 'object',
              className: 'process',
              description: 'process',
              objectId: '-6093838151779154534.1.27',
            },
          },
        ],
        reason: 'exception',
        data: {
          type: 'object',
          subtype: 'error',
          className: 'Error',
          description:
            'Error: oops\n    at Timeout._onTimeout (/test/index.js:5:11)\n    at listOnTimeout (node:internal/timers:564:17)\n    at process.processTimers (node:internal/timers:507:7)',
          objectId: '-6093838151779154534.1.14',
          uncaught: false,
        },
        hitBreakpoints: [],
      })
    })
    return []
  },
  async start(emitter) {
    this.emitter = emitter
  },
  async getProperties() {
    return {
      id: 4,
      result: {
        result: [],
      },
    }
  },
}

export const activate = () => {
  vscode.registerDebugProvider(debugProvider)
}
