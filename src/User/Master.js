import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { HashLoader } from "react-spinners";
import { styleObj } from "../Firebase";
import { useState } from "react";

export default function Master() {
  const [load, setLoad] = useState(true);
  setTimeout(() => {
    setLoad(false);
  }, 2000);
  return (
    <>
      <HashLoader
        loading={load}
        cssOverride={styleObj}
        size={70}
        color={"aqua"}
      />
      <div className={load ? "d-none" : ""}>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}
