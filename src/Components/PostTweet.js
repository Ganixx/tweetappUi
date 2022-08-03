import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import TwitterIcon from "@mui/icons-material/Twitter";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import TweetDataService from "../utils/TweetDataService";

export default function PostTweet({ princ }) {
  const [editMode, setEditMode] = React.useState(false);
  const [editText, setEditText] = React.useState("");
  let navigate = useNavigate();

  async function handleUpdateTweet() {
    if (editMode && editText.length > 0) {
      try {
        await TweetDataService.addTweet(princ?.data.loginId, {
          tweetDescription: editText,
        });
        navigate("/profile");
      } catch (Error) {
        setEditMode((prev) => !prev);
        navigate("/login");
      }
    }
    setEditMode((prev) => !prev);
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
        avatar={<Avatar src={princ?.data.image}></Avatar>}
        action={
          <IconButton aria-label="edit tweet" onClick={handleUpdateTweet}>
            {editMode ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        }
        title={`@${princ?.data.loginId}`}
        subheader={"Post a tweet"}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          contentEditable={editMode}
          onInput={(e) => setEditText(e.currentTarget.textContent)}
          suppressContentEditableWarning={editMode}
          sx={{
            border: "1px solid",
            borderColor: "#1DA1F2",
            margin: "2vw",
            padding: "1vw",
            borderRadius: "5px",
          }}
        >
          {editMode ? "" : "What's happening?"}
        </Typography>
      </CardContent>
    </Card>
  );
}
