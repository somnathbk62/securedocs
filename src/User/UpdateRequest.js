import { addDoc, collection, Timestamp, query, where, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, storage, styleObj,  } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { HashLoader, RingLoader } from "react-spinners";
export default function UpdateRequest(){
    const[message,setMessage]=useState("");
    const[load,setLoad]=useState(true);
    const nav = useNavigate();
    const { id } = useParams();  

    setTimeout(() => {
      setLoad(false);
    }, 2000);

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const docRef = doc(db, "requests", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const propertyData = docSnap.data();
                    setMessage(propertyData.message);
                } else {
                    toast.error("Request not found", { position: "top-center" });
                }
            } catch (error) {
                toast.error("Failed to fetch Request data", { position: "top-center" });
                console.error("Error fetching Request data: ", error);
            }
        };

        fetchRequestData();
    }, [id]);

    const updateRequests = async (e) => {
        e.preventDefault();
      setLoad(true);
        if (message==="") {
            toast.error("Please enter a message first!!", { position: "top-center" });
            setTimeout(() => {
              setLoad(false);
            }, 2000);
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                toast.error("Student is not authenticated", { position: "top-center" });
                setTimeout(() => {
                  setLoad(false);
                }, 2000);
                return;
            }

            

            const docRef = doc(db, "requests", id);
            await updateDoc(docRef, {
                message,
                updated_at: Timestamp.now(),
            });

            toast.success("Request updated successfully", { position: "top-center" });

            setTimeout(() => {
              setLoad(false);
                nav("/myrequests");
            }, 3000);
        } catch (error) {
            toast.error("Something Went Wrong", { position: "top-center" });
            setTimeout(() => {
              setLoad(false);
            }, 2000);
            console.error("Error updating data: ", error);
        }
    };

    return(
        <>
        <>
        <HashLoader loading={load} cssOverride={styleObj} size={70} color={"aqua"}/>
        <div className={load?"d-none":""}>
  {/* Header Start */}
  <div className="container-fluid bg-primary py-5 mb-5 page-header">
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 text-center">
          <h1 className="display-3 text-white animated slideInDown">Request</h1>
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
                Update Request
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
        
        <h1 className="mb-5">Update Request</h1>
      </div>
      <div className="row g-4">
        <div className="col-lg-6 offset-md-3 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
          <form onSubmit={updateRequests}>
            <div className="row g-3">
              <div className="col-12">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    placeholder="Leave a message here"
                    id="message"
                    style={{ height: 150 }}
                    value={message} onChange={(e)=>{setMessage(e.target.value)}}
                  />
                  <label htmlFor="message">Enter Message</label>
                </div>
              </div>
              <div className="col-12">
                <button className="btn btn-primary w-100 py-3" type="submit">
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
  <ToastContainer/>
</>

        </>
    )
}