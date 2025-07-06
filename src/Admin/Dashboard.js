import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, styleObj } from "../Firebase";
import { HashLoader } from "react-spinners";

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [load, setLoad] = useState(true);

  setTimeout(() => {
    setLoad(false);
  }, 2000);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        
        const usersQuery = query(collection(db, 'users'), where('userType', '==', 'student'));
        const usersSnapshot = await getDocs(usersQuery);
        setUserCount(usersSnapshot.size);

        const cardSnapshot = await getDocs(collection(db, 'idCards'));
        setCardCount(cardSnapshot.size);

        const certificateSnapshot = await getDocs(collection(db, 'certificates'));
        setCertificateCount(certificateSnapshot.size);

        const requestsSnapshot = await getDocs(collection(db, 'requests'));
        setRequestCount(requestsSnapshot.size);
      } catch (error) {
        console.error("Error fetching document counts: ", error);
      }
    };

    fetchCounts();
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
                WELCOME ADMIN!!
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* Header End */}
      {/* Service Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-graduation-cap text-primary mb-4" />
                  <h5 className="mb-3">Total Students</h5>
                  <h1>{userCount}</h1>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-id-card text-primary mb-4" />
                  <h5 className="mb-3">Total Id Cards</h5>
                  <h1>{cardCount}</h1>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-certificate text-primary mb-4" />
                  <h5 className="mb-3">Total Certificates</h5>
                  <h1>{certificateCount}</h1>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-book-open text-primary mb-4" />
                  <h5 className="mb-3">Total Requests</h5>
                  <h1>{requestCount}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* Service End */}
    </>
  );
}
