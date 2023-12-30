export interface Book {
  id: number;
  name: string;
  author: string;
  price: number;
  type: number;
  publisher: string;
  publishedAt: string;
  cover: string;
  buyers: string[];
}
export interface ResponseError {
  error: string;
  message: string;
}

export interface BookAction extends Book {
  action : "Added" | "Updated" | "Deleted"  
}