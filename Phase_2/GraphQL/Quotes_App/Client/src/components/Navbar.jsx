import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        width: '100%',
        padding: '0.8rem 1.5rem',
      }}
    >
      <div
        className="container-fluid"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Link to="/" className="navbar-brand" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Quote App
        </Link>
        <ul className="navbar-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: 0 }}>
          {token ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
              <li className="nav-item">
                <Link to="/create" className="nav-link">Create Quote</Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                >
                  LogOut
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link">SignUp</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
