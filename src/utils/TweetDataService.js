import axios from "axios";
const API_URL = "http://localhost:8080/api/v1.0/tweets/";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1.0/tweets/",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});
class TweetService {
  getAllTweet() {
    return axios.get(API_URL + "all");
  }

  async getProfile() {
    return api.get("profile");
  }

  async verfiyEmail(email) {
    return api.get(`guest/emailExists/${email}`);
  }

  async sentOtp(email) {
    return api.get(`guest/generateOtp/${email}/register`);
  }

  async sendForgotPasswordOtp(email) {
    return api.get(`guest/generateOtp/${email}/forgot`);
  }

  async setNewPassword(postdata) {
    return api.post(`guest/forgot`,postdata);
  }

  async sentOtp(email) {
    return api.get(`guest/generateOtp/${email}/register`);
  }

  async verifyOtp(email, otp) {
    return api.get(`guest/verifyOtp/?email=${email}&otp=${otp}`);
  }

  async verfiyLoginId(loginId) {
    return api.get(`guest/loginIdExists/${loginId}`);
  }

  async register(postdata) {
    return api.post("guest/register", postdata);
  }

  async getUserTweets(userId, page) {
    return api.get(`${userId}?page=${page}`);
  }

  async getTweetComments(tweetId, page) {
    return api.get(`comment/findall/${tweetId}?page=${page}&size=2`);
  }

  async getHomePageTweets(page) {
    return api.get(`home?page=${page}`);
  }

  async getUserbyId(loginId) {
    return api.get(`userById/${loginId}`);
  }

  async likeATweet(loginId, id) {
    return api.put(loginId + "/like/" + id);
  }

  async likeAComment(commentId) {
    return api.put("comment/like/" + commentId);
  }
  async unLikeAComment(commentId) {
    return api.put("comment/dislike/" + commentId);
  }

  async unlikeATweet(loginId, id) {
    return api.put(loginId + "/unlike/" + id);
  }

  async deleteATweet(loginId, id) {
    return api.delete(loginId + "/delete/" + id);
  }

  async updateATweet(loginId, id, postdata) {
    return api.put(loginId + "/update/" + id, postdata);
  }

  async addTweet(loginId, postdata) {
    return api.post(loginId + "/add/", postdata);
  }

  async addComment(loginId,tweetId,postdata) {
    return api.post(loginId + "/reply/" + tweetId, postdata);
  }

  getUsers() {
    return axios.get(API_URL + "users/all");
  }

  postTweet(emailId, postdata) {
    return axios.post(API_URL + emailId, postdata, {
      headers: { "Content-Type": "application/json" },
    });
  }

  replyATweet(id, tweetUserId, postdata) {
    return axios.post(API_URL + id + "/reply/" + tweetUserId, postdata, {
      headers: { "Content-Type": "application/json" },
    });
  }
}
export default new TweetService();
