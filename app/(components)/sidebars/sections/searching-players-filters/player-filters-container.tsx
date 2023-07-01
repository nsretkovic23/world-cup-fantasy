import React, { useContext, useState } from "react";
import styles from "../page.module.css";
import { Box, Divider } from "@mui/material";
import DropDownSelectFilter from "./dropdown-select-filter";
import { menuItemLabelToCost, menuItemLabelToNation } from "@/lib/filter-data";
import RatingFilter from "./rating-filter";
import PositionFilter from "./position-filter";
import {
  PlayerSearchFilterContext,
  PlayerSearchFilterContextType,
} from "@/context/player-search-filter-context";

function PlayerFiltersContainer({ position }: { position: string }) {
  // Taking cost and nation parts of the context because DropDownSelectFilter component
  // Doesn't know which "part/slice" of context to use so it's cleaner that it has this information provided in props
  const { cost, setCost, nation, setNation } = useContext( PlayerSearchFilterContext) as PlayerSearchFilterContextType;

  return (
    <Box className={styles.sidebarSectionContainer}>
      <PositionFilter position="Goalkeeper" />
      <Divider flexItem className={styles.divider}>
        Search for a {position}
      </Divider>
      <Box className={styles.statsGroup}>
        <DropDownSelectFilter
          stateValue={cost}
          stateValueSetter={setCost}
          label="Cost"
          menuItemLabelToValueMap={menuItemLabelToCost}
          containerStyle={{ minWidth: 150, margin: 1, marginBottom: 2 }}
        />
        <DropDownSelectFilter
          stateValue={nation}
          stateValueSetter={setNation}
          label="Nationality"
          menuItemLabelToValueMap={menuItemLabelToNation}
          containerStyle={{ minWidth: 150, margin: 1, marginBottom: 2 }}
        />
      </Box>
      <Divider flexItem className={styles.divider}>
        Choose rating (0 stars for no filter)
      </Divider>
      {/*Rating handles PlayerSearchFilterContext by itself because it knows that it should take rating-part of the context*/}
      <RatingFilter />
    </Box>
  );
}

export default PlayerFiltersContainer;
