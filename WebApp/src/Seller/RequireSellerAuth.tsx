import { useEffect, useState } from "react"
import SellerLogin from "./SellerLogin";

export default function ({child} : {child : JSX.Element}) {
    const [loggedin, ChangeLogin] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5246/seller/listBooks", {credentials : "include"});
                if(res.status == 200){
                    ChangeLogin(true);
                }
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
    })
    if(loggedin) return (child)
    else return <SellerLogin />
}
