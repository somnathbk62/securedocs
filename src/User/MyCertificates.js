import { useEffect, useState } from "react";
import { db, auth, styleObj } from "../Firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { HashLoader, RingLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function MyCertificates() {
  const [userData, setUserData] = useState(null); 
  const [certificatesData, setCertificatesData] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser; 
        if (user) {
          const userDocRef = doc(db, "users", user.uid); 
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserData(userData); 
            
            const certificatesQuery = query(
              collection(db, "certificates"),
              where("studentId", "==", user.uid)
            );
            const certificatesSnapshot = await getDocs(certificatesQuery);
            const certificates = [];

            for (const doc of certificatesSnapshot.docs) {
              const certificateData = doc.data();

              const idCardQuery = query(
                collection(db, "idCards"),
                where("studentId", "==", user.uid)
              );
              const idCardSnapshot = await getDocs(idCardQuery);
              const idCardData = idCardSnapshot.docs.length > 0 ? idCardSnapshot.docs[0].data() : null;

              certificates.push({
                id: doc.id,
                ...certificateData,
                userData,
                idCardData
              });
            }

            setCertificatesData(certificates);
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is signed in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoad(false); 
      }
    };

    fetchUserData();
  }, []);

  if (load) {
    return <HashLoader loading={load} cssOverride={styleObj} size={70} color={"aqua"} />;
  }

  if (!userData || certificatesData.length === 0) {
    return <div className="py-5 p-5 mt-3 text-center">No certificates available.</div>;
  }


  return (
    <>
     
      {/* Header Start */}
      <div className="container-fluid bg-primary py-5 mb-5 page-header">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Student Certificates
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
                    Student Certificates
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
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 600 }}>
            <h1 className="display-5 mb-4">Student Certificates</h1>
          </div>
          <div className="row g-4">
            <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Sr No.</th>
                    <th scope="col">Student Name</th>
                    <th scope="col">College Id</th>
                    <th scope="col">Title</th>
                    <th scope="col">Course</th>
                    <th scope="col">Semester</th>
                    <th scope="col">Document Type</th>
                    <th scope="col">Document</th>
                  </tr>
                </thead>
                <tbody>
                  {certificatesData.map((el, index) => (
                    <tr key={el.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{el.userData.firstName} {el.userData.lastName}</td>
                      <td>{el.idCardData.collegeId}</td>
                      <td>{el.title}</td>
                      <td>{el.userData.courseName}</td>
                      <td>{el.userData.semester}</td>
                      <td>{el.documentType}</td>
                      <td>
                      <button className="btn btn-primary mt-2"  onClick={() => window.open(el.imageUrl, "_blank")}
                        disabled={!el.imageUrl}>View Document</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Service End */}
      <ToastContainer />
    </>
  );
}
