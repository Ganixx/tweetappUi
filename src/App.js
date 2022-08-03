import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Logout from "./Components/Logout";
import SignUp from "./Components/SignUp";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PrivateRoutes from "./utils/PrivateRoutes";
import ForgotPassword from "./pages/ForgotPassword";

const theme = createTheme();

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path="/" />
              <Route element={<Home />} path="/home" />
              <Route element={<Profile />} path="/profile" />
              <Route element={<Logout />} path="/logout" />
            </Route>
            <Route element={<Login />} path="/login" />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<Error />} path="/error" />
            <Route element={<ForgotPassword />} path="/forgotpassword" />
            <Route element={<Error />} path="*" />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
