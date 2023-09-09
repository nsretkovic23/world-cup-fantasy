import React from 'react'
import styles from './page.module.css';
import { Box } from '@mui/material';
import Rating from './sections/view-player/rating';
import Name from './sections/view-player/name';
import ClubAndCountry from './sections/view-player/club-country';
import { Player } from '@/lib/interfaces/db-data-Interfaces';

function ViewPlayer({player}:{player:Player | null}) {
  if(!player) {
    return null;
  }

  return (
    <Box className={styles.sidebarContainer}>
      <Name name={player.name}/>
      <ClubAndCountry club={player.club} nation={player.nation}/>
      <Rating rating={player.rating}/>
    </Box>
  )
}

export default ViewPlayer