import React from "react";
import { Box, Divider } from "@mui/material";
import styles from "./page.module.css";
import { Nation } from "@/lib/interfaces/db-data-Interfaces";
import Image from "next/image";

function ClubAndCountry({ club, nation }: { club: string; nation: Nation }) {
  const flagSrc =
    "https://flagsapi.com/" + nation.nationIdentifier + "/shiny/64.png";
  return (
    <Box className={styles.sidebarSectionContainer}>
      <Divider flexItem className={styles.divider}>
        Club And Country
      </Divider>
      <Box className={styles.clubNationContainer}>
        <Box className={styles.boxWithShadow}>
          <p className={styles.boxText}>{club}</p>
        </Box>
        <Box className={styles.boxWithShadow}>
          <p className={styles.boxText}>{nation.name}</p>
          <Image
            src={flagSrc}
            alt={nation.name}
            width={35}
            height={35}
            priority
            style={{ marginLeft: 5 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ClubAndCountry;
