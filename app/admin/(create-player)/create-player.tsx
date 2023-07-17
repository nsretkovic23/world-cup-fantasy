import { Cancel } from '@mui/icons-material';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import React from 'react'

function CreatePlayer({isWindowActive, setIsWindowActive, selectedNation} : {isWindowActive:boolean, setIsWindowActive:any, selectedNation:string}) {

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
        <Typography sx={{marginLeft:"8px"}}>Nation:{selectedNation}</Typography>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField required id="name-req-field" label="Full name" variant="standard" />
          <TextField required id="club-req-field" label="Club name" variant="standard" />
          <TextField required id="price-req-field" label="Price" type="number" inputProps={{min:1, max: 99}} InputLabelProps={{shrink: true}} variant="standard" />
          {/*Option field za poziciju, fieldovi za rating, izvuci u zasebnu komponentu*/}
        </Box>
      </Box>
  )
}

export default CreatePlayer