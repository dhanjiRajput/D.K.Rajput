import { gql, useQuery } from '@apollo/client';

const query = gql`
  query ExampleQuery {
    getTodos {
      id
      title
      completed
      user {
        id
        name
        email
        phone
      }
    }
  }
`;

function App() {
  const { data, loading } = useQuery(query);

  if (loading) {
    return (
      <div style={fullscreenContainer}>
        <h1 style={{ color: '#555' }}>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={fullscreenContainer}>
      <div style={contentWrapper}>
        <h1 style={{ color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
          Todo List with User Details
        </h1>

        {/* ⬇️ Table wrapped in scrollable div */}
        <div style={tableScrollWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Completed</th>
                <th style={thStyle}>User ID</th>
                <th style={thStyle}>User Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {data.getTodos.map((todo, idx) => (
                <tr
                  key={todo.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#ecf0f1' : '#ffffff',
                    textAlign: 'center',
                  }}
                >
                  <td style={tdStyle}>{todo.id}</td>
                  <td style={tdStyle}>{todo.title}</td>
                  <td style={tdStyle}>{todo.completed.toString()}</td>
                  <td style={tdStyle}>{todo.user.id}</td>
                  <td style={tdStyle}>{todo.user.name}</td>
                  <td style={tdStyle}>{todo.user.email}</td>
                  <td style={tdStyle}>{todo.user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🖼️ Fullscreen layout
const fullscreenContainer = {
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: '#f0f4f8',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  boxSizing: 'border-box',
  overflow: 'auto',
};

// 📦 Content container
const contentWrapper = {
  width: '100%',
  maxWidth: '95vw',
  backgroundColor: '#fff',
  padding: '30px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
};

// ⏩ Enable horizontal scroll for wide tables
const tableScrollWrapper = {
  overflowX: 'auto',
};

// 📊 Table style
const tableStyle = {
  minWidth: '900px',
  width: '100%',
  borderCollapse: 'collapse',
};

const headerRowStyle = {
  backgroundColor: '#3498db',
  color: 'white',
};

const thStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  fontSize: '16px',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  fontSize: '14px',
  color: '#2c3e50',
  whiteSpace: 'nowrap',
};

export default App;
