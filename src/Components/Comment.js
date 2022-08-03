import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatDistance, parseISO } from "date-fns";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import TweetDataService from "../utils/TweetDataService";

export default function Comment({ comment }) {
  const [user, setUser] = React.useState({});
  const [commentLikes, setCommentLikes] = React.useState(comment.likeCount);
  const [commentLiked, setCommentLiked] = React.useState(comment?.isLiked);
  let navigate = useNavigate();

  if (!user.firstName) {
    user.firstName = "";
  }
  if (!user.lastName) {
    user.lastName = "";
  }

  async function handleUnLikeClick() {
    setCommentLikes((prev) => prev - 1);
    setCommentLiked((prev) => !prev);
    try {
      TweetDataService.unLikeAComment(comment?.id).catch(
        () => {
          setCommentLikes((prev) => prev + 1);
          setCommentLiked((prev) => !prev);
        }
      );
    } catch (Error) {
      
      navigate("/login");
    }
  }

  async function handleLikeClick() {
    setCommentLikes((prev) => prev + 1);
    setCommentLiked((prev) => !prev);
    try {
      TweetDataService.likeAComment(comment?.id).catch(() => {
        setCommentLikes((prev) => prev - 1);
        setCommentLiked((prev) => !prev);
      });
    } catch (Error) {
      navigate("/login");
    }
  }

  React.useEffect(() => {
    async function getUser() {
      try {
        let userData = await TweetDataService.getUserbyId(comment?.loginId);
        setUser(userData.data.data);
      } catch (Error) {
        navigate("/login");
      }
    }
    getUser();
  }, []);

  return (
    <Card
      sx={{
        width: { xs: "90%" },
        marginInline: "auto",
        marginTop: "1vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginLeft: "2vh",
          marginTop: "2vh",
        }}
      >
        <Avatar
          sx={{
            width: "6vh",
            height: "6vh",
          }}
          src={user.image}
        ></Avatar>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } , gap: { xs: "0.1rem" , sm: "0.5rem" }  , alignItems : { sm: "center" }}}>
          <Typography >{`@${comment?.loginId}`}</Typography>
          <Typography>{`${user.firstName + " " + user.lastName}`}</Typography>
        </Box>
        <Typography ml="auto" alignSelf="center" sx={{ marginRight: "2vh" }}>
          {formatDistance(
            parseISO(
              comment?.createdDate
                ? comment?.createdDate
                : "2022-07-31T10:40:12.942+00:00"
            ),
            new Date(),
            { addSuffix: true }
          )}
        </Typography>
      </Box>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {comment?.reply}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          aria-label="add to favorites"
          onClick={commentLiked ? handleUnLikeClick : handleLikeClick}
        >
          {commentLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          <Typography p="0.1rem">{commentLikes}</Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
}
