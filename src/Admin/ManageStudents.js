import { addDoc, collection, doc, onSnapshot, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, storage, styleObj } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";

export default function ManageStudents(){

    const [data, setData] = useState([]);
    const[load,setLoad]=useState(true);

    setTimeout(() => {
        setLoad(false);
    }, 2000);

    useEffect(() => {
        const getStudents = () => {
            const studentRef = collection(db, "users");
    
            const unsubscribe = onSnapshot(studentRef, (snapshot) => {
                const students = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .filter(student => student.userType === "student" && student.status=="active"); // Filter students with userType "student"
                
                setData(students);
            });
    
            return () => unsubscribe();
        };
    
        getStudents();
    }, []);

    const handleDelete = async (id) => {
      setLoad(true);
        try {
            const studentDocRef = doc(db, "users", id);
            await updateDoc(studentDocRef, { status: "inactive" });
            toast.success("status updated successfully!",{
                position:"top-center"
            });
            setTimeout(() => {
              setLoad(false);
            }, 2000);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status of student.",{
                position:"top-center"
            });
            setTimeout(() => {
              setLoad(false);
            }, 2000);
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
          <h1 className="display-3 text-white animated slideInDown">Students</h1>
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
                Manage Students
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
        
        <h1 className="mb-5">Manage Students</h1>
      </div>
      <div className="row g-4">
        <div className="col-lg-10 offset-md-1 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
            <div className="table-responsive">
        <table className="table table-bordered">
                <thead>
                <tr>
                <th scope="col">Sr No.</th>
                <th scope="col">Student</th>
                <th scope="col">Contact</th>
                <th scope="col">Parents</th>
                <th scope="col">Gender</th>
                <th scope="col">Course</th>
                <th scope="col">DOB</th>
                <th scope="col">Id Cards</th>
                <th scope="col">Certificates</th>
                <th scope="col">Update</th>
                <th scope="col">Delete</th>
                
                </tr>
            </thead>
            <tbody>
                {data?.map((el,index)=>(
                    <>
                <tr>
                <th scope="row">{index+1}</th>
                <td width="200px">{el?.firstName} {el?.lastName}
                  <br/>
                    <img src={el.imageUrl} width="100%"/>
                </td>
                <td>{el?.email}
                  <br/>
                  {el?.contact}
                </td>
                <td>Father: {el?.fatherName}<br/>Mother: {el?.motherName}</td>
                <td>{el?.gender}</td>
                <td>{el?.courseName}<br/>Sem: {el?.semester} {el?.year}</td>
                <td>{el?.dob}</td>
                <td>
                <Link to={`/admin/manageidcards/${el.id}`}>
                  <img src="/img/id-card.png" height={50}/>
                  </Link>
                </td>
                <td>
                <Link to={`/admin/managecertificates/${el.id}`}>
                <img src="/img/certificate.png" height={50}/>
                </Link>
                </td>
                <td>
                <Link to={`/admin/updatestudent/${el.id}`}>
                    <button className="btn btn-primary">Update</button>
                </Link>
                </td>
                <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(el.id)}>Delete</button>
                </td>
               
                </tr>
                    </>
                ))}
               
            
            </tbody>
                    </table>
        </div>
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