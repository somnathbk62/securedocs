import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// User components
import Master from "./User/Master";
import MyProfile from "./User/MyProfile";
import MyCertificates from "./User/MyCertificates";
import IdCard from "./User/IdCard";
import AddRequest from "./User/AddRequest";
import MyRequests from "./User/MyRequests";
import UpdateRequest from "./User/UpdateRequest";

// Admin components
import AdminMaster from "./Admin/AdminMaster";
import Dashboard from "./Admin/Dashboard";
import AddStudents from "./Admin/AddStudents";
import ManageStudents from "./Admin/ManageStudents";
import UpdateStudents from "./Admin/UpdateStudents";
import ManageIdCards from "./Admin/ManageIdCards";
import AddIdCards from "./Admin/AddIdCards";
import UpdateIdCards from "./Admin/UpdateIdCards";
import AddCertificates from "./Admin/AddCertificates";
import ManageCertificates from "./Admin/ManageCertificates";
import UpdateCertificates from "./Admin/UpdateCertificates";
import PendingRequests from "./Admin/PendingRequests";
import ApprovedRequests from "./Admin/ApprovedRequests";
import RejectedRequests from "./Admin/RejectedRequests";
import CompletedRequests from "./Admin/CompletedRequests";

// Authentication components
import Login from "./Authentication/Login";
import AdminLogin from "./Authentication/AdminLogin";
import ForgotPassword from "./Authentication/ForgotPassword";

// Context and route protection
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Master />}>
            <Route
              path="/"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/adminlogin"
              element={
                <PublicOnlyRoute>
                  <AdminLogin />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPassword />
                </PublicOnlyRoute>
              }
            />

            {/* Protected student routes */}
            <Route
              path="/myprofile"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mycertificates"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyCertificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/idcard"
              element={
                <ProtectedRoute requiredRole="student">
                  <IdCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addrequest"
              element={
                <ProtectedRoute requiredRole="student">
                  <AddRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myrequests"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/updaterequests/:id"
              element={
                <ProtectedRoute requiredRole="student">
                  <UpdateRequest />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminMaster />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/addstudents" element={<AddStudents />} />
            <Route path="/admin/managestudents" element={<ManageStudents />} />
            <Route
              path="/admin/updatestudent/:id"
              element={<UpdateStudents />}
            />
            <Route
              path="/admin/manageidcards/:id"
              element={<ManageIdCards />}
            />
            <Route path="/admin/addidcards/:id" element={<AddIdCards />} />
            <Route
              path="/admin/updateidcards/:id"
              element={<UpdateIdCards />}
            />
            <Route
              path="/admin/addcertificates/:id"
              element={<AddCertificates />}
            />
            <Route
              path="/admin/managecertificates/:id"
              element={<ManageCertificates />}
            />
            <Route
              path="/admin/updatecertificates/:id"
              element={<UpdateCertificates />}
            />
            <Route
              path="/admin/pendingrequests"
              element={<PendingRequests />}
            />
            <Route
              path="/admin/approvedrequests"
              element={<ApprovedRequests />}
            />
            <Route
              path="/admin/rejectedrequests"
              element={<RejectedRequests />}
            />
            <Route
              path="/admin/completedrequests"
              element={<CompletedRequests />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
