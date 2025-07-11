import React, { createContext } from 'react'

export const UserDataContext=createContext();

const UserContext = ({children}) => {
    const value={};
  return (
    <div>
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    </div>
  )
}

export default UserContext