import { useQuery } from '@apollo/client';
import { Get_User_By_Id } from '../GraphQl_Operations/Queries';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OtherUserProfile = () => {
  const { userid } = useParams();

  const { loading, error, data } = useQuery(Get_User_By_Id, {
    variables: { userid },
  });

  if (loading) return <h3 className="text-center mt-5">Loading Profile...</h3>;

  if (error) {
    toast.error("Failed to load user profile.");
    return <div className="alert alert-danger text-center">Failed to load user profile.</div>;
  }

  const { firstName, lastName, quotes } = data.user;

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="text-center mb-5">
        <img
          className="rounded-circle shadow"
          style={{ border: "3px solid #6c63ff", height: "150px", width: "150px", marginTop: "20px" }}
          src={`https://robohash.org/${firstName}.png?size=200x200`}
          alt="Profile"
        />
        <h3 className="mt-3">{firstName} {lastName}</h3>
        <p style={{ color: "gray", fontSize: "0.9rem" }}>
          Email - Confidential Information
        </p>
        <p style={{ color: "gray", fontSize: "0.9rem" }}>
          Only logged-in users can view
        </p>
      </div>

      <h4 className="text-center text-primary mb-4">~ Quotes ~</h4>

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
          </div>
        ))
      ) : (
        <p className="text-center text-muted">No quotes posted yet.</p>
      )}
    </div>
  );
};

export default OtherUserProfile;
