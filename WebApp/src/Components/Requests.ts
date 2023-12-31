import { Book, ResponseError } from "../shared.types";

// Seller Request Starts here
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

export async function addBook(formData: FormData) {
  const res = await fetch("http://localhost:5246/seller/addBook", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (res.status === 200) {
    const book = await res.json();
    return { msg: "Successfully Added a Book.", book: book };
  } else {
    const err: ResponseError = await res.json();
    return new Error(`${err.error}: ${err.message}`);
  }
}

export async function editBook(formData: FormData) {
  const res = await fetch("http://localhost:5246/seller/updateBook", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (res.status === 200) {
    const book: Book = await res.json();
    return book;
  }
  const error: ResponseError = await res.json();
  return new Error(`${error.error}: ${error.message}`);
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
    }
    const error: ResponseError = await res.json();
    return new Error(`${error.error}: ${error.message}`);
  } catch (ex) {
    console.error(ex);
    return new Error("Unexpected Error while trying to send request");
  }
}
// Seller Request Ends here


// User Request Starts here
export async function listAllBooks() {
  
}