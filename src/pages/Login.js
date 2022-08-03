import Avatar from "@mui/material/Avatar";
import * as React from "react";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TwitterIcon from "@mui/icons-material/Twitter";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/auth.service";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        TweetApp
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  const [signinLoading, setSigninLoading] = React.useState(false);
  const [userIdError, setUserIdError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  let navigate = useNavigate();
  const handleSubmit = async (event) => {
    setSigninLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let response = await AuthService.login(
      data.get("LoginId"),
      data.get("password")
    );
    if (response == "200") {
      navigate("/home");
    } else if (response == "401") {
      setSigninLoading(false);
      setUserIdError("UserId might be  incorrect");
      setPasswordError("password might be incorrect");
    }else{
      setSigninLoading(false);
      navigate("/error");
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={false}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px)",
          zIndex: -2,
        }}
      ></Grid>
      <Grid item>
        <TwitterIcon
          variant="outlined"
          sx={{
            fontSize: "50vh",
            position: "absolute",
            top: "25vh",
            left: "20vh",
            display: { xs: "none", md: "block" },
            zIndex: 0,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="LoginId"
              label="LoginId"
              name="LoginId"
              autoComplete="LoginId"
              autoFocus
              error={userIdError !== ""}
              helperText={userIdError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={passwordError !== ""}
              helperText={passwordError}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <LoadingButton
              endIcon={<SendIcon />}
              loading={signinLoading}
              loadingPosition="end"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link  variant="body2" onClick={()=> navigate("/forgotpassword")}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
