import { useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Create_Quote } from '../GraphQl_Operations/Mutation';
import { Get_All_Quotes, Get_My_Profile } from '../GraphQl_Operations/Queries';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateQuote = () => {
  const [quote, setQuote] = useState("");

  const [createQuote, { loading, error, data }] = useMutation(Create_Quote, {
    variables: { name: quote },
    refetchQueries: [{ query: Get_All_Quotes }, { query: Get_My_Profile }]
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Error creating quote");
    }
    if (data && data.createQuote) {
      toast.success(data.createQuote);
    }
  }, [data, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quote.trim()) return;
    createQuote({ variables: { name: quote } });
    setQuote("");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="card p-4 shadow">
        <h4 className="mb-4 text-center text-primary">Create a New Quote</h4>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              value={quote}
              onChange={e => setQuote(e.target.value)}
              placeholder="Enter your quote..."
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            {loading ? "Creating..." : "Create Quote"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuote;
