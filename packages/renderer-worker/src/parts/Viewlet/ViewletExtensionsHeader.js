import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js' // TODO use Command.execute instead
import * as ExtensionsMarketplace from '../ExtensionMarketplace/ExtensionMarketplace.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Platform from '../Platform/Platform.js'
import * as Assert from '../Assert/Assert.js'

const SUGGESTIONS = [
  '@builtin',
  '@disabled',
  '@enabled',
  '@installed',
  '@outdated',
  '@sort:installs',
  '@id:',
  '@category',
]

export const name = 'Extensions'

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const create = (id, uri, left, top, width, height) => {
  return {
    searchValue: '',
    parsedValue: {
      isLocal: true, // TODO flatten this
      query: '',
    },
    suggestionState: /* Closed */ 0,
    disposed: false,
  }
}

export const loadContent = async (state) => {
  return state
}

export const handleInput = async (state, value) => {
  // TODO call props.handleInput
}

export const openSuggest = async (state) => {
  const filteredSuggestions = SUGGESTIONS
  state.suggestionState = /* Open */ 1
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ 'Extensions',
    /* method */ 'openSuggest',
    /* suggestions */ filteredSuggestions
  )
}

export const closeSuggest = async (state) => {
  state.suggestionState = /* Closed */ 0
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ 'Extensions',
    /* method */ 'closeSuggest'
  )
}

export const toggleSuggest = async (state) => {
  switch (state.suggestionState) {
    case /* Closed */ 0:
      await openSuggest(state)
      break
    case /* Open */ 1:
      await closeSuggest(state)
      break
    default:
      break
  }
}

export const resize = (state, dimensions) => {
  // TODO should just return new state, render function can take old state and new state and return render commands
  const listHeight = dimensions.height
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands: [],
  }
}

export const hasFunctionalRender = true

const h = (...args) => {}

export const render = (oldState, newState) => {
  return h('div', { className: 'ExtensionsHeader' }, [
    h('input', {
      className: 'ExtensionsInput',
      role: 'search',
      onInput: this.props.onInput,
    }),
  ])
}
