import { Box, Button, Divider, Typography } from "@mui/material";
import styles from "../page.module.css";
import React from "react";
import Image from "next/image";
import { AddCircle, AttachMoney } from "@mui/icons-material";
import { Player } from "@/lib/interfaces/db-data-Interfaces";

function FoundPlayer({player}:{player:Player}) {
  const flagSrc = `https://flagsapi.com/${player.nation.nationIdentifier}/shiny/64.png`;

  return (
    <Box className={styles.playerListContainer}>
      <Box className={styles.playerInListItemContainer}>
        <Box className={styles.playerInListItemName}>
          {player.name}
        </Box>
        <Divider orientation="vertical" />
        <Image
          src={flagSrc}
          alt={player.nation.name}
          width={35}
          height={35}
          priority
          style={{ marginLeft: 5 }}
        />
        <Divider orientation="vertical" />
        <Box sx={{ display: "flex", padding: "2px" }}>
          <AttachMoney sx={{ marginRight: -0.5 }} color="primary" />
          <Typography>{player.price}</Typography>
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
