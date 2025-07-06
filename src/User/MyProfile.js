import { useEffect, useState } from "react";
import { db, auth, styleObj } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { HashLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
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
    return (
      <div className="text-center py-5">
        <HashLoader loading={load} cssOverride={styleObj} size={70} color={"aqua"} />
      </div>
    );
  }

  if (!userData) {
    return <div className="py-5 p-5 mt-3 text-center">No user data available.</div>;
  }

  return (
    <>
      <div>
        {/* Header Start */}
        <div className="container-fluid bg-primary py-5 mb-5 page-header">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <h1 className="display-3 text-white animated slideInDown">
                  Student Profile
                </h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    {/* Breadcrumb items */}
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* Header End */}

        {/* Service Start */}
        <div className="container-xxl py-5">
          
            <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 600 }}>
              <h1 className="display-5 mb-4">Your Profile</h1>
            </div>

            <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
              <div className="row g-4">
              <div className="col-2"></div>
                <div className="col-3">
                  
                    <img src={userData.imageUrl} width={"100%"} alt="Profile" />
                  
                </div>
                <div className="col-5">
                  <div className="card p-4 w-100">
                    <div className="image">

                      <h5>First Name: <span className="idd text-success mt-3">{userData?.firstName || "Name not available"}</span></h5>
                      <h5>Last Name: <span className="idd text-success mt-3">{userData?.lastName || "Last Name not available"}</span></h5>
                      <h5>Email: <span className="idd text-success">{userData?.email || "Email not available"}</span></h5>
                      <h5>Contact: <span className="idd text-success">{userData?.contact || "Contact not available"}</span></h5>
                      <h5>Father's Name: <span className="idd text-success">Mr.{userData?.fatherName || "Father name not available"}</span></h5>
                      <h5>Mother's Name: <span className="idd text-success">Mrs.{userData?.motherName || "Mother Name not available"}</span></h5>
                      <h5>Gender: <span className="idd text-success">{userData?.gender || "Gender not available"}</span></h5>
                      <h5>Course Name: <span className="idd text-success">{userData?.courseName || "Course Name not available"}</span></h5>
                      <h5>Semester: <span className="idd text-success">{userData?.semester || "Semester not available"}</span></h5>
                      <h5>Year: <span className="idd text-success">{userData?.year || "Year not available"}</span></h5>
                      <h5>DOB: <span className="idd text-success">{userData?.dob || "DOB not available"}</span></h5>
                    </div>
                  </div>
                </div>
                <div className="col-2"></div>
              </div>
            </div>
          
        </div>
        {/* Service End */}
      </div>
      <ToastContainer />
    </>
  );
}
