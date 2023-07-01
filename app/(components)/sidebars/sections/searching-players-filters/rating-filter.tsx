import { PlayerSearchFilterContext, PlayerSearchFilterContextType } from "@/context/player-search-filter-context";
import { Rating } from "@mui/material";
import React, { useContext } from "react";

function RatingFilter() {
  
  const { rating, setRating } = useContext(PlayerSearchFilterContext) as PlayerSearchFilterContextType;

  const handleRatingSetting = (newRating: number | null) => {
    if(setRating) {
      setRating(newRating === null ? 0 : newRating);
    }
  };

  return (
    <Rating
      name="rating-filter-controlled"
      value={rating}
      onChange={(event, newRating) => {
        handleRatingSetting(newRating);
      }}
    />
  );
}

export default RatingFilter;
