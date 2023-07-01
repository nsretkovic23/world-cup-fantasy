import React, { useContext, useEffect } from "react";
import styles from "../page.module.css";
import {
  PlayerSearchFilterContext,
  PlayerSearchFilterContextType,
} from "@/context/player-search-filter-context";
import { Box, Divider } from "@mui/material";
import FoundPlayer from "./found-player";


function FoundPlayersList() {
  const { cost, nation, rating } = useContext(PlayerSearchFilterContext) as PlayerSearchFilterContextType;
  
  // TODO: Make a fetch with selected filters on every change
  useEffect(() => {
    // Fetch here, watch all 3 filters in the dependency list and whenever a filter changes, update player list
    console.log(cost);
    console.log(nation);
    console.log(rating);
  }, [cost, nation, rating]);

  return (
    <Box className={styles.sidebarSectionContainer} sx={{ flexGrow: 1, overflowY:'scroll'}}>
      <Divider flexItem className={styles.divider} sx={{ marginTop: 2, position:'sticky', zIndex:999, top:0, backgroundColor:'white' }}>
        Found players
      </Divider>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
      <FoundPlayer/>
    </Box>
  );
}

export default FoundPlayersList;
