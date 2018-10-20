export const CURRENT_BOOK = "CURRENT_BOOK";

export const CURRENT_CHAPITER = "CURRENT_CHAPITER";



export function currentBook(book){ 
    const action ={
      type: CURRENT_BOOK,
      book
    }
    return action;
}

export function currentChapiter(chapiter){
    const action ={
      type: CURRENT_CHAPITER,
      chapiter
    }
    return action;
}
