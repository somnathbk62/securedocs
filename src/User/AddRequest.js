import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useState } from "react";
import { auth, db, storage, styleObj } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { HashLoader, RingLoader } from "react-spinners";
export default function AddRequest() {
  const [message, setMessage] = useState("");
  const [load, setLoad] = useState(true);
  const nav = useNavigate();

  setTimeout(() => {
    setLoad(false);
  }, 2000);

  const addRequests = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (message === "") {
      toast.error("Please enter a message first", {
        position: "top-center",
      });
      setLoad(false);
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("Student is not authenticated", {
          position: "top-center",
        });
        setTimeout(() => {
          setLoad(false);
        }, 2000);
        return;
      }

      const requestRef = collection(db, "requests");

      const newRequest = {
        message,
        studentId: user.uid,
        status: "Pending",
        created_at: Timestamp.now(),
      };

      await addDoc(requestRef, newRequest);
      toast.success("Request Sent successfully", {
        position: "top-center",
      });

      setTimeout(() => {
        setLoad(false);
        nav("/myrequests");
      }, 2000);
    } catch (error) {
      toast.error("Something Went Wrong", {
        position: "top-center",
      });
      setTimeout(() => {
        setLoad(false);
      }, 2000);
      console.log(error);
    }
  };

  return (
    <>
      <>
        <HashLoader
          loading={load}
          cssOverride={styleObj}
          size={70}
          color={"aqua"}
        />
        <div className={load ? "d-none" : ""}>
          {/* Header Start */}
          <div className="container-fluid bg-primary py-5 mb-5 page-header">
            <div className="container py-5">
              <div className="row justify-content-center">
                <div className="col-lg-10 text-center">
                  <h1 className="display-3 text-white animated slideInDown">
                    Request
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center">
                      <li className="breadcrumb-item">
                        <a className="text-white" href="#">
                          Home
                        </a>
                      </li>

                      <li
                        className="breadcrumb-item text-white active"
                        aria-current="page"
                      >
                        Add Request
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          {/* Header End */}
          {/* Contact Start */}
          <div className="container-xxl py-5">
            <div className="container">
              <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h1 className="mb-5">Add Request</h1>
              </div>
              <div className="row g-4">
                <div
                  className="col-lg-6 offset-md-3 col-md-12 wow fadeInUp"
                  data-wow-delay="0.5s"
                >
                  <form onSubmit={addRequests}>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            placeholder="Leave a message here"
                            id="message"
                            style={{ height: 150 }}
                            value={message}
                            onChange={(e) => {
                              setMessage(e.target.value);
                            }}
                            required
                          />
                          <label htmlFor="message">Enter Message</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button
                          className="btn btn-primary w-100 py-3"
                          type="submit"
                        >
                          Send Request
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Contact End */}
        <ToastContainer />
      </>
    </>
  );
}
