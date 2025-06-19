import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Signup_User } from '../GraphQl_Operations/Mutation';

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [signupUser, { data, loading, error }] = useMutation(Signup_User);

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
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error.message}
          </div>
        )}

        {data && data.signupUser && (
          <div className="alert alert-success text-center" role="alert">
            {data.signupUser.firstName} is signed up! You can login now.
          </div>
        )}

        {loading ? (
          <div className="text-center">Signing up...</div>
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
