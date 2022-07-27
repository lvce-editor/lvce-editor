export const state = {
  listenerMap: Object.create(null),
  phase: 0,
}

export const Phase = {
  Zero: 0,
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Eleven: 11,
  Twelve: 12,
  Thirteen: 13,
  Fourteen: 14,
  Fifteen: 15,
  Sixteen: 16,
  SevenTeen: 17,
}

export const once = (event, listener) => {
  if (state.phase >= event) {
    listener()
  } else {
    // TODO could also statically allocate listenermap at start as array[13]
    state.listenerMap[event] ||= []
    state.listenerMap[event].push(listener)
  }
}

export const mark = (event) => {
  const listeners = state.listenerMap[event] || []
  for (const listener of listeners) {
    listener()
  }
  state.phase = event
  if (event === Phase.Twelve) {
    state.listenerMap = Object.create(null)
  }
}
