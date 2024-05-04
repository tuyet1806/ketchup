import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const Star = ({ star }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Rating
        name="half-rating-read"
        defaultValue={2.5}
        precision={star}
        readOnly
      />
      {star}
    </Stack>
  );
};

export default Star;
