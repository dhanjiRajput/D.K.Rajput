import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Login_User } from '../GraphQl_Operations/Mutation';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const [signinUser, { error, loading, data }] = useMutation(Login_User, {
    onCompleted(data) {
      localStorage.setItem("token", data.user.token);
      navigate('/');
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
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
      <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Login</h3>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error.message}
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading...</div>
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