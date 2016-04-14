import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

//import { GriddleActions } from 'griddle-core';
import PropertyHelper from './utils/propertyHelper'

const ROOT_STATE_KEY = 'griddle'

const areVisibleColumnsSame = (original, next, columns) => {
  for(let col of columns) {
    if(next[col] !== original[col])
      return false
  }
  return true
}

const areArraysSame = (original, next, columns) => !original.some((item, index) => !areVisibleColumnsSame(item, next[index], columns))

const configureGriddleComponent = actions => ComposedComponent => {
  const { initializeGrid, loadData } = actions
  //this.state.actionCreators = bindActionCreators(actions, props.dispatch)
  class GriddleComponent extends Component {
    static defaultProps = { dataKey: 'visibleData' };

    componentWillMount() { this.loadData() }
    componentWillReceiveProps(nextProps) {
      if(nextProps.data !== this.props.data)
        this.loadData(nextProps)
    }

    loadData = () => {
      const { dispatch, data, columns, ignoredColumns, children } = this.props
      const allColumns = data && data.length > 0 ? Object.keys(data[0]) : []
      const properties = PropertyHelper.propertiesToJS( { rowProperties: children
                                                        , defaultColumns: columns
                                                        , ignoredColumns
                                                        , allColumns
                                                        } )

      dispatch(initializeGrid(properties))
      if(props.data)
        dispatch(loadData(data))
    };

    render() {
      //TODO: FIGURE OUT WHAT THIS STATE IS ALL ABOUT
      const { griddle, dispatch, dataKey } = this.props
      const actionCreators = bindActionCreators(actions, dispatch)
      return (
        <ComposedComponent
          griddle={griddle}
          {...actionCreators}
          {...this.props}
          data={griddle[dataKey]} />
      )
    }
  }

// componentState was state before (FULL REDUX STATE STRINGIFIED TO JSON)
  const mapStateToProps = state => ({ griddle: state[ROOT_STATE_KEY] })
  return connect(mapStateToProps)(GriddleComponent)
}

export default configureGriddleComponent
