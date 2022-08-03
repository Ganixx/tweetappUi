import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SaveIcon from "@mui/icons-material/Save";
import TwitterIcon from "@mui/icons-material/Twitter";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { formatDistance, parseISO } from "date-fns";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import TweetDataService from "../utils/TweetDataService";
import Comments from "./Comments";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Tweet({ tweet, princ }) {
  const [expanded, setExpanded] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [tweetLikes, setTweetLikes] = React.useState(tweet?.likeCount);
  const [tweetLiked, setTweetLiked] = React.useState(tweet?.isLiked);
  const [tweetDeleted, setTweetDeleted] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [editText, setEditText] = React.useState("");
  const[commentCount, setCommentCount] = React.useState(tweet?.replyCount);
  let navigate = useNavigate();

  if (!user.firstName) {
    user.firstName = "";
  }
  if (!user.lastName) {
    user.lastName = "";
  }

  async function handleUpdateTweet() {
    if (editMode && editText.length > 0) {
      try {
        await TweetDataService.updateATweet(princ?.data.loginId, tweet?.id, {
          tweetDescription: editText,
        });
      } catch (Error) {
        setEditMode((prev) => !prev);
        navigate("/login");
      }
    }
    setEditMode((prev) => !prev);
  }

  async function handleDeleteTweet() {
    setTweetDeleted(true);
    try {
      await TweetDataService.deleteATweet(princ?.data.loginId, tweet?.id);
    } catch (Error) {
      setTweetDeleted(false);
      navigate("/login");
    }
  }

  async function handleUnLikeClick() {
    setTweetLikes((prev) => prev - 1);
    setTweetLiked((prev) => !prev);
    try {
      TweetDataService.unlikeATweet(princ?.data.loginId, tweet?.id).catch(
        () => {
          setTweetLikes((prev) => prev + 1);
          setTweetLiked((prev) => !prev);
        }
      );
    } catch (Error) {
      navigate("/login");
      navigate("/login");
    }
  }

  async function handleLikeClick() {
    setTweetLikes((prev) => prev + 1);
    setTweetLiked((prev) => !prev);
    try {
      TweetDataService.likeATweet(princ?.data.loginId, tweet?.id).catch(() => {
        setTweetLikes((prev) => prev - 1);
        setTweetLiked((prev) => !prev);
      });
    } catch (Error) {
      navigate("/login");
      navigate("/login");
    }
  }
  React.useEffect(() => {
    async function getUser() {
      try {
        let userData = await TweetDataService.getUserbyId(tweet.loginId);
        setUser(userData.data.data);
      } catch (Error) {
        navigate("/login");
      }
    }
    getUser();
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (tweetDeleted) {
    return <></>;
  }

  return (
    <Card
      sx={{
        width: { xs: "92vw", md: "60vw" },
        marginInline: "auto",
        marginTop: "1vh",
      }}
    >
      <CardHeader
        avatar={<Avatar src={user.image}></Avatar>}
        action={
          <IconButton>
            <TwitterIcon
              sx={{
                color: "#1DA1F2",
              }}
            />
          </IconButton>
        }
        title={`@${tweet?.loginId}`}
        subheader={`${user.firstName + " " + user.lastName}`}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          contentEditable={editMode}
          onInput={(e) => setEditText(e.currentTarget.textContent)}
          suppressContentEditableWarning={editMode}
        >
          {tweet?.tweetDescription}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          aria-label="add to favorites"
          onClick={tweetLiked ? handleUnLikeClick : handleLikeClick}
        >
          {tweetLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          <Typography p="0.1rem">{tweetLikes}</Typography>
        </IconButton>
        <IconButton aria-label="edit tweet" onClick={handleUpdateTweet}>
          {tweet?.isOwner && editMode ? (
            <SaveIcon />
          ) : (
            tweet?.isOwner && <EditIcon />
          )}
        </IconButton>
        <Typography m="auto">
          {formatDistance(
            parseISO(
              tweet?.createdDate
                ? tweet?.createdDate
                : "2022-07-31T10:40:12.942+00:00"
            ),
            new Date(),
            { addSuffix: true }
          )}
        </Typography>
        <IconButton aria-label="delete tweet" onClick={handleDeleteTweet}>
          {tweet?.isOwner && <DeleteForeverIcon />}
        </IconButton>
        
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show comments"
        >
          <QuestionAnswerIcon />
        </ExpandMore>
        <Typography m="1vh" variant="body2" color="text.secondary">
          {commentCount}
        </Typography>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider color="#1DA1F2" />
        <div style={{ height: "35vh", overflow: "auto" }}>
          <Comments
            tweetId={tweet?.id}
            princ={princ}
            setCommentCount = {setCommentCount}
          />
          <Typography variant="body2" color="primary" textAlign="center" m={2}>
            End of Comments
          </Typography>
        </div>
      </Collapse>
    </Card>
  );
}
