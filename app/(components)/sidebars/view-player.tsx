import React from 'react'
import styles from './page.module.css';
import { Box, Divider } from '@mui/material';
import Rating from './sections/rating';
import Name from './sections/name';
import ClubAndCountry from './sections/club-country';
import Statistics from './sections/statistics';
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