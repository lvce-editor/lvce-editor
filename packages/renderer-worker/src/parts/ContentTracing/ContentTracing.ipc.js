import * as Tracing from './ContentTracing.js'

export const name = 'ContentTracing'

export const Commands = {
  start: Tracing.start,
  stop: Tracing.stop,
}
