import { useEffect, useReducer, useState } from "react"
import { getAllBooks, getBookTypes, getBroughtBooks } from "../Components/Requests"
import { AlertPara, AlertType, Book, BookType } from "../shared.types";
import { BookAction } from "./user.types";
import Books from "./Components/Books";

export default function ({ShowAlert} : { 
  ShowAlert: (params: AlertPara) => void;}){
    const [books, dispatch] = useReducer(booksReducer, []);
    const [broughtbooks, dispatchbrought] = useReducer(booksReducer, []);

    const [booktypes, UpdateBookTypes] = useState<BookType[]>([]);

    useEffect(() => {
      const fetchbooks = async () => {
        const books = await getAllBooks();
        if (books instanceof Error) {
          ShowAlert({
            alertMessage: books.message,
            alertType: AlertType.Error,
          });
          return;
        }
        books.forEach(book => {
            dispatch({action: "Added", ...book});
        })

        const broughtbooks = await getBroughtBooks();
        if (broughtbooks instanceof Error) {
          ShowAlert({
            alertMessage: broughtbooks.message,
            alertType: AlertType.Error,
          });
          return;
        }
        broughtbooks.forEach(book => {
            dispatchbrought({action: "Added", ...book});
        })

        const booktypes = await getBookTypes();
        UpdateBookTypes(booktypes)
      };

      fetchbooks();
    }, []);

    // Functions to handle Book Actions
    function handleBuyBook(book: Book) {
      dispatchbrought({ action: "Added", ...book });
    }
    function handleReturnBook(book: Book) {
      dispatchbrought({ action: "Deleted", ...book });
    }

    return (
      <div className="h-screen w-screen grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-3 bg-base-200">
        <div className="m-4 bg-base-100 rounded-2xl  flex flex-col">
          <div className="text-5xl py-2 text-center font-bold bg-base-300 rounded-t-2xl">
            Your Books
          </div>
          <div className="m-4 grow overflow-y-auto">
            <Books
              books={broughtbooks}
              isBrought={true}
              booktypes={booktypes}
              ShowAlert={ShowAlert}
              handleBuyBook={handleBuyBook}
              handleReturnBook={handleReturnBook}
            />
          </div>
        </div>
        <div className=" m-4 bg-base-100 rounded-lg flex flex-col">
          <div className=" text-5xl py-2 text-center font-bold bg-base-300 rounded-t-lg">
            Available Books
          </div>
          <div className="m-4 grow overflow-y-auto">
            <Books
              books={books}
              isBrought={false}
              booktypes={booktypes}
              ShowAlert={ShowAlert}
              handleBuyBook={handleBuyBook}
              handleReturnBook={handleReturnBook}
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
    case "Deleted": {
      return books.filter((b) => b.id !== book.id);
    }
  }
}
