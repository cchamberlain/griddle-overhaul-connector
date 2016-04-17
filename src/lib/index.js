import { GriddleRedux } from './griddle-redux'
import configureGriddleComponent from './configureGriddleComponent'
import configureReducer from './reducers'

const reducer = configureReducer()
export { configureGriddleComponent, GriddleRedux, reducer }
