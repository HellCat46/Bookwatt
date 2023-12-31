import { Book } from "../shared.types";

export interface BookData {
  name: string;
  author: string;
  price: string;
  type: number;
  publisher: string;
  publishedAt: string;
  cover: File | undefined;
}

export interface BookAction extends Book {
  action: "Added" | "Updated" | "Deleted";
}