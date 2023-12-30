interface Props {
    id : number
    cover : string,
    name : string,
    price : number,
    type : string
}

export default function BookComponent(props : Props){
    return (
      <div className="card card-side bg-base-300 shadow-xl my-4" key={props.id}>
        <figure>
          <img
           className="w-48"
            src={"http://"+props.cover}
            alt="Book Cover"
          />
        </figure>
        <div className="card-body flex-row">
          <div className="basis-3/4 flex flex-col">
            <h2 className="card-title text-6xl">{props.name}!</h2>
            <div className="grow"></div>
            <p className="text-2xl">Price: {props.price}</p>
            <p className="text-2xl">Type: {props.type}</p>
          </div>
          <div className="card-actions flex-row justify-end basis-1/4">
            <div className="basis-1/2">
              <button className="btn btn-primary">
                <img src="./buttons/edit-button.svg" alt="Edit" />
              </button>
            </div>
            <div className="basis-1/2">
              <button className="btn btn-primary">
                <img src="./buttons/delete-button.svg" alt="Delete" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}