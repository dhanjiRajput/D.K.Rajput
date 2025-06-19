import { useQuery } from '@apollo/client';
import { Get_User_By_Id } from '../GraphQl_Operations/Queries';
import { useParams } from 'react-router-dom';

const OtherUserProfile = () => {
  const { userid } = useParams();

  const { loading, error, data } = useQuery(Get_User_By_Id, {
    variables: {
      userid
    }
  });

  console.log("Data is:", data);

  if (loading) return <h3 className="text-center mt-5">Loading Profile...</h3>;

  if (error) {
    console.error(error.message);
    return <div className="alert alert-danger text-center">Failed to load user profile.</div>;
  }

  const { firstName, lastName, quotes } = data.user;

  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <img
          className="rounded-circle"
          style={{ border: "3px solid #6c63ff", height: "200px", width: "200px", marginTop: "20px" }}
          src="https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png"
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

export default OtherUserProfile;
