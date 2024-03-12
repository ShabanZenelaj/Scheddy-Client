import {createTheme, ThemeProvider} from "@mui/material";
import './fonts.css';
import Login from "./pages/login";
import Home from "./pages/home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "./pages/signup";

const theme = createTheme({
    typography: {
        fontFamily: [
            'Ubuntu',
            'Arial',
            'sans-serif'
        ].join(','),
    }
});

function App() {
  return (
      <ThemeProvider theme={theme}>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
              </Routes>
          </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
