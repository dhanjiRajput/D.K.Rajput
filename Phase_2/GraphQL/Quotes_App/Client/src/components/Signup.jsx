import { useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Signup_User } from '../GraphQl_Operations/Mutation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [signupUser, { data, loading, error }] = useMutation(Signup_User);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Signup failed");
    }
    if (data && data.signupUser) {
      toast.success(`${data.signupUser.firstName} signed up successfully!`);
    }
  }, [error, data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signupUser({
      variables: {
        signup_User: formData,
      },
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        {loading ? (
          <div className="text-center text-muted">Signing up...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="firstName"
                placeholder="Enter First Name..."
                required
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="lastName"
                placeholder="Enter Last Name..."
                required
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Enter Email..."
                required
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Enter Password..."
                required
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary">
                Sign Up Now
              </button>
            </div>
            <div className="text-center">
              <Link to="/login">Already have an account? Click here to login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
