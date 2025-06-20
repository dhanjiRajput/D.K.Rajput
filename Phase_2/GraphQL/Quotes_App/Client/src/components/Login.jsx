import { useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Login_User } from '../GraphQl_Operations/Mutation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const [signinUser, { error, loading, data }] = useMutation(Login_User, {
    onCompleted(data) {
      localStorage.setItem("token", data.user.token);
      toast.success("Login successful!");
      navigate('/')
    }
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Login failed");
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signinUser({
      variables: {
        signin_User: formData
      }
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Login</h3>

        {loading ? (
          <div className="text-center text-muted">Logging in...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Enter Email..."
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Enter Password..."
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>
            <div className="d-grid mb-3">
              <button className="btn btn-primary" type="submit">Login Now</button>
            </div>
            <div className="text-center">
              <Link to="/signup">Don't have an account? Sign up</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
