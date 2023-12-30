export const successAlert = (msg: string) => {
    return (
      <div id="toast" className="toast toast-center">
        <div className="alert alert-success">
          <span>{msg}</span>
        </div>
      </div>
    );
};

export const errorAlert = (msg: string) => {
      return (
        <div id="toast" className="toast toast-center">
          <div className="alert alert-error">
            <span>{msg}</span>
          </div>
        </div>
      );
};
