export enum AlertType {
    "Success" = "alert-success",
    "Info" = "alert-info",
    "Warning" = "alert-warning",
    "Error" = "alert-error",
    "None" = ""
};


export interface AlertPara {
    alertMessage : string,
    alertType : AlertType
}