export interface Book {
  id: number;
  name: string;
  author: string;
  price: number;
  type: number;
  publisher: string;
  publishedAt: Date;
  cover: string;
  buyers: string[];
}
export interface ResponseError {
  error: string;
  message: string;
}