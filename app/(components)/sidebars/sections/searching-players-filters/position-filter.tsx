import { Box, Divider } from "@mui/material";
import React from "react";
import styles from "../page.module.css";
import {
  BackHandOutlined,
  PsychologyOutlined,
  ShieldOutlined,
  SportsSoccerOutlined,
} from "@mui/icons-material";

const positionIconMapper = new Map();
positionIconMapper.set("Goalkeeper", <BackHandOutlined />);
positionIconMapper.set("Defender", <ShieldOutlined />);
positionIconMapper.set("Midfielder", <PsychologyOutlined />);
positionIconMapper.set("Striker", <SportsSoccerOutlined />);

function PositionFilter({ position }: { position: string }) {
  return (
    <Box className={styles.sidebarSectionContainer}>
      <Divider flexItem className={styles.divider}>
        Position
      </Divider>
      <Box className={styles.rowFlex} style={{marginTop:'15px', marginBottom:'15px'}}>
        <h2 className={styles.textReset}>{position}</h2>
        <div style={{marginLeft:'10px'}}/>
        {positionIconMapper.get(position)}
      </Box>
    </Box>
  );
}

export default PositionFilter;
