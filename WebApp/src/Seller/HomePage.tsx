import { useEffect, useReducer } from "react";
import BookList from "../Components/Books";
import AddBook from "../Components/AddBook";
import { Book, BookAction } from "../share.types";
import { getBookList } from "../Components/Requests";

export default function () {
  const [books, dispatch] = useReducer(booksReducer,[]);


  useEffect(() => {
    let Fetched = false;
    const FetchBooks = async () => {
      const res = await getBookList();
      if(res instanceof Error) return 


      if (Fetched) return;
      res.forEach(book => {
        dispatch({action : "Added", ...book});
      });
    };

    FetchBooks();

    return () => {Fetched = true}
  }, [])


  function handleAddBook(book : Book){
    dispatch({action : "Added", ...book})
  }
  function handleUpdateBook(book : Book){
    dispatch({action: "Updated", ...book})
  }
  function handleDeleteBook(book : Book){
    dispatch({action: "Deleted", ...book})
  }

  return (
    <div className="h-screen w-screen grid grid-cols-2 gap-2 bg-base-300">
      <div className="h-min col-span-2 p-4 text-center text-5xl font-bold bg-base-200 ">
        Book Records
      </div>
      <div className="col-span-2 h-full lg:col-span-1 bg-base-100">
        <AddBook onAddBook={handleAddBook} />
      </div>
      <div className="lg:overflow-x-auto col-span-2 lg:col-span-1 bg-base-100">
        <div className="px-5 h-full ">
          <BookList books={books} onUpdateBook={handleUpdateBook} onDeleteBook={handleDeleteBook} />
        </div>
      </div>
    </div>
  );
}




function booksReducer(books: Book[], book: BookAction) {
  switch (book.action) {
    case "Added": {
      return [
        ...books,
        {
          id: book.id,
          name: book.name,
          author: book.author,
          price: book.price,
          type: book.type,
          publisher: book.publisher,
          publishedAt: book.publishedAt,
          cover: book.cover,
          buyers: book.buyers,
        },
      ];
    }
    case "Updated": {
      return books.map((b) => {
        if(b.id === book.id){
          return book
        }else {
          return b
        }
      });
    }
    case "Deleted" : {
      return books.filter(b => b.id !== book.id)
    }
  }
}
