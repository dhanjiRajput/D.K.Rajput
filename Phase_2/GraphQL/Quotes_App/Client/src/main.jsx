import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'

const client=new ApolloClient({
  uri:'http://localhost:4000',
  cache:new InMemoryCache(),
  headers:{
    authorization:localStorage.getItem("token") || "",
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App/>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>,
)
