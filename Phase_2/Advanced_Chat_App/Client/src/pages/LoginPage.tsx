import { useContext, useState } from "react";
import arrow from "../assets/arrow.png";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [currState, setCurrState] = useState<"Login" | "Sign Up">("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currState === "Sign Up" && !isDataSubmitted) {
      // Move to bio step
      setIsDataSubmitted(true);
      return;
    }

    try {
      if (currState === "Login") {
        await login?.("login", { email, password });
        navigate("/");
      } else {
        // handle sign up (you can modify this to send fullName, bio too)
        await login?.("signup", { email, password, fullName, bio });
        navigate("/");
      }
    } catch (err) {
      toast.error("Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <form
        onSubmit={onSubmitHandler}
        className="border-2 w-100 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={arrow}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter Email"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
            />
          </>
        )}

        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Provide a Short Bio..."
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
          />
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & Privacy Policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already Have An Account..?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click Here..
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create An Account..?{" "}
              <span
                onClick={() => {
                  setCurrState("Sign Up");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click Here..
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
