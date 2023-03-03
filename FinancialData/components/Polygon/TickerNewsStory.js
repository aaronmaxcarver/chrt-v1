import useSWR from "swr";

import { format } from "date-fns";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import { grey } from "@mui/material/colors";

const INNER_CARD_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "stretch",
  backgroundColor: grey[100],
};

const STORY_CARD_SX = {
  backgroundColor: grey[400],
  marginBottom: "6px",
};

export default function TickerNewsCardStory(props) {
  let { story } = props;

  let parsedDate = story ? new Date(story?.published_utc) : null;
  let formattedDate = parsedDate ? format(parsedDate, "MM/dd/yyy") : null; // improve date formatting

  return (
    <Box sx={INNER_CARD_SX} key={story.id}>
      <Card sx={STORY_CARD_SX}>
        <Link href={story.article_url}>
          <Typography variant="h6"> {story.title}</Typography>
        </Link>

        <Typography variant="subtitle2"> {story.description}</Typography>

        <Link href={story.publisher.homepage_url}>{story.publisher.name}</Link>

        <Typography>{formattedDate}</Typography>
      </Card>
    </Box>
  );
}
