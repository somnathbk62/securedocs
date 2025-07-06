import { useEffect, useState } from "react";
import { db, auth, styleObj } from "../Firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";


export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const[load,setLoad]=useState(true);

  setTimeout(() => {
    setLoad(false);
  }, 2000);

  useEffect(() => {
    const fetchRequests = () => {
      const user = auth.currentUser; 
      if (user) {
        const requestsQuery = query(
          collection(db, "requests"),
          where("studentId", "==", user.uid) 
        );


        const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
          const requestsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setRequests(requestsData); 
        });

        return () => unsubscribe(); 
      }
    };

    fetchRequests();
  }, []);


  const handleDelete = async (id) => {
    setLoad(true);
    try {
        const requestDoc = doc(db, "requests", id);
        await deleteDoc(requestDoc);
        toast.success("Status Updated Successfully",{
            position:"top-center"
        })
        setTimeout(() => {
            setLoad(false);
        }, 2000);
        setRequests(prevData => prevData.filter(request => request.id !== id));
    } catch (error) {
        toast.error("Something went wrong",{
            position:"top-center"
        })
        setTimeout(() => {
            setLoad(false);
        }, 2000);
        console.error("Error deleting document: ", error);
    }
};
  return (
    <>
     <HashLoader loading={load} cssOverride={styleObj} size={70} color={"aqua"}/>
     <div className={load?"d-none":""}>
      {/* Header Start */}
      <div className="container-fluid bg-primary py-5 mb-5 page-header">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Requests
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
                    My Requests
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Header End */}
      {/* Service Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <table className="table ">
                <thead>
                  <tr>
                    <th scope="col">Sr No.</th>
                    <th scope="col">Message</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((el, index) => (
                      <tr key={el.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{el.message}</td>
                        <td>{el.status}</td>
                        {el.status==="Completed" || el.status==="Rejected" || el.status==="Approved" ? (
                            <>
                            No action can be performed
                            </>
                        ):(
                            <>
                            <td>
                        <Link to={`/updaterequests/${el.id}`}>
                            <button className="btn btn-primary">Update</button>
                            </Link>
                            <button className="btn btn-danger ms-4" onClick={() => handleDelete(el.id)}>Delete</button>
                        </td>
                            </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Currently You dont have any requests.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* Service End */}
      <ToastContainer/>
    </>
  );
}
