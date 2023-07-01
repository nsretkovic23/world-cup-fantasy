import React from "react";
import { Box, Divider } from "@mui/material";
import styles from "../page.module.css";

function Name({name}:{name:string}) {
  return (
    <Box className={styles.sidebarSectionContainer}>
      <Divider flexItem className={styles.divider}>Name</Divider>
      <h2>{name}</h2>
    </Box>
  );
}

export default Name;
