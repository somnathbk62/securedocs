import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header(){
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const nav = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      nav('/'); // redirect to the home page after logout
      setUser(null); // clear the user state after logout
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
        {user ? (
          <>
          <div className="nav-item dropdown">
          <Link
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Student Section
          </Link>
          <div className="dropdown-menu fade-down m-0">
            <Link to={"/myprofile"} className="dropdown-item">
              My Profile
            </Link>
            <Link to={"/idcard"} className="dropdown-item">
              My IdCards
            </Link>
            <Link to={"/mycertificates"} className="dropdown-item">
              My Certificates
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
            <Link to={"/addrequest"} className="dropdown-item">
             Add Request
            </Link>
            <Link to={"/myrequests"} className="dropdown-item">
              Manage Request
            </Link>
          </div>
        </div>
          </>
        ):(
          <>

          </>
        )}
        
      </div>
      {user ? (
        <>
        <Link onClick={handleLogout} className="btn btn-primary py-4 px-lg-5 d-none d-lg-block">
        Logout
        <i className="fa fa-arrow-right ms-3" />
      </Link>
        </>
      ):(
        <>
        <Link to={"/"} className="btn btn-primary py-4 px-lg-5 d-none d-lg-block">
        Student Login
        <i className="fa fa-arrow-right ms-3" />
      </Link>
      <Link to={"/adminlogin"} className="btn btn-primary py-4 px-lg-5 d-none d-lg-block ms-4">
        Admin Login
        <i className="fa fa-arrow-right ms-3" />
      </Link>
        </>
      )}
      
    </div>
  </nav>
  {/* Navbar End */}
</>

        
        </>
    )
}