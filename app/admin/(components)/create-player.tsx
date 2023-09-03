import { Position, Player, Nation, Rating } from '@/lib/interfaces/db-data-Interfaces';
import { Cancel } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

interface CreateOrEditWindowProps {
  isWindowActive:boolean,
  setIsWindowActive:any,
  selectedNation?:Nation,
  player?:Player,
  setEditingPlayer?:any
}

function CreateOrEditPlayerPopUp({isWindowActive, setIsWindowActive, selectedNation, player, setEditingPlayer} : CreateOrEditWindowProps) {

  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositionString, setSelectedPositionString] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [clubName, setClubName] = useState<string>("");
  const [playerPrice, setPlayerPrice] = useState<number>(5);
  const [playerOverallRating, setPlayerOverallRating] = useState<number>(70);

  useEffect(() => {
    if(player)
    {
      setSelectedPositionString(player.position.position);
      setPlayerName(player.name);
      setClubName(player.club);
      setPlayerPrice(player.price);
      setPlayerOverallRating(player.rating);
    }
  }, [player])

  useEffect(() => {
    if(isWindowActive && positions.length === 0)
    {
      fetch(`http://localhost:3000/api/neo4j/positions/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error("Failed to fetch positions: " + data.errorMessage);
          alert("Failed to fetch positions: " + data.errorMessage);
        } else {
          setPositions(data as Position[]);
        }
      });
    }
  }, [isWindowActive, positions]);


  const positionOptions: Array<JSX.Element> = [];
  positions.forEach((value,key) => {
    const positionItem = (
      <MenuItem key={key} value={value.position}>
        {value.position}
      </MenuItem>
    )
    positionOptions.push(positionItem);
  })

  const handlePositionSelectionChange = (event:SelectChangeEvent) => {
    setSelectedPositionString(event.target.value);
  }

  const isInputValid = (foundPosition:Position|undefined) => {
    return (
       playerName !== ""
    && clubName !== ""
    && playerPrice >= 4 && playerPrice <= 20
    && playerOverallRating >= 50 && playerOverallRating <= 99
    && foundPosition
    && selectedNation)
  }

  const getPlayerDataFromInputs = (foundPosition:Position|undefined) => {
    return {
      name: playerName,
      nation: selectedNation,
      price:playerPrice,
      club:clubName,
      rating: playerOverallRating,
      position:foundPosition
    };
  }

  const controlLog = () => {
    const foundPosition = positions.find((position) => position.position === selectedPositionString);
    const player = getPlayerDataFromInputs(foundPosition);

    alert(`
    NAME:${player.name}
    NATION:${player.nation?.name}
    PRICE:${player.price}
    CLUB:${player.club}
    RATING:${player.rating}
    POSITION:${player.position?.position}`);
  }

  const updatePlayer = () => {
    const foundPosition = positions.find((position) => position.position === selectedPositionString);

    //  controlLog();
    //  return;

    if(!isInputValid(foundPosition)) {
      alert("Invalid input");
      return;
    } 

    const updatedPlayer = getPlayerDataFromInputs(foundPosition);
    console.log(JSON.stringify(updatedPlayer))

    fetch(`http://localhost:3000/api/neo4j/players`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({updatedPlayer, player}),
    })
      .then((response: Response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error(data.errorMessage);
          alert(data.errorMessage);
        } else {
          console.log(data)
          alert(`Updated player: ${data.name}`);
        }
      })
      .catch((error) => {
        // Server/db error
        console.log(error);
        alert("Updating player error: " + error);
      });
  }
  
  const createPlayer = () => {
    const foundPosition = positions.find((position) => position.position === selectedPositionString);

    if(!isInputValid(foundPosition)) {
      alert("Invalid input");
      return;
    } 

     const newPlayer = getPlayerDataFromInputs(foundPosition);
     console.log(JSON.stringify(newPlayer))

     fetch(`http://localhost:3000/api/neo4j/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlayer),
    })
      .then((response: Response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error(data.errorMessage);
          alert(data.errorMessage);
        } else {
          alert(`Created player: ${data.name}`);
        }
      })
      .catch((error) => {
        // Server/db error
        console.log(error);
        alert("Creating player error: " + error);
      });
  }

  // Called when you exit out of the window
  const resetData = () => {
    setSelectedPositionString("")
    setEditingPlayer(undefined)
    setPlayerName("");
    setClubName("");
    setPlayerPrice(5);
    setPlayerOverallRating(70);
  }

  if(!isWindowActive) {
    return null;
  }  

  return (
    <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "20%",
          bottom: 0,
          margin: "0 auto",
          height: "500px",
          width: "500px",
          zIndex: 999,
          backgroundColor: "#cde9f5",
          borderRadius: 5,
          boxShadow: "0 0 7px 5px #888888",
          padding: "5px",
        }}
      >
        <IconButton
          onClick={() => {
            resetData();
            setIsWindowActive(false);
          }}
        >
          <Cancel color="error"></Cancel>
        </IconButton>
        <Typography sx={{marginLeft:"8px"}}>{player ? `EDITING - id:${player.id}` : "CREATING"}</Typography>
        <Typography sx={{marginLeft:"8px"}}>Nationality:{selectedNation?.name}</Typography>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField required id="name-req-field" label="Full name" variant="standard" onChange={(event:any) => setPlayerName(event.target.value as string)} defaultValue={player ? playerName : ""}/>
          <TextField required id="club-req-field" label="Club name" variant="standard" onChange={(event:any) => setClubName(event.target.value as string)} defaultValue={player ? clubName : ""}/>
          <TextField required id="price-req-field" label="Price (4-20)" type="number" inputProps={{min:4, max: 20}} InputLabelProps={{shrink: true}} variant="standard" onChange={(event:any) => setPlayerPrice(parseInt(event.target.value))} defaultValue={player ? player.price : playerPrice}/>
          <TextField required id="price-req-field" label="Rating (50-99)" type="number" inputProps={{min:50, max: 99}} InputLabelProps={{shrink: true}} variant="standard" onChange={(event:any) => setPlayerOverallRating(parseInt(event.target.value))} defaultValue={player ? player.rating : playerOverallRating}/>
          <FormControl fullWidth sx={{marginTop:1}}>
            <InputLabel>Select Position</InputLabel>
            <Select
              label={"Select Position"}
              value={player ? player.position?.position : selectedPositionString}
              onChange={handlePositionSelectionChange}
              sx={{ maxHeight: "150px", maxWidth:"260px", overflowY: "auto", marginRight: "10px" }}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: "150px" },
                },
              }}
            >
              {positionOptions}
            </Select>
        </FormControl>
        <Button fullWidth onClick={player ? updatePlayer : createPlayer} variant="contained" color="primary" sx={{marginTop:5}}>
          Submit
        </Button>
        </Box>
      </Box>
  )
}

export default CreateOrEditPlayerPopUp