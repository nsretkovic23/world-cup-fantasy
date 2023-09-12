"use client";
import { Nation, Player } from "@/lib/interfaces/db-data-Interfaces";
import { Box, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";

function AdminPanel() {
  return (
    <Box sx={flexColumnCenter}>
      <Typography variant="h3" sx={{ margin: 5 }}>
        Admin Dashboard
      </Typography>
      <Box sx={{ flexColumnCenter }}>
        <Box sx={{ display: "flex" }}>
          <Box sx={tileStyle}>
            <Link
              href="/admin/playersdashboard"
              style={{ color: "white", textDecoration: "none" }}
            >
              Players Dashboard
            </Link>
          </Box>
          <Box sx={tileStyle}>
            <Link
              href="/admin/tournament"
              style={{ color: "white", textDecoration: "none" }}
            >
              Tournament Maker
            </Link>
          </Box>
          <Box sx={tileStyle}>
            <Link
              href="/admin/cachedashboard"
              style={{ color: "white", textDecoration: "none" }}
            >
              Cache dashboard
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const flexColumnCenter = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const tileStyle = {
  height: "200px",
  width: "200px",
  margin: 3,
  backgroundColor: "#1976D2",
  border: "1px solid black",
  borderRadius: 3,
  ...flexColumnCenter,
};

export default AdminPanel;
