import { Box, Button, Divider, Typography } from "@mui/material";
import styles from "../page.module.css";
import React from "react";
import Image from "next/image";
import { AddCircle, AttachMoney } from "@mui/icons-material";

function FoundPlayer() {
  const flagSrc = "https://flagsapi.com/AR/shiny/64.png";

  return (
    <Box className={styles.playerListContainer}>
      <Box className={styles.playerInListItemContainer}>
        <Box className={styles.playerInListItemName}>
          Leo Messi
        </Box>
        <Divider orientation="vertical" />
        <Image
          src={flagSrc}
          alt={"Argentina"}
          width={35}
          height={35}
          priority
          style={{ marginLeft: 5 }}
        />
        <Divider orientation="vertical" />
        <Box sx={{ display: "flex", padding: "2px" }}>
          <AttachMoney sx={{ marginRight: -0.5 }} color="primary" />
          <Typography>10.7</Typography>
        </Box>
        <Divider orientation="vertical" />
        <Button
          disabled={false}
          sx={{ textTransform: "none" }}
          startIcon={<AddCircle />}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}

export default FoundPlayer;
