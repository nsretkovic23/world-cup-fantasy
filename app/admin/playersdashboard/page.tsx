"use client";
import { Nation, Player, Position } from "@/lib/interfaces/db-data-Interfaces";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Search, DeleteForever, Edit, Add } from "@mui/icons-material";
import CreateOrEditPlayerPopUp from "../(components)/create-player";

function AdminPlayersDashboard() {
  const [nations, setNations] = useState<Nation[]>([]);
  const [selectedNation, setSelectedNation] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [isPlayerEditOrCreateWindowActive, setPlayerEditOrCreateWindowFlag] = useState<boolean>(false);
  const [playerForEditing, setPlayerForEditing] = useState<Player|undefined>(undefined);

  useEffect(() => {
    fetch(`http://localhost:3000/api/neo4j/nations/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error("Failed to fetch data: " + data.errorMessage);
          alert("Failed to fetch data: " + data.errorMessage);
        } else {
          setNations(data as Nation[]);
        }
      });
  }, []);

  // Storing nations only as strings (their names) so that I can sort them here alphabetically, because in nations state they are not sorted
  const nationNames: string[] = nations.map((nation) => nation.name).sort();
  const nationOptions: Array<JSX.Element> = [];
  nationNames.forEach((value, key) => {
    const nationItem = (
      <MenuItem key={key} value={value}>
        {value}
      </MenuItem>
    );
    nationOptions.push(nationItem);
  });

  const playerList: Array<JSX.Element> = players.map((player) => (
    <li
      key={player.id}
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid gray",
        backgroundColor: "#eaebe8",
        borderRadius: 10,
        marginBottom: "5px",
        padding: "5px",
      }}
    >
      <span style={{ width: "350px", border: "1px solid red" }}>
        {player.name}
      </span>
      <span style={{ width: "50px" }}>id:{player.id}</span>
      <span style={{ width: "50px" }}>Price:{player.price}</span>
      <span style={{ width: "200px" }}>{player.club}</span>
      <span style={{ width: "200px" }}>Rating: {player.rating > 0 ? player.rating : `upd. rating!: 0`}</span>
      <span>
        <Button
          variant="contained"
          onClick={() => {
            if(!isPlayerEditOrCreateWindowActive){
              setPlayerForEditing(player);
              setPlayerEditOrCreateWindowFlag(true);
            }
          }}
          startIcon={<Edit />}
          sx={{ marginRight: 1 }}
        >
          {" "}
          Edit
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            
          }}   
          startIcon={<DeleteForever />}
        >
          {" "}
          Delete
        </Button>
      </span>
    </li>
  ));

  const handleNationSelectionChange = (event: SelectChangeEvent) => {
    setSelectedNation(event.target.value as string);
  };

  const fetchPlayers = () => {
    fetch(`http://localhost:3000/api/neo4j/players/${selectedNation}`)
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
  };

  return (
    <Box sx={{ margin: 3 }}>
      <CreateOrEditPlayerPopUp isWindowActive={isPlayerEditOrCreateWindowActive} setIsWindowActive={setPlayerEditOrCreateWindowFlag} selectedNation={nations.find((nat) => nat.name === selectedNation)} player={playerForEditing} setEditingPlayer={setPlayerForEditing} refetchPlayers={fetchPlayers}/>

      <Box sx={{ display: "flex", maxWidth: "1200px" }}>
        <FormControl fullWidth>
          <InputLabel>Select Nation</InputLabel>
          <Select
            label={"Select nation"}
            value={selectedNation} //{nationNames.length > 0 ? nationNames[0] : ""}
            onChange={handleNationSelectionChange}
            sx={{ maxHeight: "200px", overflowY: "auto", marginRight: "10px" }}
            MenuProps={{
              PaperProps: {
                style: { maxHeight: "200px" },
              },
            }}
          >
            {nationOptions}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={fetchPlayers}
          startIcon={<Search />}
          sx={{ textTransform: "none", minWidth: "100px", marginRight: 1 }}
        >
          Search
        </Button>
        {playerList.length > 0 ? (
          <Button
            variant="contained"
            onClick={() => {
              if (!isPlayerEditOrCreateWindowActive)
                setPlayerEditOrCreateWindowFlag(true);
            }}
            startIcon={<Add />}
            sx={{ textTransform: "none", minWidth: "150px" }}
          >
            Create Player
          </Button>
        ) : null}

      </Box>
      {playerList.length > 0 ? (
        <ul style={{ margin: 0, marginTop: 5, padding: 0 }}>{playerList}</ul>
      ) : null}

    </Box>
  );
}

export default AdminPlayersDashboard;
