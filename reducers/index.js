
import currentBookReducer from './currentBookReducer';
import currentChapiterRecuder from './currentChapiterRecuder';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  currentBookReducer,
  currentChapiterRecuder
})

export default rootReducer;
