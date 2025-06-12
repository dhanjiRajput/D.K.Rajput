import { useState } from "react";
import logo from "../assets/logo.png";
import arrow from "../assets/arrow.png";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [bio,setBio] = useState("");
  const [isDataSubmitted,setIsDataSubmitted] = useState(false);

  const onSubmitHandler=(event)=>{
      event.preventDefault();
      if(currState==="Sign Up" && !isDataSubmitted){
          setIsDataSubmitted(true);
          return;
      }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* <div className="text-center py-20 text-white">
        <img src={logo} alt="logo" className="w-[min(30vw,250px)] mx-auto mb-6" />
        <h1 className="text-4xl font-bold">Let's Start Chat</h1>
      </div> */}


      <form action="" onSubmit={onSubmitHandler} className="border-2 w-100 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}{isDataSubmitted && 
          <img onClick={()=>setIsDataSubmitted(false)} src={arrow} alt="" className="w-5 cursor-pointer"></img>}
        </h2>
        {currState==="Sign Up" && !isDataSubmitted &&(
          <input onChange={(e)=>setFullName(e.target.value)} value={fullName} type="text" className="p-2  border border-gray-500 rounded-md focus:outline-none" placeholder="Full Name" required></input>
        )}

        {!isDataSubmitted &&(
          <>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Enter Email" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Enter Password" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
          </>
        )}

        {currState==="Sign Up" && isDataSubmitted &&(
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} placeholder="Provide a Short Bio.." required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        )}

        <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox"></input>
            <p>Agree to the terms of use & Privacy Policy</p>
        </div>

        <div className="flex flex-col gap-2">
            {currState==="Sign Up" ?(
                <p className="text-sm text-gray-600">Already Have An Account.. ?&nbsp;&nbsp;&nbsp;<span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className="font-medium text-violet-500 cursor-pointer">Click Here..</span></p>
            ):(
                <p className="text-sm text-gray-600">Create An Account.. ?&nbsp;&nbsp;&nbsp;<span onClick={()=>{setCurrState("Sign Up")}} className="font-medium text-violet-500 cursor-pointer">Click Here..</span></p>
            )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage