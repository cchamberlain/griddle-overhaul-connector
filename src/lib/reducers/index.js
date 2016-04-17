import configureData from './data'
import configureLocal from './local'

export default function configureReducer( { addKeyToRows = (...args) => console.warn('NOOP:addKeyToRows', ...args)
                                          , getPageCount = (...args) => console.warn('NOOP:getPageCount', ...args)
                                          , sortDataByColumns = (...args) => console.warn('NOOP:sortDataByColumns', ...args)
                                          } = {}) {
  return  { data: configureData({ addKeyToRows })
          , local: configureLocal({ addKeyToRows, getPageCount, sortDataByColumns })
          }
}
