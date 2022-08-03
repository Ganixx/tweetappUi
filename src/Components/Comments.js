import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useNavigate } from "react-router-dom";
import TweetDataService from "../utils/TweetDataService";
import Comment from "./Comment";
import PostComment from "./PostComment";

function Comments({ tweetId, princ ,setCommentCount }) {
  const [comments, setComments] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  let navigate = useNavigate();

  async function handleNewComment(comment) {
    setComments((prev) => [comment, ...prev]);
    setCommentCount((prev) => prev + 1);
  }

  async function getComments(page) {
    try {
      let commentPage = await TweetDataService.getTweetComments(tweetId, page);
      let temp = commentPage.data.data.content;
      if (commentPage.data.data.last) {
        setHasMore(false);
      }
      if (page == 0) {
        setComments(temp);
      } else {
        setComments((prev) => [...prev, ...temp]);
      }
    } catch (Error) {
      console.log(Error);
      navigate("/login");
    }
  }

  return (
    <>
      <PostComment
        princ={princ}
        tweetId={tweetId}
        handleNewComment={handleNewComment}
      />
      <InfiniteScroll
        pageStart={-1}
        loadMore={getComments}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
        useWindow={false}
      >
        {comments?.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
      </InfiniteScroll>
    </>
  );
}

export default Comments;
