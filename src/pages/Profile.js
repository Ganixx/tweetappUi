import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tweet from "../Components/Tweet";
import TweetDataService from "../utils/TweetDataService";
import InfiniteScroll from "react-infinite-scroller";

const Profile = () => {
  const [user, setUser] = React.useState(null);
  const [tweets, setTweets] = React.useState([]);
  const[hasMore, setHasMore] = React.useState(true);
  let navigate = useNavigate();

  async function getTweets(page) {
    if(user == null){
      return;
    }
    try {
      let tweetPage = await TweetDataService.getUserTweets(
        user?.data.loginId,
        page
      );
      let temp = tweetPage.data.data.content;
      if(tweetPage.data.data.last) {
        setHasMore(false);
      }
      setTweets((prev) => [...prev, ...temp]);
    } catch (Error) {
      console.log(Error);
      navigate("/login");
    }
  }

  React.useEffect(() => {
    let data;
    async function getData() {
      try {
        data = localStorage.getItem("user");
        let userData = await JSON.parse(data);
        if (!userData) {
          throw new Error("Not logged in");
        }
        let tweetPage = await TweetDataService.getUserTweets(
          userData?.data.loginId,
          0
        );
        setTweets(tweetPage.data.data.content);
        setUser(userData);
      } catch (Error) {
        navigate("/login");
      }
    }
    getData();
  }, []);

  
  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "#1DA1F2",
              width: "100vw",
              height: "15vh",
              position: "relative",
            }}
          >
            <Avatar
              sx={{
                position: "absolute",
                width: "20vh",
                height: "20vh",
                left: "1vh",
                top: "5vh",
              }}
              src={user?.data.image}
            ></Avatar>
            <Box
              sx={{
                position: "absolute",
                right: "3vh",
                top: "18vh",
                display: "flex",
                flextWrap: "wrap",
                flexDirection: { xs: "column", sm: "row" },
                gap: "0.5vh",
              }}
            >
              <Typography paragraph color="text.primary" sx={{marginBottom : "0"}}>
                {`Followers ${user?.data.followerCount ? user?.data.followerCount : 0}`}
              </Typography>
              <Typography paragraph color="text.primary" >
                {`Following ${user?.data.followingCount ? user?.data.followingCount : 0}`}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              width: "100vw",
              marginTop: "10vh",
            }}
          >
            <Typography color="text.primary" align="left" sx={{ marginLeft: "5vh" }}>
              {user?.data.firstName} {user?.data.lastName}
            </Typography>
            <Typography color="text.primary" align="left" sx={{ marginLeft: "5vh" }}>
              @{user?.data.loginId}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ marginTop: "1vh" }} />
      <InfiniteScroll
        pageStart={-1}
        loadMore={getTweets}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {tweets?.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} princ = {user} />
        ))}
      </InfiniteScroll>
    </Box>
  );
};

export default Profile;
