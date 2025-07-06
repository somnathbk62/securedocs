import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHeader(){
  const auth = getAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      nav('/'); // redirect to the home page after logout
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };
    return(
        <>
        <>
  {/* Navbar Start */}
  <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
    <a
      href="index.html"
      className="navbar-brand d-flex align-items-center px-4 px-lg-5"
    >
      <h2 className="m-0 text-primary">
        <i className="fa fa-book me-3" />
        Secured Docs
      </h2>
    </a>
    <button
      type="button"
      className="navbar-toggler me-4"
      data-bs-toggle="collapse"
      data-bs-target="#navbarCollapse"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarCollapse">
      <div className="navbar-nav ms-auto p-4 p-lg-0">
        <Link to={"/admin"} className="nav-item nav-link active">
          Dashboard
        </Link>
       
        <div className="nav-item dropdown">
          <Link
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Students
          </Link>
          <div className="dropdown-menu fade-down m-0">
            <Link to={"/admin/addstudents"} className="dropdown-item">
              Add Students
            </Link>
            <Link to={"/admin/managestudents"} className="dropdown-item">
              Manage Students
            </Link>
            
          </div>
        </div>
       
        <div className="nav-item dropdown">
          <Link
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Requests
          </Link>
          <div className="dropdown-menu fade-down m-0">
            <Link to={"/admin/pendingrequests"} className="dropdown-item">
              Pending Requests
            </Link>
            <Link to={"/admin/approvedrequests"} className="dropdown-item">
             Approved Requests
            </Link>
            <Link to={"/admin/rejectedrequests"} className="dropdown-item">
             Rejected Requests
            </Link>
            <Link to={"/admin/completedrequests"} className="dropdown-item">
             Completed Requests
            </Link>
          </div>
        </div>
       
      </div>
   
        
      <Link onClick={handleLogout}  className="btn btn-primary py-4 px-lg-5 d-none d-lg-block ms-4">
        Logout
        <i className="fa fa-arrow-right ms-3" />
      </Link>
    </div>
  </nav>
  {/* Navbar End */}
</>

        
        </>
    )
}