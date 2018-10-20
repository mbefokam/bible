import {CURRENT_BOOK} from '../actions';
let book={}

export default function currentChapiter(state={}, action){ 
  switch (action.type) {
    case CURRENT_BOOK:
        book.currentBookName = action.book.book_name
        book.currentBookId = action.book.book_id
        book.currentBookNumber = action.book.book_number
      return book;
    default:
      return state

  }
}
