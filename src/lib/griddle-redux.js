import React, { Component, PropTypes } from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const ROOT_STATE_KEY = 'griddle'


import  { Reducers
        , States
        , GriddleReducer
        , GriddleActions
        , GriddleHelpers as Helpers
        } from 'griddle-overhaul-core'

import compose from 'lodash.compose'

export function composer(functions) {
  return compose.apply(this, functions.reverse())
}

export const combineComponents = ({ plugins = null, components = null }) => {
  if(!plugins || !components) { return }

  const composedComponents = {}
  //for every plugin in griddleComponents compose the the matching plugins with the griddle component at the end
  //TODO: This is going to be really slow -- we need to clean this up
  for(var key in components) {
    if(plugins.some(p => p.components.hasOwnProperty(key))) {
      composedComponents[key] = composer(
        plugins
          .filter(p => p.components.hasOwnProperty(key))
          .map(p => p.components[key])
      )(components[key])
    }
  }
  return composedComponents
}



//Should return GriddleReducer and the new components
export const processPlugins = (plugins, originalComponents) => {
  if(!plugins) {
    return  { actions: GriddleActions
            , reducer : GriddleReducer( [States.data, States.local]
                                      , [Reducers.data, Reducers.local]
                                      , [Helpers.data, Helpers.local]
                                      )
            }
  }

  const combinedPlugin = combinePlugins(plugins)
  const reducer = GriddleReducer( [States.data, States.local, ...combinedPlugin.states]
                                , [Reducers.data, Reducers.local, ...combinedPlugin.reducers]
                                , [Helpers.data, Helpers.local, ...combinedPlugin.helpers]
                                )

  const components = combineComponents({ plugins, components: originalComponents })

  return components ? { actions: combinedPlugin.actions, reducer, components }
                    : { actions: combinedPlugin.actions, reducer }
}

export const combinePlugins = plugins => {
  return plugins.reduce((previous, current) => {
    const { actions, reducers, states, helpers, components } = current
    return  { actions: Object.assign({}, previous.actions, actions)
            , reducers: reducers ? [...previous.reducers, reducers] : previous.reducers
            , states: states ? [...previous.states, states] : previous.states
            , helpers: helpers ? [...previous.helpers, helpers] : previous.helpers
            , components: components ? [...previous.components, components] : previous.components
            }
  }, { actions: GriddleActions, reducers: [], states: [], helpers: [], components: []})
}




/*
export const bindStoreToActions = (actions, actionsToBind, store) => {
  return Object.keys(actions).reduce((actions, actionKey) => {
    if (actionsToBind.indexOf(actions[actionKey]) > -1) {
      // Bind the store to the action if it's in the array.
      actions[actionKey] = actions[actionKey].bind(null, store)
    }
    return actions
  }, actions)
}
*/

/** REDUX THUNK AUTOMATICALLY INJECTS DISPATCH / GETSTATE INTO ACTIONS, UNSURE WHAT THIS IS FOR
// ONLY DOES SOMETHING IF THERE EXISTS A PLUGIN WITH 'storeBoundActions' PROPERTY
export const processPluginActions = (actions, plugins, store) => {
  if (!plugins)
    return actions

  // Bind store to necessary actions.
  return plugins.reduce((previous, current) => {
    const processActions = current.storeBoundActions && current.storeBoundActions.length > 0
    return processActions ? bindStoreToActions(previous, current.storeBoundActions, store) : actions
  }, actions)
}
*/
