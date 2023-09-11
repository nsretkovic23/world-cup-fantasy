"use client";
import { UserContext, UserContextType } from "@/context/user-context";
import { Team, Tournament } from "@/lib/interfaces/db-data-Interfaces";
import { EmojiEvents, SportsSoccer } from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

const emptyTournament = {
  name: "South Africa",
  quarterfinals: "Spain",
  semifinals: "Portugal",
  final: "Argentina",
  ttl: -1,
  difficulty:2
} satisfies Tournament;

const getDifficulty = (diff:number) => {
  if(diff < 1) return "Easy";
  
  switch(diff) {
    case 1:
      return "Easy";
    case 2:
      return "Medium";
    case 3:
      return "Hard";
  }

  if(diff > 3) return "Hard";
}

const getTeamOverallRating = (team:Team|undefined) => {
  if(!team) return 0;
  let ratings : number[] = [];
  ratings.push(team.goalkeeper[0].rating);
  team.defenders.forEach(def => ratings.push(def.rating));
  team.midfielders.forEach(mid => ratings.push(mid.rating));
  team.strikers.forEach(st => ratings.push(st.rating));

  return (ratings.reduce((x,y) => x + y) / 11).toFixed(0);
}

function Tournament({ params }: { params: { name: string } }) {
  const [tournament, setTournament] = useState<Tournament>(emptyTournament);
  const { user } = useContext(UserContext) as UserContextType;
  const [tournamentResults, setTournamentResults] = useState<Array<JSX.Element>>([]);
  const [tournamentOutcome, setTournamentOutcome] = useState<[boolean, string]>([false, ""]);
  
  useEffect(() => {
    console.log("poziva se useeffect")
    // fetch(`http://localhost:3000/api/tournament/${params.name}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.errorMessage) {
    //       console.error(data.errorMessage);
    //       alert("Failed to fetch data: " + data.errorMessage);
    //     } else {
    //       console.log(data);
    //       setTournament(data);
    //     }
    //   });
    console.log(user?.team);
  }, [params.name, user]);

  function playTournament() {
    setTournamentResults([]);
    setTournamentOutcome([false, "WON"]);
    
    const results: Array<JSX.Element> = [];
    for(let i = 0; i < 3; i++) {
      const [myGoals, opponentGoals, outcome] = generateGameResult(85, 2);
      const opponents = [tournament.quarterfinals, tournament.semifinals, tournament.final];
      const stage = ["Quarterfinal", "Semifinal", "Final"];
  
      const result = ( 
      <div key={i} style={{backgroundColor:outcome === "WON" ? 'green': 'red', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', border: '1px solid black', height: '180px', width: '400px', borderRadius: 7}}>
            <p style={{textDecoration:'none', margin:0}}>{stage[i]} vs {opponents[i]}</p>
            <h1>{outcome}</h1>
            <h3>{`${myGoals}:${opponentGoals}`}</h3>
      </div> 
      )
      
      results.push(result);
      if(outcome === "LOST") {
        setTournamentOutcome([true, "LOST"])
        break;
      } else {
        setTournamentOutcome([true, "WON"]);
      }
    }
    setTournamentResults(results);
  }

  function generateGameResult(overall:number, difficulty:number) : [number,number,string] {
    // Define base scoring probabilities based on overall rating
    const overallScoringProbabilities:any = {
      0: 0.1,  // Lowest overall rating
      20: 0.2,
      40: 0.3,
      60: 0.4,
      80: 0.5, // Average overall rating
      100: 0.6, // Highest overall rating
    };
  
    // Calculate scoring probabilities based on overall rating
    let scoringProbability:number = 0.5; // Default to average rating
    for (const key of Object.keys(overallScoringProbabilities)) {
      if (overall <= parseInt(key)) {
        scoringProbability = overallScoringProbabilities[key];
        break;
      }
    }
  
    // Adjust scoring probability based on difficulty
    if (difficulty === 1) {
      scoringProbability += 0.2; // Easy
    } else if (difficulty === 3) {
      scoringProbability -= 0.2; // Hard
    }
  
    // Generate random goals for your team, capped at 5
    const myGoals:number = Math.random() < scoringProbability ? Math.min(Math.floor(Math.random() * 6), 5) : 0;
  
    // Generate random goals for the opponent, capped at 5
    const opponentGoals:number = Math.random() < scoringProbability ? Math.min(Math.floor(Math.random() * 6), 5) : 0;
  
    // Determine the outcome
    let outcome:string;
    if (myGoals > opponentGoals) {
      outcome = 'WON';
    } else if (myGoals < opponentGoals) {
      outcome = 'LOST';
    } else {
      return  generateGameResult(overall, difficulty);// In case of a tie
    }
  
    return [myGoals, opponentGoals, outcome];
  }
  
  //if(tournament === emptyTournament) return null;
  if(user) {
    if(user.team) {
      if(user.team.goalkeeper.length !== 1
        || user.team.defenders.length !== 4
        || user.team.midfielders.length !== 4
        || user.team.strikers.length !== 2) {
          return (
            <div style={{textAlign:'center', marginTop: 20}}>
              Complete your team before you can compete in tournaments
            </div>)
        }
    }
  }
  

  return (
    <div style={{display:'flex', flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <div style={{display:'flex', flex:1}}>
        <EmojiEvents sx={{marginTop:3}}/>
        <h1 style={{textDecoration:'none', marginLeft: 5, marginRight: 5}}>{tournament.name}</h1>
        <SportsSoccer sx={{marginTop:3}}/>
      </div>
      <p style={{textDecoration:'none', marginTop:-3}}>Difficulty: {getDifficulty(tournament.difficulty)}</p>
      <Divider flexItem/>
      <h3>Quarterfinal: {tournament.quarterfinals}</h3>
      <Divider flexItem/>
      <h3>Semifinal: {tournament.semifinals}</h3>
      <Divider flexItem/>
      <h3>Final: {tournament.final}</h3>
      <Divider flexItem/>
      <h5>Your team overall rating: {getTeamOverallRating(user?.team)}</h5>
      <Divider flexItem/>
      <Button variant="contained" color="success" sx={{margin:3}} onClick={() => playTournament()}>
        Play
      </Button>
      <div style={{display:'flex', flex:1, minHeight: '200px', width:'100%', justifyContent:'space-evenly'}}>
        {tournamentResults}
      </div>
      {tournamentOutcome[0] ? 
      <h1>
        You {tournamentOutcome[1]} the tournament!
      </h1> 
      : null}
    </div>
  );
}

export default Tournament;
