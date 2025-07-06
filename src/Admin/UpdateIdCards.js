import {
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, styleObj } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import { HashLoader } from "react-spinners";

export default function UpdateIdCards() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [uid, setUid] = useState("");
  const [load, setLoad] = useState(false);

  const { id } = useParams();
  const nav = useNavigate();

  setTimeout(() => {
    // setLoad(true);
  }, 2000);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const docRef = doc(db, "idCards", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const studentData = docSnap.data();
          setCard(studentData.card);
          setCollegeId(studentData.collegeId);
          setUid(studentData.uid);

          const userRef = doc(db, "users", studentData.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
          } else {
            toast.error("User not found", { position: "top-center" });
          }
        } else {
          toast.error("ID Card not found", { position: "top-center" });
        }
      } catch (error) {
        toast.error("Failed to fetch data", { position: "top-center" });
        console.error("Error fetching data: ", error);
      }
    };

    fetchStudentData();
  }, [id]);

  const updateCards = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("Admin is not authenticated", { position: "top-center" });
        return;
      }
      const cardRef = doc(db, "idCards", id);

      const updatedCard = {
        card,
        collegeId,
        status: "active",
        updated_at: Timestamp.now(),
      };

      // Update the idCards data
      await updateDoc(cardRef, updatedCard);

      toast.success("ID Card updated successfully", { position: "top-center" });

      setTimeout(() => {
        setLoad(false);
        nav("/admin/managestudents");
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong", { position: "top-center" });
      setTimeout(() => {
        setLoad(false);
      }, 2000);
      console.error("Error updating ID Card: ", error);
    }
  };

  return (
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
                  ID Cards
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
                      Update ID Card
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
              <h1 className="mb-5">Update Cards</h1>
            </div>
            <div className="row g-4">
              <div
                className="col-lg-6 offset-md-3 col-md-12 wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <form onSubmit={updateCards}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="cardId"
                          placeholder="Enter Card Id"
                          value={card}
                          onChange={(e) => setCard(e.target.value)}
                        />
                        <label htmlFor="cardId">Card Id:</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder="Student's first name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          readOnly
                        />
                        <label htmlFor="firstName">First Name:</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          placeholder="Student's last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          readOnly
                        />
                        <label htmlFor="lastName">Last Name:</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Student's email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          readOnly
                        />
                        <label htmlFor="email">Email:</label>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="collegeId"
                          placeholder="Enter College Id"
                          value={collegeId}
                          onChange={(e) => setCollegeId(e.target.value)}
                        />
                        <label htmlFor="collegeId">College Id:</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100 py-3"
                        type="submit"
                      >
                        Save
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
  );
}
