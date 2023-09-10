"use client";
import { AppBar, Button } from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { SportsSoccer, AccountCircleOutlined, EmojiEvents } from "@mui/icons-material";
import { UserContext, UserContextType } from "@/context/user-context";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";
import io from 'socket.io-client';


function Header() {
  const router = useRouter();
  const { user, logoutUser } = useContext(UserContext) as UserContextType;
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(
    null
  );
  const [tournamentAvailable, setTournamentAvailable] = useState<boolean>(false);

  const settingsMap = useMemo(() => {
    const map = new Map();
    map.set("Profile", () => {
      router.push(user ? "/user/" + user.id : "/");
      setAnchorElUser(null);
    });
    map.set("Logout", () => {
      setAnchorElUser(null);
      logoutUser();
    });
    return map;
  }, [router, user, logoutUser]);

  // Showing button for playing tournaments when tournament gets created
  useEffect(() => {
      const socket = io('http://localhost:8080', {
        transports: ['websocket'],
        withCredentials: true
      });

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      // Subscribe to the Redis channel
      socket.on('message', (message) => {
          const msg = JSON.parse(message);
          if(msg.type === "TournamentCreated") {

            console.log("New tournament available...enabling button");
            setTournamentAvailable(true);
          } else if(msg.type === "TournamentExpired") {

            console.log("Tournament expired, disabling button");
            setTournamentAvailable(false);
          }
      });

      return () => {
        socket.disconnect();
      };
  }, [])

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const segment = useSelectedLayoutSegments();
  // Do not render anything if user is not logged in (usually login page)
  if (segment.includes("login")) return null;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsSoccer sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link href="/" style={{textDecoration:'none', color:'white'}}>World Cup Fantasy</Link>
          </Typography>


          {/*xs logo and text setting*/}
          <SportsSoccer sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link href="/" style={{textDecoration:'none', color:'white'}}>WCF</Link>
          </Typography>

          {/*Adding space between logo and user picture/settings on md and higher*/}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }}}></Box>
          <Button variant="contained" sx={{marginRight:50, alignSelf:'center'}} color="error" startIcon={<EmojiEvents/>}>
            <Link href="/admin" style={{textDecoration:'none', color:'white'}}>Tournament</Link>
          </Button>
          <Link href="/admin" style={{marginRight:"20px", textDecoration:'none', color:'white'}}>Admin Panel</Link>

          {/*User picture and user settings*/}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user ? user.username : "User"}
                  sx={{ boxShadow: 10, bgcolor: "#05BFDB" }}
                >
                  <AccountCircleOutlined />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/*Mapping settingsMap's key to MenuItem text and value(function) to onClick prop*/}
              {Array.from(settingsMap.entries()).map(([setting, func]) => (
                <MenuItem key={setting} onClick={func}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
