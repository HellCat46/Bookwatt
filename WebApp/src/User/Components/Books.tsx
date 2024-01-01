import { buyBook } from "../../Components/Requests";
import { AlertPara, AlertType, Book, BookType } from "../../shared.types";

export default function Books({
  books,
  isBrought,
  booktypes,
  ShowAlert,
  handleBuyBook,
  handleReturnBook
}: {
  books: Book[];
  isBrought: boolean;
  booktypes: BookType[];
  ShowAlert: (params: AlertPara) => void;
  handleBuyBook: (book: Book) => void;
  handleReturnBook: (book: Book) => void;
}) {
  return (
    <div>
      {[...books].reverse().map((book) => {
        return (
          <BookComponent
            book={book}
            isBrought={isBrought}
            booktypes={booktypes}
            ShowAlert={ShowAlert}
            handleBuyBook={handleBuyBook}
            handleReturnBook={handleReturnBook}
          />
        );
      })}
    </div>
  );
}


function BookComponent({
  book,
  isBrought,
  booktypes,
  ShowAlert,
  handleBuyBook,
  handleReturnBook
}: {
  book: Book;
  isBrought: boolean;
  booktypes: BookType[];
  ShowAlert: (params: AlertPara) => void;
  handleBuyBook: (book: Book) => void;
  handleReturnBook: (book: Book) => void;
}) {
  async function onBuyClick() {
    const res = await buyBook(book.id);
    if (res instanceof Error) {
      ShowAlert({ alertMessage: res.message, alertType: AlertType.Error });
      return;
    }

    ShowAlert({
      alertMessage: `Successfully Purchased the Book "${book.name}"`,
      alertType: AlertType.Success,
    });
    handleBuyBook(book);
  }
  async function onReturnClick() {}

  return (
    <div className="card card-side bg-base-300 shadow-xl my-2">
      <figure>
        <img src={"http://" + book.cover} className="w-48" alt="Book Cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{book.name}</h2>
        <div className="flex flex-col">
          <div>
            <span className="font-bold">Author: </span>
            {book.author}
          </div>
          <div>
            <span className="font-bold">Type: </span>
            {booktypes.find((t) => t.id == book.type)?.name}
          </div>
          <div className="grow"></div>
          <div>
            <span className="font-bold">Publisher: </span>
            {book.publisher}
          </div>
        </div>
        <div className="grow"></div>
        <div className="card-actions justify-end">
          {isBrought ? (
            <button className="btn btn-error" onClick={onReturnClick}>
              Return
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onBuyClick}>
              Buy for ₹{book.price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}