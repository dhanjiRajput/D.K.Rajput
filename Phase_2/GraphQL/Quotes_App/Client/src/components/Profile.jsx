import { useQuery } from '@apollo/client';
import { Get_My_Profile } from '../GraphQl_Operations/Queries';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Profile = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(Get_My_Profile);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) return <h3 className="text-center mt-5">Loading Profile...</h3>;

  if (error) {
    console.error(error.message);
    return <div className="alert alert-danger text-center">Error loading profile.</div>;
  }

  const { firstName, lastName, email, quotes } = data.user;

  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <img
          className="rounded-circle"
          style={{ border: "3px solid #6c63ff", marginTop: "20px" }}
          src={`https://robohash.org/${firstName}.png?size=200x200`}
          alt="Profile"
        />
        <h3 className="mt-3">{firstName} {lastName}</h3>
        <p className="text-muted">Email: {email}</p>
      </div>

      <h4 className="text-center text-primary mb-4">~ Your Quotes ~</h4>
      {
        quotes.length > 0 ? (
          quotes.map((quote, index) => (
            <div key={index} className="card mb-3 shadow-sm">
              <div className="card-body">
                <blockquote className="blockquote mb-0">
                  <p className="mb-0">{quote.name}</p>
                </blockquote>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No quotes posted yet.</p>
        )
      }
    </div>
  );
};

export default Profile;
