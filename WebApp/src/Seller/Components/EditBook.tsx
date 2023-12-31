import { useState } from "react";
import { BookData } from "../seller.types";
import { Book, AlertPara, AlertType } from "../../shared.types";
import { editBook } from "../../Components/Requests";

export default function EditBook({
  book,
  BookTypes,
  updateEditState,
  onUpdateBook,
  ShowAlert,
}: {
  book: Book;
  BookTypes: { id: number; name: string }[];
  updateEditState: (state: boolean) => void;
  onUpdateBook: (book: Book) => void;
  ShowAlert: (params: AlertPara) => void;
}) {
  const [form, Updateform] = useState<BookData>({
    name: book.name,
    author: book.author,
    price: book.price.toString(),
    type: book.type,
    publisher: book.publisher,
    publishedAt: book.publishedAt,
    cover: undefined,
  });
  async function UpdateBook() {
    const formData = new FormData();
    formData.append("bookId", book.id.toString());
    formData.append("name", form.name);
    formData.append("author", form.author);
    formData.append("price", form.price.toString());
    formData.append("type", form.type.toString());
    formData.append("publisher", form.publisher);
    formData.append("publishedAt", form.publishedAt);
    if (form.cover) formData.append("cover", form.cover, form.cover.name);

    const res = await editBook(formData);
    if (res instanceof Error) {
      updateEditState(false);
      ShowAlert({ alertMessage: res.message, alertType: AlertType.Error });
      return;
    }

    ShowAlert({
      alertMessage: "Successfully Updated the Book",
      alertType: AlertType.Success,
    });
    onUpdateBook(res);
    updateEditState(false);
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files !== null) {
      Updateform({ ...form, cover: event.currentTarget.files[0] });
    }
  }

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box card">
        <h2 className=" text-4xl font-bold text-center">Edit Book</h2>
        <div className="card-body">
          <div className="form-control">
            <input
              type="text"
              placeholder="Book Name"
              className="input input-bordered"
              maxLength={100}
              onChange={(e) => Updateform({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-control">
            <input
              type="text"
              placeholder="Author's Name"
              className="input input-bordered"
              maxLength={100}
              onChange={(e) => Updateform({ ...form, author: e.target.value })}
            />
          </div>
          <div className="flex flex-row gap-2">
            <input
              type="number"
              placeholder="Price"
              className="input input-bordered w-1/2"
              min={1}
              max={9999}
              onChange={(e) => Updateform({ ...form, price: e.target.value })}
            />
            <select
              className="select select-bordered w-1/2"
              defaultValue={book.type}
              onChange={(e) =>
                Updateform({ ...form, type: parseInt(e.target.value) })
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
              onChange={(e) =>
                Updateform({ ...form, publisher: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <input
              type="date"
              className="input input-bordered"
              name="publishedAt"
              onChange={(e) =>
                Updateform({ ...form, publishedAt: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <input
              type="file"
              className="file-input file-input-bordered "
              name="cover"
              onChange={handleFileUpload}
              accept="image/*"
            />
          </div>
        </div>

        <div className="flex">
          <button className="btn btn-primary" onClick={UpdateBook}>
            Save Changes
          </button>
          <div className="grow"></div>
          <form method="dialog">
            <button className="btn" onClick={() => updateEditState(false)}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
