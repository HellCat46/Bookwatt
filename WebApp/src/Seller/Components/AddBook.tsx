import React, { useEffect, useState } from "react";
import { Book } from "../../share.types";
import { AlertPara, AlertType, BookData } from "../seller.types";
import { addBook } from "../../Components/Requests";

export default function ({
  onAddBook,
  ShowAlert,
}: {
  onAddBook: (book: Book) => void;
  ShowAlert: (params: AlertPara) => void;
}) {
  // Stores All the Book Types
  const [BookTypes, ChangeBookTypes] = useState<{ id: number; name: string }[]>(
    []
  );
  // Fetches Book Types from DB usign API
  useEffect(() => {
    const fetchBookTypes = async () => {
      let res = await fetch("http://localhost:5246/getBookTypes");
      ChangeBookTypes(await res.json());
    };
    fetchBookTypes();
  }, []);

  // Store New Book Data
  const [Book, UpdateBook] = useState<BookData>({
    name: "",
    author: "",
    price: "",
    type: 1,
    publisher: "",
    publishedAt: "",
    cover: undefined,
  });
  // Upload all the Newe Book data to DB through API
  async function SubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Inserts Book Data into FormData Structure
    const formData = new FormData();
    formData.append("name", Book.name);
    formData.append("author", Book.author);
    formData.append("price", Book.price);
    formData.append("type", Book.type.toString());
    formData.append("publisher", Book.publisher);
    formData.append("publishedAt", Book.publishedAt);
    if (Book.cover) formData.append("cover", Book.cover, Book.cover.name);

    const res = await addBook(formData);
    if(res instanceof Error) {
      ShowAlert({alertMessage : res.message, alertType : AlertType.Error})
      return;
    }
    ShowAlert({ alertMessage: res.msg, alertType: AlertType.Success });
    onAddBook(res.book);
  }

  // Adds Cover File to Book State 
  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files !== null) {
      UpdateBook({ ...Book, cover: event.currentTarget.files[0] });
    }
  }

  return (
    <div>
      <h2 className="mt-10 text-4xl font-bold text-center">Add New Book</h2>
      <form className="m-10 flex flex-col gap-4" onSubmit={SubmitForm}>
        <div className="form-control">
          <input
            type="text"
            placeholder="Book Name"
            className="input input-bordered"
            name="name"
            onChange={(e) => UpdateBook({ ...Book, name: e.target.value })}
            required
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="Author's Name"
            className="input input-bordered"
            name="author"
            onChange={(e) => UpdateBook({ ...Book, author: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-row gap-4">
          <input
            type="number"
            placeholder="Price"
            className="input input-bordered basis-1/2"
            name="price"
            onChange={(e) => UpdateBook({ ...Book, price: e.target.value })}
            required
          />
          <select
            className="select select-bordered basis-1/2"
            onChange={(e) =>
              UpdateBook({ ...Book, type: parseInt(e.target.value) })
            }
          >
            {BookTypes.map((booktype) => {
              return (
                <option value={booktype.id} key={booktype.id}>
                  {booktype.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="Publisher"
            maxLength={100}
            className="input input-bordered"
            name="publisher"
            onChange={(e) => UpdateBook({ ...Book, publisher: e.target.value })}
            required
          />
        </div>
        <div className="form-control">
          <input
            type="date"
            className="input input-bordered"
            name="publishedAt"
            onChange={(e) =>
              UpdateBook({ ...Book, publishedAt: e.target.value })
            }
            required
          />
        </div>
        <div className="form-control">
          <input
            type="file"
            className="file-input file-input-bordered "
            name="cover"
            onChange={handleFileUpload}
            accept="image/*"
            required
          />
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Add Book</button>
        </div>
      </form>
    </div>
  );
}
