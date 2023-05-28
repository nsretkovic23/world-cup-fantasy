import { Star } from "@mui/icons-material";
import { Box, Divider } from "@mui/material";
import styles from "./page.module.css";

function getRatingToStarsRatio(rating: number) {
  if (rating < 60) return 1;
  else if (rating < 70) return 2;
  else if (rating < 80) return 3;
  else if (rating < 90) return 4;
  else if (rating >= 90) return 5;

  return 0;
}

function Rating({rating}:{rating:number}) {
  let stars = getRatingToStarsRatio(rating);
  const starIcons = Array.from({ length: stars }).map((_, index) => (
    <Star key={index} sx={{ color: "orange" }} />
  ));

  return (
    <Box className={styles.sidebarSectionContainer}>
      <Divider flexItem className={styles.divider}>Rating</Divider>
      <Box className={styles.ratingNumberAndStars}>
        <h2 className={styles.textReset}>{rating}</h2>
        {starIcons}
      </Box>
    </Box>
  );
}

export default Rating;
