import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage, styleObj } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAuth } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { HashLoader } from "react-spinners";

export default function UpdateCertificates() {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [load, setLoad] = useState(true);
    const { id } = useParams();
    const nav = useNavigate();

    setTimeout(() => {
        setLoad(false);
    }, 2000);

    useEffect(() => {
        const fetchCertificateData = async () => {
            try {
                const docRef = doc(db, "certificates", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const certificateData = docSnap.data();
                    setTitle(certificateData.title);
                    setDocumentType(certificateData.documentType);
                    setExistingImageUrl(certificateData.imageUrl);
                } else {
                    toast.error("Data not found", { position: "top-center" });
                }
            } catch (error) {
                toast.error("Failed to fetch Certificate data", { position: "top-center" });
                console.error("Error fetching Certificate data: ", error);
            }
        };

        fetchCertificateData();
    }, [id]);

    const updateCertificate = async (e) => {
        e.preventDefault();
        setLoad(true);

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                toast.error("Admin is not authenticated", { position: "top-center" });
                return;
            }

            let imageUrl = existingImageUrl;

            if (image) {
                const storageRef = ref(storage, `certificates/${image.name}`);
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef);  
            }

            const certificateRef = doc(db, "certificates", id);

            const updatedCertificate = {
                title,
                documentType,
                imageUrl,
                status: "active",
                updated_at: Timestamp.now(),
            };

            await updateDoc(certificateRef, updatedCertificate);

            toast.success("Certificate updated successfully", { position: "top-center" });

            setTimeout(() => {
                setLoad(false);
                nav("/admin/managestudents");
            }, 3000);
        } catch (error) {
            toast.error("Something went wrong", { position: "top-center" });
            setTimeout(() => {
                setLoad(false);
            }, 2000);
            console.error("Error updating Certificate: ", error);
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
                            <h1 className="display-3 text-white animated slideInDown">Update Certificates</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Dashboard
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item text-white active" aria-current="page">
                                        Update Certificates
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
                        <h1 className="mb-5">Update Certificates</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-6 offset-md-3 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                            <form onSubmit={updateCertificate}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Document Title"
                                                value={title}
                                                onChange={(e) => { setTitle(e.target.value) }}
                                            />
                                            <label htmlFor="name">Document Title</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Document Type"
                                                value={documentType}
                                                onChange={(e) => { setDocumentType(e.target.value) }}
                                            />
                                            <label htmlFor="name">Document Type</label>
                                        </div>
                                    </div>
                                    <h6>Previous Document</h6>
                                    {existingImageUrl && !image && (
                                        <iframe src={existingImageUrl} alt="Existing Property" style={{ marginTop: '10px', maxWidth: '100%' }} />
                                    )}
                                    <div className="col-md-12">
                                        <div className="form-floating">
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="email"
                                                placeholder="Upload document"
                                                onChange={(e) => { setImage(e.target.files[0]) }}
                                            />
                                            <label htmlFor="email">Upload Document</label>
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
            <ToastContainer />
        </>
    );
}
