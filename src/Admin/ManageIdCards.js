import { collection, deleteDoc, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { db, styleObj } from "../Firebase";
import { HashLoader } from "react-spinners";

export default function ManageIdCards() {
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
            const idCardsQuery = query(collection(db, "idCards"), where("studentId", "==", id));

            const unsubscribe = onSnapshot(idCardsQuery, async (snapshot) => {
                const idCards = [];

                for (let docSnapshot of snapshot.docs) {
                    const idCardData = docSnapshot.data();

                    const userDoc = await getDoc(doc(db, "users", idCardData.studentId));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();

                        idCards.push({
                            id: docSnapshot.id, 
                            idCard: idCardData,
                            user: userData
                        });
                    }
                }

                setData(idCards);
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
            const idCardDoc = doc(db, "idCards", docId); // Use the Firestore document ID
            await deleteDoc(idCardDoc);
            toast.success("Document deleted successfully", {
                position: "top-center"
            });
            setData(prevData => prevData.filter(idCard => idCard.id !== docId));
            setTimeout(() => {
                setLoad(false);
            }, 2000);
        } catch (error) {
            toast.error("Something went wrong", {
                position: "top-center"
            });
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
                            <Link to={`/admin/addidcards/${id}`}>
                                <button className="btn btn-primary">Add Id Cards</button>
                            </Link>
                        </div>
                    </div>
                    {data.length > 0 ? (
                        <div className="row">
                             <h1 className="mb-5 text-center mt-3">Manage Id Cards</h1>
                            <div className="col-lg-12">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr No.</th>
                                            <th scope="col">Card ID</th>
                                            <th scope="col">First Name</th>
                                            <th scope="col">Last Name</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">College ID</th>
                                            <th scope="col">Update</th>
                                            <th scope="col">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{item.idCard.card}</td>
                                                <td>{item.user.firstName}</td>
                                                <td>{item.user.lastName}</td>
                                                <td>
                                                    <img src={item.user.imageUrl} height={200} alt="Student" />
                                                </td>
                                                <td>{item.user.email}</td>
                                                <td>{item.idCard.collegeId}</td>
                                                <td>
                                                    <Link to={`/admin/updateidcards/${item.id}`}>
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
                        <div className="p-5 py-5 mt-5 text-center"><h3>No ID cards found for this student.</h3></div>
                    )}
                </div>
            </div>
            </div>
            <ToastContainer />
        </>
    );
}
