import { createContext } from "react";
import { Book } from "../share.types";

export const BooksContext = createContext<Book[] | null>(null);
export const BooksDispatchContext = createContext(null);