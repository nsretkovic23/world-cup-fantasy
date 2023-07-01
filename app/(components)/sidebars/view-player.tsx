import React from 'react'
import styles from './page.module.css';
import { Box, Divider } from '@mui/material';
import Rating from './sections/view-player/rating';
import Name from './sections/view-player/name';
import ClubAndCountry from './sections/view-player/club-country';
import Statistics from './sections/view-player/statistics';
import { Player } from '@/lib/interfaces/db-data-Interfaces';

function ViewPlayer({player}:{player:Player | null}) {
  if(!player) {
    return null;
  }

  return (
    <Box className={styles.sidebarContainer}>
      <Name name="Lionel Messi"/>
      <ClubAndCountry club="Barcelona" nation={player.nation}/>
      <Rating rating={95}/>
      <Statistics stats={player.stats}/>
    </Box>
  )
}

export default ViewPlayer