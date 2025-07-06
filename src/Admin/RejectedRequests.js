import { useEffect, useState } from "react";
import { db, styleObj } from "../Firebase";
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { HashLoader } from "react-spinners";

export default function RejectedRequests() {
  const [requests, setRequests] = useState([]);
  const [load, setLoad] = useState(true);

  setTimeout(() => {
    setLoad(false);
  }, 2000);

  useEffect(() => {

    const requestsQuery = query(collection(db, "requests"), where("status", "==", "Rejected"));

    const unsubscribe = onSnapshot(requestsQuery, async (snapshot) => {
      const requestData = [];
      for (const doc of snapshot.docs) {
        const request = doc.data();
        
       
        const userQuery = query(collection(db, "users"), where("uid", "==", request.studentId));
        const userSnapshot = await getDocs(userQuery);

        userSnapshot.forEach(userDoc => {
          requestData.push({
            id: doc.id,
            requestDetails: request,
            userDetails: userDoc.data(),
          });
        });
      }
      setRequests(requestData);
      setLoad(false);
    });

   
    return () => unsubscribe();
  }, []);

  

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
                      Dashboard
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Rejected Requests
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
            <h1 className="text-center mb-5">Rejected Requests</h1>
            <div className="col-md-12">
              <table className="table ">
                <thead>
                  <tr>
                    <th scope="col">Sr No.</th>
                    <th scope="col">Student Details</th>
                    <th scope="col">Request Details</th>
                    <th scope="col">Message</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {!load && requests.length > 0 ? (
                    requests.map((el, index) => (
                      <tr key={el.id}>
                        <th scope="row">{index + 1}</th>
                        <td>
                            {el.userDetails.firstName} {el.userDetails.lastName}
                        </td>
                        <td>
                            {el.userDetails.courseName} &nbsp;&nbsp;
                            Sem {el.userDetails.semester} &nbsp;&nbsp;
                            {el.userDetails.year}
                        </td>
                        <td width="450px">{el.requestDetails.message}</td>
                        <td>{el.requestDetails.status}</td>
                        
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">Currently there are no rejected requests.</td>
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
