import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormGroup } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import TweetDataService from "../utils/TweetDataService";

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
      {2022}
    </Typography>
  );
}

export default function SignUp() {
  let navigate = useNavigate();
  const [baseImage, setBaseImage] = React.useState("/broken-image.jpg");
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [EmailError, setEmailError] = React.useState("");
  const [LoginError, setLoginError] = React.useState("");
  const [OtpError, setOtpError] = React.useState("");
  const [otpState, setOtpState] = React.useState(1);
  const signupRef = React.useRef();

  const [otpLoading, setOtpLoading] = React.useState(false);
  async function handleOtpClick() {
    setOtpLoading(true);
    let loginId = signupRef.current.form[4].value;
    let email = signupRef.current.form[6].value;
    let otp = signupRef.current.form[8].value;
    let generateOtp = true;
    if (otpState === 1) {
      let emailVerified = await TweetDataService.verfiyEmail(email).catch(
        (err) => {
          return err.response.data;
        }
      );
      if (emailVerified === true || emailVerified?.data === true) {
        setEmailError("Email already exsits");
        generateOtp = false;
        setOtpLoading(false);
      } else {
        setEmailError("");
      }
      let loginIdVerfied = await TweetDataService.verfiyLoginId(loginId).catch(
        (err) => {
          return err.response.data;
        }
      );
      if (loginIdVerfied === true || loginIdVerfied?.data === true) {
        setLoginError("LoginId already exsits");
        generateOtp = false;
        setOtpLoading(false);
      } else {
        setLoginError("");
      }
      if (generateOtp) {
        TweetDataService.sentOtp(email).then(() => {
          setOtpLoading(false);
          setOtpState(2);
        });
      }
    } else if (otpState === 2) {
      let otpverify = await TweetDataService.verifyOtp(email, otp).catch(
        (err) => {
          return err.response.data;
        }
      );
      if (otpverify === false || otpverify?.data === false) {
        setOtpError("OTP is wrong");
        setOtpLoading(false);
      } else {
        setOtpError("");
        setOtpVerified(true);
        setOtpLoading(false);
        setOtpState(3);
      }
    }
  }

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const inputFileRef = React.useRef();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let temp = {
      email: data.get("email"),
      password: data.get("password"),
      loginId: data.get("LoginId"),
      image: baseImage,
      otp: data.get("otp"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    }
    console.log(temp);
    if (otpVerified) {
      TweetDataService.register(temp)
        .then((res) => {
          navigate("/login");
        })
        .catch((err) => {
          navigate("/error")
        })
        .finally(() => {
          setOtpVerified(false);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="file"
          ref={inputFileRef}
          style={{ display: "none" }}
          onChange={(e) => {
            uploadImage(e);
          }}
          accept="image/*"
        />
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} type="file">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  alt="+"
                  sx={{ width: "20vh", height: "20vh", fontSize: "10vh" }}
                  src={baseImage}
                  onClick={() => {
                    inputFileRef.current.click();
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="LoginId"
                label="LoginId"
                name="LoginId"
                error={LoginError.length > 0}
                helperText={LoginError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                error={EmailError.length > 0}
                helperText={EmailError}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
                <TextField
                  inputProps={{ inputMode: "numeric" }}
                  sx={{
                    width: "65%",
                  }}
                  id="otp"
                  label="OTP"
                  name="otp"
                  error={OtpError.length > 0}
                  helperText={OtpError}
                />
                <LoadingButton
                  sx={{ width: "30%", marginLeft: "5%" }}
                  onClick={handleOtpClick}
                  endIcon={otpState != 3 ? <SendIcon /> : <CheckIcon />}
                  loading={otpLoading}
                  loadingPosition="end"
                  variant="contained"
                  disabled={otpState === 3}
                >
                  {otpState === 1
                    ? "Send"
                    : otpState === 2
                    ? "Verify"
                    : "Verified"}
                </LoadingButton>
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="Confirm password"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!otpVerified}
            ref={signupRef}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
