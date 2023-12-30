import React, { useEffect, useState } from "react";

export default function () {
  const [BookTypes, ChangeBookTypes] = useState<{ id: number; name: string }[]>(
    []
  );
  useEffect(() => {
    const fetchBookTypes = async () => {
      let res = await fetch("http://localhost:5246/getBookTypes");
      ChangeBookTypes(await res.json());
    };
    fetchBookTypes();
  }, []);

  const [form, Updateform] = useState<BookData>({
    name: "",
    author: "",
    price: 1,
    type: 1,
    publisher: "",
    publishedAt: "",
    cover : undefined
  });

  function SubmitForm(e : React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    console.log(form);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("author", form.author);
    formData.append("price", form.price.toString());
    formData.append("type", form.type.toString());
    formData.append("publisher", form.publisher);
    formData.append("publishedAt", form.publishedAt);
    if(form.cover) formData.append("cover", form.cover, form.cover.name);

    fetch("http://localhost:5246/seller/addBook", {
      method: "POST",
      body: formData,
      credentials : "include"
    });
    console.log(formData);
  }

  function handleInput(event : React.ChangeEvent<HTMLInputElement>){
    Updateform({...form, [event.target.name] : event.target.value});
  }

  function handleFileUpload(event : React.ChangeEvent<HTMLInputElement>){
    if(event.currentTarget.files !== null){
      Updateform({...form, cover : event.currentTarget.files[0]})
    }
  }

  return (
    <div>
      <h2 className="mt-10 text-4xl font-bold text-center">Add New Book</h2>
      <form className="m-10 flex flex-col gap-4" onSubmit={SubmitForm}>
        <div className="form-control">
          <input
            type="text"
            placeholder="Book Name"
            className="input input-bordered"
            name="name"
            onChange={handleInput}
            required
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="Author's Name"
            className="input input-bordered"
            name="author"
            onChange={handleInput}
            required
          />
        </div>
        <div className="flex flex-row gap-4">
          <input
            type="number"
            placeholder="Price"
            className="input input-bordered basis-1/2"
            name="price"
            onChange={handleInput}
            required
          />
          <select className="select select-bordered basis-1/2" >
            {BookTypes.map((booktype) => {
              return <option value={booktype.id} key={booktype.id}>{booktype.name}</option>;
            })}
          </select>
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="Publisher"
            maxLength={100}
            className="input input-bordered"
            name="publisher"
            onChange={handleInput}
            required
          />
        </div>
        <div className="form-control">
          <input
            type="date"
            className="input input-bordered"
            name="publishedAt"
            onChange={handleInput}
            required
          />
        </div>
        <div className="form-control">
          <input
            type="file"
            className="file-input file-input-bordered "
            name="cover"
            onChange={handleFileUpload}
            required
          />
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Add Book</button>
        </div>
      </form>
    </div>
  );
}

interface BookData {
  name: string;
  author: string;
  price: number;
  type: number;
  publisher: string;
  publishedAt : string;
  cover : File | undefined;
}
