import { AppBar, Container, Toolbar, Typography } from "@mui/material";

const App = () => {
  return (
    <Container maxWidth="sm">
      <AppBar position="static">
        <Toolbar>
          <Typography>
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>
    </Container>
  )
};

export default App