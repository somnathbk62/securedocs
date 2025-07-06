import { collection, deleteDoc, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { db, styleObj } from "../Firebase";
import { HashLoader } from "react-spinners";

export default function ManageCertificates() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const { id } = useParams();
    setTimeout(() => {
        setLoad(false);
    }, 2000);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const certificatesQuery = query(collection(db, "certificates"), where("studentId", "==", id));

            const unsubscribe = onSnapshot(certificatesQuery, async (snapshot) => {
                const certificates = [];

                for (let docSnapshot of snapshot.docs) {
                    const certificateData = docSnapshot.data();

                    const userDoc = await getDoc(doc(db, "users", certificateData.studentId));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        certificates.push({
                            id: docSnapshot.id, // Store the Firestore document ID
                            certificate: certificateData,
                            user: userData
                        });
                    }
                }

                setData(certificates);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data.");
        }
    };
    
    const handleDelete = async (docId) => {
        setLoad(true);
        try {
            const certificateDoc = doc(db, "certificates", docId); 
            await deleteDoc(certificateDoc);
            toast.success("Document deleted successfully", {
                position: "top-center"
            });

            setData(prevData => prevData.filter(certificate => certificate.id !== docId));
            setTimeout(() => {
                setLoad(false);
            }, 2000);
        } catch (error) {
            toast.error("Something went wrong", {
                position: "top-center"
            });
            setTimeout(() => {
                setLoad(false);
            }, 2000);
            console.error("Error deleting document: ", error);
        } finally {
            setLoad(false);
        }
    };
    
    return (
        <>
         <HashLoader loading={load} cssOverride={styleObj} size={70} color={"aqua"}/>
         <div className={load?"d-none":""}>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row justify-content-end">
                        <div className="col-md-3 mb-5">
                            <Link to={`/admin/addcertificates/${id}`}>
                                <button className="btn btn-primary">Add Certificates</button>
                            </Link>
                        </div>
                    </div>
                    {data.length > 0 ? (
                        <div className="row">
                             <h1 className="mb-5 text-center mt-3">Manage Certificates</h1>
                            <div className="col-lg-12">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr No.</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Document Type</th>
                                            <th scope="col">Document</th>
                                            <th scope="col">Update</th>
                                            <th scope="col">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{item.certificate.title}</td>
                                                <td>{item.certificate.documentType}</td>
                                                <td>
                                                <button className="btn btn-primary mt-2"  onClick={() => window.open(item.certificate.imageUrl, "_blank")}
                                            disabled={!item.certificate.imageUrl}>View Document</button>
                                                </td>
                                                <td>
                                                    <Link to={`/admin/updatecertificates/${item.id}`}>
                                                        <button className="btn btn-primary">Update</button>
                                                    </Link>
                                                </td>
                                                <td>
                                                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button> 
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 py-5 mt-5 text-center"><h3>No Certificates found for this student.</h3></div>

                    )}
                </div>
            </div>
            </div>
            <ToastContainer />
        </>
    );
}
