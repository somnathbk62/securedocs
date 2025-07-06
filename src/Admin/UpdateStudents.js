import { addDoc, collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, storage, styleObj } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { HashLoader } from "react-spinners";
export default function UpdateStudents(){
    const[firstName,setFirstName]=useState("");
    const[lastName,setLastName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[motherName,setMotherName]=useState("");
    const[fatherName,setFatherName]=useState("");
    const[contact,setContact]=useState("");
    const[gender,setGender]=useState("");
    const[courseName,setCourseName]=useState("");
    const[semester,setSemester]=useState("");
    const[year,setYear]=useState("");
    const[image,setImage]=useState("");
    const[dob,setDob]=useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");
    const[load,setLoad]=useState(true);
    const { id } = useParams();  
    const nav=useNavigate();

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
                    setPassword(studentData.password);
                    setGender(studentData.gender);
                    setFatherName(studentData.fatherName);
                    setMotherName(studentData.motherName);
                    setContact(studentData.contact);
                    setCourseName(studentData.courseName);
                    setYear(studentData.year);
                    setSemester(studentData.semester);
                    setDob(studentData.dob);
                    setExistingImageUrl(studentData.imageUrl);
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

    const updateStudent = async (e) => {
        e.preventDefault();
      setLoad(true);
        if (password.length < 6) {
            toast.error("Password should contain at least 6 characters");
            setTimeout(() => {
              setLoad(false);
            }, 2000);
        } else {
            try {
              
                let imageUrl = existingImageUrl;
                if (image) {
                    const storageRef = ref(storage, `students/${image.name}`);
                    await uploadBytes(storageRef, image);
                    imageUrl = await getDownloadURL(storageRef);
                }
    
                const updatedUser = {
                    firstName,
                    lastName,
                    email,
                    password,
                    contact,
                    motherName,
                    fatherName,
                    gender,
                    courseName,
                    year,
                    semester,
                    dob,
                    imageUrl,  
                    userType: "student",
                    status: "active",
                    updated_at: Timestamp.now(),  
                };
    
                const userRef = doc(db, "users", id);  
                await setDoc(userRef, updatedUser, { merge: true });  
    
                toast.success("Student updated successfully", {
                    position: "top-center",
                });
                setTimeout(() => {
                  setLoad(false);
                    nav("/admin/managestudents");
                }, 3000);
            } catch (error) {
                toast.error("Something went wrong!!!", {
                    position: "top-center",
                });
                setTimeout(() => {
                  setLoad(false);
                }, 2000);
                console.error("Error updating Student data: ", error);
            }
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
                Update Students
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
        
        <h1 className="mb-5">Update Student Data</h1>
      </div>
      <div className="row g-4">
        <div className="col-lg-10 offset-md-1 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
          <form onSubmit={updateStudent}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    value={firstName} onChange={(e)=>{setFirstName(e.target.value)}}
                  />
                  <label htmlFor="name">Student's First Name</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={lastName} onChange={(e)=>{setLastName(e.target.value)}}
                  />
                  <label htmlFor="name">Student's Last Name</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Student's Email"
                    value={email} onChange={(e)=>setEmail(e.target.value)}
                  />
                  <label htmlFor="email">Student's Email</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Student's Password"
                    value={password} onChange={(e)=>{setPassword(e.target.value)}}
                  />
                  <label htmlFor="name">Student's Password</label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating">
                  <input
                    type="file"
                    className="form-control"
                    placeholder="image"
                    onChange={(e)=>{setImage(e.target.files[0])}}
                  />
                  <label htmlFor="name">Update Image</label>
                </div>
              </div>
              <p>Previous Image:</p>
              {existingImageUrl && !image && (
            <img src={existingImageUrl} alt="Existing Property" style={{ marginTop: '10px', maxWidth: '100%' }} />
             )}
              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    className="form-control"
                    placeholder="Students Gender"
                    value={gender} onChange={(e)=>{setGender(e.target.value)}}
                  >
                    <option disabled>Select Student's Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <label htmlFor="name">Student's Gender</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Father's Name"
                    value={fatherName} onChange={(e)=>{setFatherName(e.target.value)}}
                  />
                  <label htmlFor="name">Father's Name</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mother's Name"
                    value={motherName} onChange={(e)=>{setMotherName(e.target.value)}}
                  />
                  <label htmlFor="name">Mother's Name</label>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contact Number"
                    value={contact} onChange={(e)=>{setContact(e.target.value)}}
                  />
                  <label htmlFor="name">Student's Contact</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Student's Course Name"
                    value={courseName} onChange={(e)=>{setCourseName(e.target.value)}}
                  />
                  <label htmlFor="name">Student's CourseName</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Semester"
                    value={semester} onChange={(e)=>{setSemester(e.target.value)}}
                  />
                  <label htmlFor="name">Semester</label>
                </div>
              </div>
             
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Year of Course"
                    value={year} onChange={(e)=>{setYear(e.target.value)}}
                  />
                  <label htmlFor="name">Year of Course</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Dob of student"
                    value={dob} onChange={(e)=>setDob(e.target.value)}
                  />
                  <label htmlFor="name">DOB</label>
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

        </>
    )
}