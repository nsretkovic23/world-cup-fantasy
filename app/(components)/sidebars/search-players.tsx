import React, { useContext, useEffect, useState } from 'react'
import styles from './page.module.css';
import { Box } from '@mui/material';
import PlayerFiltersContainer from './sections/searching-players-filters/player-filters-container';
import { PlayerSearchFilterContext, PlayerSearchFilterContextType } from '@/context/player-search-filter-context';
import FoundPlayersList from './sections/searching-players-filters/found-players-list';
import { Player } from '@/lib/interfaces/db-data-Interfaces';
import { menuItemLabelToNation } from '@/lib/filter-data';

function determineMinAndMaxCost(cost:any) {
  let minCost = 0, maxCost = 0;
  if(!Number(cost)) {
    return [0,0];
  }
  switch(Number(cost)) {
    case 0:
      break;
    case 7:
      minCost = 4; maxCost = 6;
      break;
    case 10:
      minCost = 7; maxCost = 9;
      break;
    case 15:
      minCost = 10; maxCost = 14;
      break;
    default:
      minCost = 0; maxCost = 0;
  }

  return [minCost, maxCost];
}

function determineMinAndMaxRating(rating:any) {
  let minRating = 0, maxRating = 0;
  if(!Number(rating)) {
    return [0,0];
  }
  switch(Number(rating)) {
    case 0:
      break;
    case 1:
      minRating = 1; maxRating = 60;
      break;
    case 2:
      minRating = 61; maxRating = 70;
      break;
    case 3:
      minRating = 71; maxRating = 80;
      break;
    case 4:
      minRating = 81; maxRating = 90;
      break;
    case 5:
      minRating = 91; maxRating = 100;
      break;
    default:
      minRating = 0; maxRating = 0;
  }

  return [minRating, maxRating];
}

function SearchPlayers({position, onPlayerAdded} : {position:string, onPlayerAdded:any}) {

  const {cost, nation, rating} = useContext(PlayerSearchFilterContext) as PlayerSearchFilterContextType;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    let [minCost, maxCost] = determineMinAndMaxCost(cost) as Number[];
    let [minRating, maxRating] = determineMinAndMaxRating(rating) as Number[];
    //console.log(`COST: ${minCost}/${maxCost} --- RATING: ${minRating}/${maxRating} --- POS: ${position} --- NAT: ${menuItemLabelToNation.get(nation)}`);

    const nationName = nation === "AllNations" ? "AllNations" : menuItemLabelToNation.get(nation);
    fetch(`http://localhost:3000/api/neo4j/players/${position}/${nationName}/${minCost}/${maxCost}/${minRating}/${maxRating}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error("Failed to fetch data: " + data.errorMessage);
          alert("Failed to fetch data: " + data.errorMessage);
        } else {
          console.log(data);
          setPlayers(data as Player[]);
        }
      });

  }, [cost, nation, rating, position])

  return (
    <Box className={styles.sidebarContainer}>
      <PlayerFiltersContainer position={position}/>
      <FoundPlayersList players={players} onPlayerAdded={onPlayerAdded}/>
    </Box>
  )
}

export default SearchPlayers;