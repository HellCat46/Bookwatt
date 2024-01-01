import { useEffect, useState } from "react";
import { deleteBook, getBookTypes } from "../../Components/Requests";
import EditBook from "./EditBook";
import { Book, AlertPara, AlertType } from "../../shared.types";

export default function BookList({
  books,
  onUpdateBook,
  onDeleteBook,
  ShowAlert
}: {
  books: Book[];
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
  ShowAlert: (params: AlertPara) => void;
}) {
  const [BookTypes, ChangeBookTypes] = useState<{ id: number; name: string }[]>(
    []
  );
  useEffect(() => {
    const fetchBookTypes = async () => {
      ChangeBookTypes(await getBookTypes());
    };
    fetchBookTypes();
  }, []);

  return (
    <>
      {[...books].reverse().map((book) => {
        return (
          <div key={book.id}>
            <BookComponent
              book={book}
              BookTypes={BookTypes}
              onUpdateBook={onUpdateBook}
              onDeleteBook={onDeleteBook}
              ShowAlert={ShowAlert}
            />
          </div>
        );
      })}
    </>
  );
}

function BookComponent({
  book,
  BookTypes,
  onUpdateBook,
  onDeleteBook,
  ShowAlert
}: {
  book: Book;
  BookTypes: { id: number; name: string }[];
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
  ShowAlert: (params: AlertPara) => void;
}) {
  const [showEdit, setEditState] = useState(false);
  function updateEditState(state: boolean) {
    setEditState(state);
  }

  function delBook() {
    deleteBook(book.id).then((res) => {
      if (res instanceof Error) {
        console.log(res.message);
        ShowAlert({alertMessage : `${res.message}`, alertType: AlertType.Error});
      } else {
        ShowAlert({alertMessage : "Successfully Deleted Book "+book.name, alertType : AlertType.Warning})
        onDeleteBook(book);
      }
    });
  }
  return (
    <>
      <div className="card card-side bg-base-300 shadow-xl my-5" key={book.id}>
        <figure className="basis-1/4">
          <img className="" src={"http://" + book.cover} alt="Book Cover" />
        </figure>
        <div className="card-body basis-3/4 flex-row">
          <div className="basis-5/6 flex flex-col">
            <h2 className="card-title text-6xl">{book.name}</h2>
            <div className="grow"></div>
            <p className="text-2xl">Price: {book.price}</p>
            <p className="text-2xl">
              Type: {BookTypes.find((t) => t.id == book.type)?.name}
            </p>
          </div>
          <div className="flex flex-col justify-end basis-1/6">
            <div className="basis-1/2 flex items-center justify-center">
              <svg
                className="btn btn-primary"
                onClick={() => updateEditState(true)}
                width="64px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </div>
            <div className="basis-1/2 flex items-center justify-center">
              <svg
                className="btn btn-error"
                onClick={delBook}
                width="64px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M10 11V17"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M14 11V17"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M4 7H20"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {showEdit ? (
        <EditBook
          book={book}
          BookTypes={BookTypes}
          updateEditState={updateEditState}
          onUpdateBook={onUpdateBook}
          ShowAlert={ShowAlert}
        />
      ) : (
        <></>
      )}
    </>
  );
}
