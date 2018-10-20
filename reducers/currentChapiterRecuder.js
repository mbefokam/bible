import {CURRENT_CHAPITER} from '../actions';
let chapiter={}

export default function currentChapiter(state={}, action){
  switch (action.type) {
    case CURRENT_CHAPITER:
      chapiter.chapiter_id = action.chapiter.chapiter_id
      chapiter.chapiter_number = action.chapiter.chapiter_number
      chapiter.book_id = action.chapiter.book_id
      chapiter.numberOfChapiters = action.chapiter.numberOfChapiters
      return chapiter
    default:
      return state

  }
}
