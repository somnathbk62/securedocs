import { useState, useEffect } from "react";
import { styleObj } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [load, setLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { resetPassword } = useAuth();

  useEffect(() => {
    // Set a timeout to hide the loader after component mounts
    const timer = setTimeout(() => {
      setLoad(false);
    }, 2000);

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoad(true);

    try {
      await resetPassword(email);
      setEmail(""); // Clear the form after successful submission
    } catch (error) {
      // Error handling is done in the resetPassword function
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setLoad(false);
    }
  };

  return (
    <>
      <div
        className="custom-loader"
        style={{ display: load ? "flex" : "none" }}
      >
        <HashLoader
          loading={load}
          cssOverride={styleObj}
          size={70}
          color={"#06BBCC"}
        />
      </div>
      <div className={load ? "d-none" : "fade-in"}>
        {/* Header Start */}
        <div className="container-fluid bg-primary py-5 mb-5 page-header">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <h1 className="display-3 text-white animated slideInDown">
                  Reset Password
                </h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center"></ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* Header End */}

        {/* Reset Password Form Start */}
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card auth-card">
                <div className="row g-0">
                  {/* Illustration Column */}
                  <div className="col-md-5 d-none d-md-block">
                    <div className="auth-illustration h-100 d-flex align-items-center justify-content-center p-4">
                      <img
                        src="/img/forgot-password-illustration.svg"
                        alt="Forgot Password"
                        className="img-fluid"
                      />
                    </div>
                  </div>

                  {/* Form Column */}
                  <div className="col-md-7">
                    <div className="card-body p-4 p-md-5">
                      <div className="auth-logo mb-4">
                        <h2 className="text-primary">
                          <i className="fa fa-book me-2"></i>Secure Dox
                        </h2>
                      </div>

                      <h3 className="card-title text-center mb-3">
                        Forgot Your Password?
                      </h3>
                      <p className="text-center text-muted mb-4">
                        Enter your email address and we'll send you a link to
                        reset your password.
                      </p>

                      <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                          <div className="form-floating">
                            <input
                              type="email"
                              className={`form-control ${
                                errors.email ? "is-invalid" : ""
                              }`}
                              id="email"
                              placeholder="Your Email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) {
                                  setErrors({ ...errors, email: null });
                                }
                              }}
                              required
                            />
                            <label htmlFor="email">
                              <i className="fas fa-envelope auth-icon"></i>{" "}
                              Email Address
                            </label>
                            {errors.email && (
                              <div className="invalid-feedback">
                                {errors.email}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          className="btn btn-primary w-100 py-3 mt-4"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Sending...
                            </>
                          ) : (
                            <>
                              Reset Password{" "}
                              <i className="fas fa-paper-plane ms-2"></i>
                            </>
                          )}
                        </button>
                      </form>

                      <div className="divider mt-4 mb-4">
                        <span className="text-muted">or</span>
                      </div>

                      <div className="d-flex justify-content-center gap-3">
                        <Link to="/" className="auth-link">
                          <i className="fas fa-user me-2"></i> Student Login
                        </Link>
                        <span className="text-muted">|</span>
                        <Link to="/adminlogin" className="auth-link">
                          <i className="fas fa-user-shield me-2"></i> Admin
                          Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reset Password Form End */}
      </div>
      <ToastContainer />
    </>
  );
}
