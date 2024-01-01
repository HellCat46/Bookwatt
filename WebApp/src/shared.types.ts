export interface Book {
  id: number;
  name: string;
  author: string;
  price: number;
  type: number;
  publisher: string;
  publishedAt: string;
  cover: string;
  buyers: Buyer[];
}

export interface Buyer {
  name : string;
  email : string
}

export interface ResponseError {
  error: string;
  message: string;
}

export enum AlertType {
  "Success" = "alert-success",
  "Info" = "alert-info",
  "Warning" = "alert-warning",
  "Error" = "alert-error",
  "None" = "",
}

export interface AlertPara {
  alertMessage: string;
  alertType: AlertType;
}

export interface BookType {
  id: number;
  name: string;
}