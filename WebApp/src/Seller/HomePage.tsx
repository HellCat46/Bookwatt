import { useEffect, useState } from "react";
import BookComponent from "../Components/Book";
import { Book } from "../share.types";
import AddBook from "../Components/AddBook";

export default function () {
  const [booklist, ChangeBookList] = useState<Book[]>([]);
  const FetchData = async () => {
    await fetch("http://localhost:5246/seller/listBooks", {
      credentials : "include"
    })
      .then(async (res) => {
        if(res.status == 200){
          const books : Book[] = await res.json();
          ChangeBookList(books);
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="h-screen flex flex-wrap border-4 border-base-300">
      <div className="h-min w-full p-4 text-center text-5xl font-bold border-b-4 border-base-300">
        Book Records
      </div>
      <div className="w-full border-b-4 h-max lg:w-1/2 lg:border-r-4  border-base-200 grow ">
        <AddBook></AddBook>
      </div>
      <div className="w-full border-b-4 h-max lg:w-1/2 lg:border-l-4  border-base-200 p-4  grow">
        {booklist.map((book) => {
            return (
              <BookComponent
                id={book.id}
                cover={book.cover}
                name={book.name}
                price={book.price}
                type="Balls"
              />
            );
          })}
      </div>
    </div>
  );
}
