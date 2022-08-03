import axios from "axios";
import TweetDataService from "./TweetDataService";

const API_URL = "http://localhost:8080/api/v1.0/tweets/";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1.0/tweets/",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

class AuthService {
  async login(loginId, password) {
    let response = await axios
      .post(
        API_URL + "login",
        {},
        {
          mode: "cors",
          headers: {
            username: loginId,
            password: password,
          },
          withCredentials: true,
        }
      )
      .then((res) => res.status)
      .catch((error) => error.response.status);

    if (response == "200") {
      try {
        let result = await TweetDataService.getProfile();
        if (result.status == "401") {
          navigate("/login");
        } else {
          localStorage.setItem("user", JSON.stringify(result.data));
          localStorage.setItem("expiresAt", JSON.stringify(new Date(Date.now() + 4 * 60 * 60 * 1000)));
        }
      } catch (Error) {
        navigate("/login");
      }
    }
    return response;
  }

  register(
    firstName,
    lastName,
    loginId,
    password,
    confirmPassword,
    emailId,
    contactNumber
  ) {
    return axios.post(API_URL + "register", {
      firstName,
      lastName,
      loginId,
      password,
      confirmPassword,
      emailId,
      contactNumber,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  logout() {
    localStorage.removeItem("user");
  }
}
export default new AuthService();
