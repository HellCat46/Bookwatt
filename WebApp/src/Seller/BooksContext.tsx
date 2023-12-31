import { createContext } from "react";
import { Book } from "../shared.types";

export const BooksContext = createContext<Book[] | null>(null);
export const BooksDispatchContext = createContext(null);