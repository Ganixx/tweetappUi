import CheckIcon from "@mui/icons-material/Check";
import LockResetIcon from '@mui/icons-material/LockReset';
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

export default function ForgotPassword() {
  let navigate = useNavigate();
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [EmailError, setEmailError] = React.useState("");
  const [OtpError, setOtpError] = React.useState("");
  const [otpState, setOtpState] = React.useState(1);
  const signupRef = React.useRef();

  const [otpLoading, setOtpLoading] = React.useState(false);
  async function handleOtpClick() {
    setOtpLoading(true);
    let email = signupRef.current.form[0].value;
    let otp = signupRef.current.form[2].value;
    let generateOtp = true;
    if (otpState === 1) {
      let emailVerified = await TweetDataService.verfiyEmail(email).catch(
        (err) => {
          return err.response.data;
        }
      );
      if (emailVerified === false || emailVerified?.data === false) {
        setEmailError("Email not found ");
        generateOtp = false;
        setOtpLoading(false);
      } else {
        setEmailError("");
      }
      if (generateOtp) {
        TweetDataService.sendForgotPasswordOtp(email).then(() => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let temp = {
      email: data.get("email"),
      password: data.get("NewPassword"),
      otp: data.get("otp"),
    };
    if (otpVerified) {
      TweetDataService.setNewPassword(temp)
        .then(() => {
          navigate("/login");
        })
        .catch(() => {
          navigate("/error");
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} type="file">
          <LockResetIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset password
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
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
                name="NewPassword"
                label="NewPassword"
                type="password"
                id="NewPassword"
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
            Reset Password
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
               remember password now ? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
