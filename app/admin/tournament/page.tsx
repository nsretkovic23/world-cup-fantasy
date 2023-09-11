"use client";
import { Nation, Tournament } from "@/lib/interfaces/db-data-Interfaces";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function TournamentMaker() {
  const [nations, setNations] = useState<Nation[]>([]);
  const [quarterfinalNation, setQuarterfinalNation] = useState<string>("");
  const [semifinalNation, setSemifinalNation] = useState<string>("");
  const [finalNation, setFinalNation] = useState<string>("");
  const [ttl, setTTL] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/neo4j/nations/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error("Failed to fetch data: " + data.errorMessage);
        } else {
          setNations(data as Nation[]);
        }
      });
  }, []);

  const createTournament = () => {
    if(quarterfinalNation === "" || semifinalNation === "" || finalNation === ""
    || ttl < 30 || ttl > 86400 || name === "") {
        alert("Invalid inputs");
        return;
    }

    let diff = 1;
    switch(difficulty) {
        case "Easy": diff = 1; break;
        case "Medium": diff = 2; break;
        case "Hard": diff = 3; break;
        default: diff = 1; break;
    }

    const tournament = {
        name:name,
        quarterfinals:quarterfinalNation,
        semifinals:semifinalNation,
        final:finalNation,
        ttl:ttl,
        difficulty:diff
    } satisfies Tournament;

    fetch(`http://localhost:3000/api/tournament`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tournament),
    })
      .then((response: Response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error(data.errorMessage);
          alert(data.errorMessage);
        } else {
          alert(`${data.message}`);
        }
      })
      .catch((error) => {
        // Server/db error
        console.log(error);
        alert("Creating player error: " + error);
      });
  }

  const validateAndSetName = (name: string) => {
    const validatedName = name.replace(/[^A-Za-z0-9]/g, "");
    setName(validatedName);
  };

  const tryToSetTTL = (numberstr: string) => {
    if (Number.isNaN(parseInt(numberstr))) {
      return;
    }

    let num = Math.floor(parseInt(numberstr));
    if (num > 86400) num = 86400;
    if (num < 30) num = 30;

    setTTL(num);
  };

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

  const difficultyNames: string[] = ["Easy", "Medium", "Hard"];
  const difficulties: Array<JSX.Element> = [];
  difficultyNames.forEach((diff, ind) => {
    const difficultyItem = (
      <MenuItem key={ind} value={diff}>
        {diff}
      </MenuItem>
    );
    difficulties.push(difficultyItem);
  });

  return (
    <>
      <Box sx={{ display: "flex", maxWidth: "1200px", marginTop: 5 }}>
        <h3 style={{ textDecoration: "none", margin: 0, width: "200px" }}>
          Name
        </h3>
        <TextField
          fullWidth
          id="name"
          label="Tournament name"
          variant="outlined"
          onChange={(e) => validateAndSetName(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", maxWidth: "1200px", marginTop: 5 }}>
        <h3 style={{ textDecoration: "none", margin: 0, width: "200px" }}>
          Quarterfinal opponent
        </h3>
        <FormControl fullWidth>
          <InputLabel>Select Nation</InputLabel>
          <Select
            label={"Select nation"}
            value={quarterfinalNation} //{nationNames.length > 0 ? nationNames[0] : ""}
            onChange={(event: SelectChangeEvent) =>
                setQuarterfinalNation(event.target.value as string)
            }
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
      </Box>
      <Box sx={{ display: "flex", maxWidth: "1200px", marginTop: 5 }}>
        <h3 style={{ textDecoration: "none", margin: 0, width: "200px" }}>
          Semifinal opponent
        </h3>
        <FormControl fullWidth>
          <InputLabel>Select Nation</InputLabel>
          <Select
            label={"Select nation"}
            value={semifinalNation} //{nationNames.length > 0 ? nationNames[0] : ""}
            onChange={(event: SelectChangeEvent) =>
                setSemifinalNation(event.target.value as string)
            }
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
      </Box>
      <Box sx={{ display: "flex", maxWidth: "1200px", marginTop: 5 }}>
        <h3 style={{ textDecoration: "none", margin: 0, width: "200px" }}>
          Final opponent
        </h3>
        <FormControl fullWidth>
          <InputLabel>Select Nation</InputLabel>
          <Select
            label={"Select nation"}
            value={finalNation} //{nationNames.length > 0 ? nationNames[0] : ""}
            onChange={(event: SelectChangeEvent) =>
                setFinalNation(event.target.value as string)
            }
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
      </Box>
      <Box sx={{ display: "flex", maxWidth: "1200px", marginTop: 5 }}>
        <h4 style={{ textDecoration: "none", margin: 0, width: "200px" }}>
          Expires in (seconds, minimum 30)
        </h4>
        <TextField
          fullWidth
          type="number"
          id="ttl"
          label="Time To Live"
          variant="outlined"
          InputProps={{ inputProps: { min: 30 } }}
          onChange={(e) => tryToSetTTL(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", maxWidth: "1200px", marginTop: 5 }}>
        <h3 style={{ textDecoration: "none", margin: 0, width: "200px" }}>
          Difficulty
        </h3>
        <FormControl fullWidth>
          <InputLabel>Select difficulty</InputLabel>
          <Select
            label={"Select difficulty"}
            value={difficulty}
            onChange={(event: SelectChangeEvent) =>
              setDifficulty(event.target.value as string)
            }
            sx={{ maxHeight: "200px", overflowY: "auto", marginRight: "10px" }}
            MenuProps={{
              PaperProps: {
                style: { maxHeight: "200px" },
              },
            }}
          >
            {difficulties}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", maxWidth: "1200px", marginTop: 5 }}>
        <Button fullWidth variant="contained" color="success" onClick={() => createTournament()}>
          Create tournament
        </Button>
      </Box>
    </>
  );
}

export default TournamentMaker;
