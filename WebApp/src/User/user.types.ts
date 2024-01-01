import { Book } from "../shared.types";

export interface BookAction extends Book {
  action: "Added" | "Deleted";
}