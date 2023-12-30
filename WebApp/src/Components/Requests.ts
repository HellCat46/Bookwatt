import { Book, ResponseError } from "../share.types";

export async function getBookList() {
  try {
    const res = await fetch("http://localhost:5246/seller/listBooks", {
      credentials: "include",
    });
    if (res.status === 200) {
      const books: Book[] = await res.json();
      return books;
    } else {
      const error: ResponseError = await res.json();
      return new Error(`${error.error}: ${error.message}`);
    }
  } catch (ex) {
    console.error(ex);
    return new Error("Unexpected Error while trying to send request");
  }
}

export async function deleteBook(bookId: number) {
  try {
    const res = await fetch(
      `http://localhost:5246/seller/deleteBook?bookId=${bookId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.status === 200) {
      return "OK";
    } else {
      const error: ResponseError = await res.json();
      return new Error(`${error.error}: ${error.message}`);
    }
  } catch (ex) {
    console.error(ex);
    return new Error("Unexpected Error while trying to send request");
  }
}

export async function editBook(formData: FormData) {
  try {
    const res = await fetch("http://localhost:5246/seller/updateBook", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch (ex) {
    console.error(ex);
    return new Error("Unexpected Error while trying to send request");
  }
}
