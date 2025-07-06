import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, styleObj } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAuth } from "firebase/auth";
import { HashLoader } from "react-spinners";

export default function AddIdCards() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [card, setCard] = useState("");
    const [collegeId, setCollegeId] = useState("");
    const [uid, setUid] = useState("");
    const[load,setLoad]=useState(true);

    const { id } = useParams();  
    const nav = useNavigate();

    setTimeout(() => {
        setLoad(false);
    }, 2000);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const studentData = docSnap.data();
                    setFirstName(studentData.firstName);
                    setLastName(studentData.lastName);
                    setEmail(studentData.email);
                    setUid(studentData.uid); 
                    
                } else {
                    toast.error("Student not found", { position: "top-center" });
                }
            } catch (error) {
                toast.error("Failed to fetch Student data", { position: "top-center" });
                console.error("Error fetching Student data: ", error);
            }
        };

        fetchStudentData();
    }, [id]);

    const addCards = async (e) => {
        e.preventDefault();
         setLoad(true);
        
        try {
            const auth = getAuth();
            const user = auth.currentUser;
 
            if (!user) {
                toast.error("Admin is not authenticated", {
                    position: "top-center"
                });
                return;
            }
 
            const cardRef = collection(db, "idCards");
 
            
            const q = query(cardRef, where("card", "==", card));
            const querySnapshot = await getDocs(q);
 
            if (!querySnapshot.empty) {
                toast.error("Card with same id already exists", {
                    position: "top-center",
                });
                return; 
            }
 
 
            const newCard = {
                card,
                collegeId,
                studentId:id,
                uid,
                status: "active",
                created_at: Timestamp.now(),
            };
 
            await addDoc(cardRef, newCard);
 
            toast.success("Id Card Addedd successfully", {
                position: "top-center",
            });
 
            setTimeout(() => {
             setLoad(false);
                nav("/admin/managestudents");
            }, 3000);
        } catch (error) {
            toast.error("Something Went Wrong", {
                position: "top-center"
            });
            setTimeout(() => {
             setLoad(false);
            }, 2000);
            console.log(error);
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
                            <h1 className="display-3 text-white animated slideInDown">ID Cards</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">Dashboard</a>
                                    </li>
                                    <li className="breadcrumb-item text-white active" aria-current="page">Add ID Card</li>
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
                        <h1 className="mb-5">Add ID Cards</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-6 offset-md-3 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                            <form onSubmit={addCards}>
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
                                                required
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
                                                placeholder="Your Student's first name"
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
                                                placeholder="Enter Student's last name"
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
                                                placeholder="Enter Student's email"
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
                                                required
                                            />
                                            <label htmlFor="collegeId">College Id:</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit">
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
            <ToastContainer/>
        </>
    );
}
