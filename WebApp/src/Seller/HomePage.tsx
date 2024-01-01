import { useEffect, useReducer, useState } from "react";
import BookList from "./Components/Books";
import AddBook from "./Components/AddBook";
import { getBookList, getBookTypes } from "../Components/Requests";
import { BookAction } from "./seller.types";
import { AlertPara, Book, BookType } from "../shared.types";

export default function ({
  ShowAlert,
  Logout
}: {
  ShowAlert: (params: AlertPara) => void;
  Logout : () => Promise<void>;
}) {
  const [BookTypes, UpdateBookTypes] = useState<BookType[]>([]);
  
  // Store Books and keep trace of it
  const [books, dispatch] = useReducer(booksReducer, []);
  useEffect(() => {
    // Fetches Existing Books from API
    let Fetched = false;

    const FetchBooks = async () => {
      const res = await getBookList();
      if (res instanceof Error) return;

      if (Fetched) return; // https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
      res.forEach((book) => {
        dispatch({ action: "Added", ...book });
      });
      UpdateBookTypes(await getBookTypes());
    };

    FetchBooks();
    return () => {
      Fetched = true;
    };
  }, []);

  // Functions to handle Book Actions
  function handleAddBook(book: Book) {
    dispatch({ action: "Added", ...book });
  }
  function handleUpdateBook(book: Book) {
    dispatch({ action: "Updated", ...book });
  }
  function handleDeleteBook(book: Book) {
    dispatch({ action: "Deleted", ...book });
  }

  return (
    <div className="h-screen w-screen grid grid-cols-2 gap-2 bg-base-300">
      <div
        className="h-min col-span-2 p-4 text-center text-5xl font-bold bg-base-200 "
        onDoubleClick={Logout}
      >
        Book Records
      </div>
      <div className="col-span-2 h-[90vh] lg:col-span-1 bg-base-100">
        <AddBook
          onAddBook={handleAddBook}
          ShowAlert={ShowAlert}
          BookTypes={BookTypes}
        />
      </div>
      <div className="lg:overflow-y-auto col-span-2 lg:col-span-1 bg-base-100">
        <div className="px-5 h-full ">
          <BookList
            books={books}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            ShowAlert={ShowAlert}
            BookTypes={BookTypes}
          />
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
        if (b.id === book.id) {
          return book;
        } else {
          return b;
        }
      });
    }
    case "Deleted": {
      return books.filter((b) => b.id !== book.id);
    }
  }
}
