import { Outlet, useNavigate } from "react-router-dom";
import AdminFooter from "./AdminFooter";
import AdminHeader from "./AdminHeader";
import { HashLoader } from "react-spinners";
import { styleObj } from "../Firebase";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function AdminMaster(){
    const nav=useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    const[load,setLoad]=useState(true);

    if (!user) {
        toast.error("Admin is not authenticated", {
            position: "top-center"
        });
        nav("/adminlogin")
        return;
    }
    setTimeout(() => {
        setLoad(false);
    }, 2000);
    return(
        <>
         <HashLoader loading={load} cssOverride={styleObj} size={70} color={"aqua"}/>
         <div className={load?"d-none":""}>
        <AdminHeader/>
        <Outlet/>
        <AdminFooter/>
        </div>
        <ToastContainer/>
        </>
    )
}