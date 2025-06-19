import { useQuery } from '@apollo/client';
import { Get_All_Quotes } from '../GraphQl_Operations/Queries';
import { Link } from 'react-router';

const Home = () => {
  const { loading, error, data } = useQuery(Get_All_Quotes);

  if (loading) return <h1 className="text-center my-5">Loading...</h1>;
  if (error) {
    console.log(error.message);
  }

  if (data?.quotes?.length === 0) {
    return <h3 className="text-center mt-4">No Quotes Available</h3>;
  }

  return (
    <div className="container mt-5">
      {data.quotes.map((quote, index) => (
        <div
          key={index}
          className="card shadow mb-4"
          style={{
            padding: '20px',
            borderLeft: '5px solid #673ab7',
            backgroundColor: '#f8f9fa',
            transition: '0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e8eaf6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }}
        >
          <h5 style={{ color: '#333' }}>{quote.name}</h5>
          <Link to={`/profile/${quote.by._id}`} style={{ textDecoration: 'none' }}>
            <p
              className="text-end mt-2"
              style={{
                fontStyle: 'italic',
                fontWeight: 'bold',
                color: '#512da8',
                marginBottom: 0
              }}
            >
              ~ {quote.by.firstName}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
