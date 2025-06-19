import './App.css'
import Navbar from './components/Navbar'
import {useRoutes} from 'react-router'
import { routes } from './routes'

function App() {
  const element= useRoutes(routes)
  return (
    <>
      <div style={{textAlign:"center"}}>
          <Navbar/>
          {element}
      </div>
    </>
  )
}

export default App
