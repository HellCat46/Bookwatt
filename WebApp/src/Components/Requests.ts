import { Book, BookType, ResponseError } from "../shared.types";

export async function getBookTypes() {
  const res = await fetch("http://localhost:5246/getBookTypes");

  const types: BookType[] = await res.json();
  return types;
}

// Seller Request Starts here
export async function SellerLogin(creds: { email: string; password: string }) {
  const res = await fetch("http://localhost:5246/seller/login", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email: creds.email, password: creds.password }),
    credentials: "include",
  });

  if (res.status == 200) {
    return "Ok";
  }

  const err: ResponseError = await res.json();
  return new Error(`${err.error}: ${err.message}`);
}

export async function SellerRegister(creds: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch("http://localhost:5246/seller/register", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      name: creds.name,
      email: creds.email,
      password: creds.password,
    }),
    credentials: "include",
  });
  if (res.status == 200) {
    return "OK";
  }

  const err: ResponseError = await res.json();
  return new Error(`${err.error}: ${err.message}`);
}

export async function SellerLogout() {
  const res = await fetch("http://localhost:5246/seller/logout", {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 200) {
    return "Ok";
  }
  const err: ResponseError = await res.json();
  return err;
}

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
export async function UserLogin(creds: { email: string; password: string }) {
  const res = await fetch("http://localhost:5246/user/login", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email: creds.email, password: creds.password }),
    credentials: "include",
  });

  if (res.status == 200) {
    return "Ok";
  }

  const err: ResponseError = await res.json();
  return new Error(`${err.error}: ${err.message}`);
}

export async function UserRegister(creds: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch("http://localhost:5246/user/register", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      name: creds.name,
      email: creds.email,
      password: creds.password,
    }),
    credentials: "include",
  });
  if (res.status == 200) {
    return "Ok";
  }
  const err: ResponseError = await res.json();
  return new Error(`${err.error}: ${err.message}`);
}

export async function UserLogout() {
  const res = await fetch("http://localhost:5246/user/logout", {
    method: "DELETE",
    credentials: "include",
  });
  if (res.status === 200) return "OK";

  const err: ResponseError = await res.json();
  return new Error(`${err.error}: ${err.message}`);
}

export async function listAllBooks() {
  const res = await fetch("http://localhost:5246/user/listBooks", {
    credentials: "include",
  });
  if (res.status === 200) {
    const books: Book[] = await res.json();
    console.log(books);
    return books;
  }

  const err: ResponseError = await res.json();
  return new Error(`${err.error}: ${err.message}`);
}

export async function listBroughtBooks() {
  const res = await fetch("http://localhost:5246/user/listPurchasedBooks", {
    credentials: "include",
  });

  if (res.status === 200) {
    const books: Book[] = await res.json();
    return books;
  }

  const err: ResponseError = await res.json();
  return new Error(`${err.error}: ${err.message}`);
}

export async function buyBook(bookId : number) {
  const res = await fetch(`http://localhost:5246/user/buyBook?bookId=${bookId}`, {
    method : "POST",
    credentials : "include"
  });
  if(res.status === 200){
    return "Ok"
  }
  const err: ResponseError = await res.json();
  return new Error(`${err.error}: ${err.message}`);
  
}

// User Request Ends here
