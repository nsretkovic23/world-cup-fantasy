import React from "react";
import { Star } from "@mui/icons-material";
import { Box, Divider } from "@mui/material";
import styles from "../page.module.css";
import { Stats } from "@/lib/interfaces/db-data-Interfaces";


function Statistics({ stats }: { stats: Stats }) {
  return (
    <Box className={styles.sidebarSectionContainer}>
      <Divider flexItem className={styles.divider}>
        Stats
      </Divider>
        <Box className={styles.statsGroup}>
          <Box className={styles.stat}>
          <p className={styles.boxText}>Pace: {stats.pace}</p>
          </Box>
          <Box className={styles.stat}>
          <p className={styles.boxText}>Shooting: {stats.shooting}</p>
          </Box>
        </Box>
        <Box className={styles.statsGroup} sx={{marginBottom:"10px"}}>
          <Box className={styles.stat}>
          <p className={styles.boxText}>Passing: {stats.passing}</p>
            
          </Box>
          <Box className={styles.stat}>
          <p className={styles.boxText}>Defending: {stats.defending}</p>
          </Box>
        </Box>
    </Box>
  );
}

export default Statistics;
