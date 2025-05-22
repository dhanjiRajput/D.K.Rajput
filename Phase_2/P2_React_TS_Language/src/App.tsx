import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Header from "./components/Header"
import {lazy, Suspense} from "react"
import Loader from "./components/Loader";

const Home=lazy(()=>import("./components/Home"));
const Learning=lazy(()=>import("./components/Learning"));
const Quize=lazy(()=>import("./components/Quize"));
const Result=lazy(()=>import("./components/Result"));
const Login=lazy(()=>import("./components/Login"));

const App = () => {
  return <Router>
    <Header/>
    <Suspense fallback={<Loader/>}>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/learn" element={<Learning/>}/>
      <Route path="/quize" element={<Quize/>}/>
      <Route path="/result" element={<Result/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    </Suspense>
  </Router>
}

export default App