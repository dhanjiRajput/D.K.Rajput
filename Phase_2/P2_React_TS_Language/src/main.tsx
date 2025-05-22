import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {ThemeProvider} from "@emotion/react"
import {createTheme, CssBaseline} from "@mui/material"
import {Provider} from "react-redux"
import { store } from './Redux/store.ts'

const theme=createTheme({
  palette:{
    primary:{
      main:"rgb(85, 114, 110)",
    }
  }
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Provider store={store}>
          <App />
        </Provider>
      </CssBaseline>
    </ThemeProvider>
  </StrictMode>,
)
