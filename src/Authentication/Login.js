import { useState, useEffect } from "react";
import { styleObj } from "../Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [load, setLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { studentLogin } = useAuth();
  const nav = useNavigate();

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

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoad(true);

    try {
      // Use the studentLogin function from AuthContext
      const result = await studentLogin(email, password, rememberMe);

      if (result.success) {
        // Navigate after a short delay to allow the toast to be seen
        setTimeout(() => {
          nav("/myprofile");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
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
                  Student Login
                </h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center"></ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* Header End */}

        {/* Login Form Start */}
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card auth-card">
                <div className="row g-0">
                  {/* Illustration Column */}
                  <div className="col-md-6 d-none d-md-block">
                    <div className="auth-illustration h-100 d-flex align-items-center justify-content-center p-4">
                      <img
                        src="/img/login-illustration.svg"
                        alt="Login"
                        className="img-fluid"
                      />
                    </div>
                  </div>

                  {/* Form Column */}
                  <div className="col-md-6">
                    <div className="card-body p-4 p-md-5">
                      <div className="auth-logo mb-4">
                        <h2 className="text-primary">
                          <i className="fa fa-book me-2"></i>Secure Dox
                        </h2>
                      </div>

                      <h3 className="card-title text-center mb-4">
                        Welcome Back!
                      </h3>
                      <p className="text-center text-muted mb-4">
                        Please sign in to access your student account
                      </p>

                      <form onSubmit={handleLogin}>
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

                        <div className="mb-4">
                          <div className="form-floating">
                            <input
                              type="password"
                              className={`form-control ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              id="password"
                              placeholder="Your Password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                  setErrors({ ...errors, password: null });
                                }
                              }}
                              required
                            />
                            <label htmlFor="password">
                              <i className="fas fa-lock auth-icon"></i> Password
                            </label>
                            {errors.password && (
                              <div className="invalid-feedback">
                                {errors.password}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberMe"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="rememberMe"
                            >
                              Remember me
                            </label>
                          </div>
                          <Link to="/forgot-password" className="auth-link">
                            Forgot Password?
                          </Link>
                        </div>

                        <button
                          className="btn btn-primary w-100 py-3"
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
                              Logging in...
                            </>
                          ) : (
                            <>
                              Sign In{" "}
                              <i className="fas fa-sign-in-alt ms-2"></i>
                            </>
                          )}
                        </button>
                      </form>

                      <div className="divider mt-4 mb-4">
                        <span className="text-muted">or</span>
                      </div>

                      <div className="text-center mb-3">
                        <Link to="/adminlogin" className="auth-link">
                          <i className="fas fa-user-shield me-2"></i> Login as
                          Administrator
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Login Form End */}
      </div>
      <ToastContainer />
    </>
  );
}
