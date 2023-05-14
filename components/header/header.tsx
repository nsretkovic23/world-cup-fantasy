"use client";
import { AppBar } from "@mui/material";
import React, { useContext, useMemo } from "react";
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
import { SportsSoccer, AccountCircleOutlined } from "@mui/icons-material";
import { UserContext, UserContextType } from "@/context/user-context";
import { useRouter } from "next/navigation";


function Header() {
  const router = useRouter();
  const { user, logoutUser } = useContext(UserContext) as UserContextType;
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

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

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Do not render anything if user is not logged in (usually login page)
  if (!user) return null;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsSoccer sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
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
            World Cup Fantasy
          </Typography>

          {/*xs logo and text setting*/}
          <SportsSoccer sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
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
            WCF
          </Typography>

          {/*Adding space between logo and user picture/settings on md and higher*/}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

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
