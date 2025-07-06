import { useEffect, useState } from "react";
import { db, auth, styleObj } from "../Firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { HashLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function IdCard() {
  const [userData, setUserData] = useState(null); 
  const [certificatesData, setCertificatesData] = useState([]);
  const [idCardsData, setIdCardsData] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
            const certificates = certificatesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setCertificatesData(certificates);

            const idCardQuery = query(
              collection(db, "idCards"),
              where("studentId", "==", user.uid)
            );
            const idCardSnapshot = await getDocs(idCardQuery);
            const idCards = idCardSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setIdCardsData(idCards);
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is signed in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoad(false);  // Loader is hidden after data is fetched or an error occurs
      }
    };

    fetchData();
  }, []);

  if (load) {
    // Show loader while data is being fetched
    return <HashLoader loading={load} cssOverride={styleObj} size={70} color={"aqua"}/>;
  }

  if (!userData || idCardsData.length === 0) {
    return <div className="py-5 text-center mt-3 p-5">No Id Card available.</div>;
  }

  return (
    <>
      <div className="container d-flex justify-content-center mt-5">
        <div className="row justify-content-between">
          {idCardsData.map((idCard) => {
            return (
              <div key={idCard.id} className="col-md-6">
                <div className="id-card">
                  <div className="card-front">
                    <div className="card-header text-center">
                      <img
                        src={userData.imageUrl}
                        alt="Student Image"
                        className="logo"
                      />
                      <h5 className="company-name">
                        {userData.firstName} {userData.lastName}
                      </h5>
                    </div>
                    <div className="card-footer" style={{width:"500px"}}>
                      <h6>ID : {idCard.card}</h6>
                      <h6>College Id : {idCard.collegeId}</h6>
                      <h6>Email : {userData.email}</h6>
                      <h6>Course : {userData.courseName}</h6>
                      <h6>Semester : {userData.semester}</h6>
                      <h6>Contact : {userData.contact}</h6>
                      <h6>Father's Name : {userData.fatherName}</h6>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
