import { useMutation, useQuery } from '@apollo/client';
import { Get_All_Quotes, Get_My_Profile } from '../GraphQl_Operations/Queries';
import { Delete_Quote, Update_Quote } from '../GraphQl_Operations/Mutation';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(Get_My_Profile);

  const [deleteQuote] = useMutation(Delete_Quote, {
    refetchQueries: [{ query: Get_My_Profile }, { query: Get_All_Quotes }],
  });

  const [updateQuote] = useMutation(Update_Quote, {
    refetchQueries: [{ query: Get_My_Profile }, { query: Get_All_Quotes }],
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) return <h3 className="text-center mt-5">Loading Profile...</h3>;
  if (error) {
    toast.error("Failed to load profile.");
    return <div className="alert alert-danger text-center">Error loading profile.</div>;
  }

  const { firstName, lastName, email, quotes } = data.user;

  const handleDelete = async (_id) => {
    try {
      await deleteQuote({ variables: { _id } });
      toast.success("Quote deleted successfully!");
    } catch (err) {
      toast.error("Error deleting quote.");
    }
  };

  const handleUpdate = async (_id, currentText) => {
    const updated = prompt("Edit your quote:", currentText);
    if (updated && updated.trim() !== currentText) {
      try {
        await updateQuote({ variables: { _id, name: updated } });
        toast.success("Quote updated successfully!");
      } catch (err) {
        toast.error("Error updating quote.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={2500} />
      
      <div className="text-center mb-5">
        <img
          className="rounded-circle shadow"
          style={{ border: "3px solid #6c63ff", marginTop: "20px", width: 150, height: 150 }}
          src={`https://robohash.org/${firstName}.png?size=200x200`}
          alt="Profile"
        />
        <h3 className="mt-3">{firstName} {lastName}</h3>
        <p className="text-muted">Email: {email}</p>
      </div>

      <h4 className="text-center text-primary mb-4">~ Your Quotes ~</h4>

      {quotes.length > 0 ? (
        quotes.map((quote, index) => (
          <div
            key={index}
            className="card mb-4 border-0"
            style={{
              backgroundColor: '#fff',
              borderLeft: '5px solid #6c63ff',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(108, 99, 255, 0.2)',
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
              padding: '20px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f0ff';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(108, 99, 255, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(108, 99, 255, 0.2)';
            }}
          >
            <blockquote className="blockquote mb-0">
              <p
                className="mb-0"
                style={{
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  color: '#333',
                }}
              >
                “{quote.name}”
              </p>
            </blockquote>

            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-light rounded-circle shadow-sm"
                style={{ color: '#ffc107', border: '1px solid #ffc107' }}
                onClick={() => handleUpdate(quote._id, quote.name)}
                title="Edit"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="btn btn-light rounded-circle shadow-sm"
                style={{ color: '#dc3545', border: '1px solid #dc3545' }}
                onClick={() => handleDelete(quote._id)}
                title="Delete"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted">No quotes posted yet.</p>
      )}
    </div>
  );
};

export default Profile;
