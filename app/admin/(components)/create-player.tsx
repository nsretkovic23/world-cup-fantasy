import { Position, Player, Nation, Rating } from '@/lib/interfaces/db-data-Interfaces';
import { Cancel } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { debug } from 'console';
import React, { useEffect, useState } from 'react'

function CreatePlayer({isWindowActive, setIsWindowActive, selectedNation} : {isWindowActive:boolean, setIsWindowActive:any, selectedNation:Nation|undefined}) {

  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position|undefined>(undefined);
  const [selectedPositionString, setSelectedPositionString] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [clubName, setClubName] = useState<string>("");
  const [playerPrice, setPlayerPrice] = useState<number>(0);
  const [playerOverallRating, setPlayerOverallRating] = useState<number>(0);

  useEffect(() => {
    if(isWindowActive && positions.length === 0)
    {
      fetch(`http://localhost:3000/api/neo4j/positions/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error("Failed to fetch data: " + data.errorMessage);
          alert("Failed to fetch data: " + data.errorMessage);
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
  
  const createPlayerOnSubmit = (event:any) => {
    event.preventDefault();
    const foundPosition = positions.find((position) => position.position === selectedPositionString);
    console.log(selectedPositionString);

    if(playerName === ""
    || clubName === ""
    || playerPrice < 4 || playerPrice > 20
    || playerOverallRating < 50 || playerOverallRating > 99
    || !foundPosition
    || !selectedNation) {
      alert("Invalid input");
      return;
    } 

    const getRandomArbitrary = (rating:number) => {
      const min = rating - 10 < 50 ? 50 : rating - 10;
      const max = rating + 10 > 99 ? 99 : rating + 10;      

      return Math.round(Math.random() * (max - min) + min);
    }

    // Randomize stats according to overall rating
    const randomizedRating = {
      overall:playerOverallRating,
      pace: getRandomArbitrary(playerOverallRating),
      shooting: getRandomArbitrary(playerOverallRating),
      passing: getRandomArbitrary(playerOverallRating),
      defending: getRandomArbitrary(playerOverallRating)
    } satisfies Rating;

     const player:Player = {
       name: playerName,
       nation: selectedNation,
       price:playerPrice,
       club:clubName,
       rating: randomizedRating,
       position:foundPosition
     } satisfies Player;

     console.log(JSON.stringify(player))


     fetch(`http://localhost:3000/api/neo4j/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
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
            setIsWindowActive(false);
          }}
        >
          <Cancel color="error"></Cancel>
        </IconButton>
        <Typography sx={{marginLeft:"8px"}}>Nationality:{selectedNation?.name}</Typography>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField required id="name-req-field" label="Full name" variant="standard" onChange={(event:any) => setPlayerName(event.target.value as string)}/>
          <TextField required id="club-req-field" label="Club name" variant="standard" onChange={(event:any) => setClubName(event.target.value as string)}/>
          <TextField required id="price-req-field" label="Price (4-20)" type="number" inputProps={{min:4, max: 20}} InputLabelProps={{shrink: true}} variant="standard" onChange={(event:any) => setPlayerPrice(parseInt(event.target.value))}/>
          <TextField required id="price-req-field" label="Rating (50-99) (stats will be automatically generated)" type="number" inputProps={{min:50, max: 99}} InputLabelProps={{shrink: true}} variant="standard" onChange={(event:any) => setPlayerOverallRating(parseInt(event.target.value))}/>
          <FormControl fullWidth sx={{marginTop:1}}>
            <InputLabel>Select Position</InputLabel>
            <Select
              label={"Select Position"}
              value={selectedPositionString}
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
        <Button fullWidth type='submit' onClick={createPlayerOnSubmit} variant="contained" color="primary" sx={{marginTop:5}}>
          Submit
        </Button>
        </Box>
      </Box>
  )
}

export default CreatePlayer