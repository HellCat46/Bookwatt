import { Book, ResponseError } from "../share.types";
import { errorAlert, successAlert } from "./Toasts";
import { deleteBook } from "./Requests";



export default function BookList({
  books,
  onUpdateBook,
  onDeleteBook,
}: {
  books : Book[]
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
}) {
  return (
    <>
      {books.length}
      {books.map((book) => {
        return (
          <BookComponent
            book={book}
            onUpdateBook={onUpdateBook}
            onDeleteBook={onDeleteBook}
          />
        );
      })}
    </>
  );
}

function BookComponent({
  book,
  onUpdateBook,
  onDeleteBook,
}: {
  book: Book;
  onUpdateBook: (book: Book) => void,
  onDeleteBook: (book: Book) => void,
}) {
  function delBook() {
    deleteBook(book.id).then((res) => {
      if (res instanceof Error) {
        errorAlert(res.message);
      } else {
        successAlert(res);
        onDeleteBook(book);
      }
    });
  }
  return (
    <div className="card card-side bg-base-300 shadow-xl my-5" key={book.id}>
      <figure className="basis-1/4">
        <img className="" src={"http://" + book.cover} alt="Book Cover" />
      </figure>
      <div className="card-body basis-3/4 flex-row">
        <div className="basis-3/4 flex flex-col">
          <h2 className="card-title text-6xl">{book.name}!</h2>
          <div className="grow"></div>
          <p className="text-2xl">Price: {book.price}</p>
          <p className="text-2xl">Type: {book.type}</p>
        </div>
        <div className="card-actions flex-row justify-end basis-1/4">
          <div className="basis-1/2">
            <img
              className="btn btn-primary"
              src="./buttons/edit-button.svg"
              alt="Edit"
            />
          </div>
          <div className="basis-1/2">
            <img
              className="btn btn-primary"
              src="./buttons/delete-button.svg"
              alt="Delete"
              onClick={delBook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}