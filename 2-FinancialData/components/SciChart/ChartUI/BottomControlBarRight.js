import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

export default function BottomControlBarRight(props) {
  // let {} = props;
  return (
    <Stack direction="row" spacing={0.5}>
      <Paper
        sx={{
          backgroundColor: "#888",
        }}
      >
        (Twitter)
      </Paper>
      <Paper
        sx={{
          backgroundColor: "#888",
        }}
      >
        (Discord)
      </Paper>
      <Paper
        sx={{
          backgroundColor: "#888",
        }}
      >
        (JPEG Download)
      </Paper>
      <Paper
        sx={{
          backgroundColor: "#888",
        }}
      >
        (copy URL to clipboard)
      </Paper>
    </Stack>
  );
}
