import React, { useContext, useEffect } from 'react'
import styles from './page.module.css';
import { Box, Divider } from '@mui/material';
import PlayerFiltersContainer from './sections/searching-players-filters/player-filters-container';
import { PlayerSearchFilterContext, PlayerSearchFilterContextType } from '@/context/player-search-filter-context';
import FoundPlayersList from './sections/searching-players-filters/found-players-list';

// TODO: Provide position prop from somewhere
function SearchPlayers() {

  const {cost, nation, rating} = useContext(PlayerSearchFilterContext) as PlayerSearchFilterContextType;

  return (
    <Box className={styles.sidebarContainer}>
      <PlayerFiltersContainer position='Goalkeeper'/>
      <FoundPlayersList/>
    </Box>
  )
}

export default SearchPlayers;