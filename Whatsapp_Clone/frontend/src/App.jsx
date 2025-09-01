import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/user/Login'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './Components/Home'
import { ProtectedRoute, PublicRoute } from './Protected'
import UserDetails from './Components/UserDetails'
import Status from './pages/status/Status'
import Setting from './pages/setting/Setting'
import userUserStore from './store/useUserStore'
import { useEffect } from 'react'
import { disconnectSocket, initializeSocket } from './services/chat.service'

const App = () => {
  const { user } = userUserStore();

  useEffect(() => {
    if (user?._id) {
      // User is logged in, initialize socket
      const socket = initializeSocket();
    }

    return () => {
      disconnectSocket();
    }
  }, [user]);

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000}/>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path='/user-login' element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/user-profile' element={<UserDetails />} />
          <Route path='/status' element={<Status />} />
          <Route path='/setting' element={<Setting />} />

        </Route>
      </Routes>
    </>
  )
}

export default App