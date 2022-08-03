import Box from "@mui/material/Box";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useNavigate } from "react-router-dom";
import PostTweet from "../Components/PostTweet";
import Tweet from "../Components/Tweet";
import TweetDataService from "../utils/TweetDataService";
import Comments from "../Components/Comments";


const Home = () => {
  const [user, setUser] = React.useState(null);
  const [tweets, setTweets] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  let navigate = useNavigate();

  async function getTweets(page) {
    if (user == null) {
      return;
    }
    try {
      let tweetPage = await TweetDataService.getHomePageTweets(page);
      let temp = tweetPage.data.data.content;
      if (tweetPage.data.data.last) {
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
        let tweetPage = await TweetDataService.getHomePageTweets(0);
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
      <PostTweet princ={user} />
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
          <Tweet key={tweet.id} tweet={tweet} princ={user} />
        ))}
      </InfiniteScroll>
     
    </Box>
  );
};

export default Home;
