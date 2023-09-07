import styles from "../page.module.css";
import { Box, Divider } from "@mui/material";
import FoundPlayer from "./found-player";
import { Player } from "@/lib/interfaces/db-data-Interfaces";


function FoundPlayersList({players, onPlayerAdded}:{players:Player[], onPlayerAdded:any}) {
  if(players.length > 0)
    console.log(players[0])

  const playerList = players.map((player) => (
    <FoundPlayer key={player.id} player={player} onPlayerAdded={onPlayerAdded}/>
  ))

  return (
    <Box className={styles.sidebarSectionContainer} sx={{ flexGrow: 1, overflowY:'scroll'}}>
      <Divider flexItem className={styles.divider} sx={{ marginTop: 2, position:'sticky', zIndex:999, top:0, backgroundColor:'white' }}>
        Found players
      </Divider>
      {playerList}
    </Box>
  );
}

export default FoundPlayersList;
