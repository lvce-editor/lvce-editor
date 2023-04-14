import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderName = {
  isEqual(oldState, newState) {
    return oldState.name === newState.name
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetName, /* name */ newState.name]
  },
}

const renderDescription = {
  isEqual(oldState, newState) {
    return oldState.description === newState.description
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetDescription, /* description */ newState.description]
  },
}

const renderReadme = {
  isEqual(oldState, newState) {
    return oldState.sanitizedReadmeHtml === newState.sanitizedReadmeHtml
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetReadmeHtml, /* sanizedHtml */ newState.sanitizedReadmeHtml]
  },
}

const renderIcon = {
  isEqual(oldState, newState) {
    return oldState.iconSrc === newState.iconSrc
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetIconSrc, /* src */ newState.iconSrc]
  },
}

const renderSize = {
  isEqual(oldState, newState) {
    return oldState.size === newState.size
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetSize, /* oldSize */ oldState.size, /* newSize */ newState.size]
  },
}

export const render = [renderName, renderReadme, renderDescription, renderIcon, renderSize]
