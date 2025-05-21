// import { createContext, useState, type ReactNode } from "react";
// import Box from "./components/Box";




// type ThemeType = "light" | "dark";


// interface ThemeContextType {
//   theme: ThemeType;
//   toggleTheme: () => void;
// };


// export const ThemeContext = createContext<ThemeContextType>({
//   theme: "light",
//   toggleTheme: () => {}
// });



// const ThmeProvider = ({ children }: { children: ReactNode }) => {
//   const [theme, setTheme] = useState<ThemeType>("light");
//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   }
//   return (<ThemeContext.Provider value={{ theme, toggleTheme }}>
//     {children}
//   </ThemeContext.Provider>);
// };


// const App = () => {
//   return (
//     <ThmeProvider>
//       <div>App</div>
//       <Box/>
//     </ThmeProvider>
//   )
// };

// export default App

//This code is for rducer

// import { useReducer } from "react"
// type StateType={count:number;};
// type ActionType={type:"Increment",payload:number}|{type:"Decrement",payload:number}

// const reducer=(state:StateType,action:ActionType)=>{
//   switch (action.type) {
//     case "Increment":
//       return {count:state.count+action.payload};
//     case "Decrement":
//       return {count:state.count-action.payload};
//   }
// };


// const initialState:StateType={
//   count:0,
// };

// const App = () => {
//   const [state,dispatch]=useReducer(reducer,initialState);

//   const increment=():void=>{
//     dispatch({
//       type:"Increment",
//       payload:1,
//     })
//   };

//   const decrement=():void=>{
//     dispatch({
//       type:"Decrement",
//       payload:1,
//     })
//   };


//   return (
//     <div>
//       <h1>Count Change</h1>
//       <p>Count:{state.count}</p>

//       <button onClick={increment}>+</button>
//       <button onClick={decrement}>-</button>
//     </div>
//   )
// }

// export default App

import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, type RootState } from "./redux";


const App = () => {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.count);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Redux Counter</h2>
      <h3>Count: {count}</h3>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default App;
