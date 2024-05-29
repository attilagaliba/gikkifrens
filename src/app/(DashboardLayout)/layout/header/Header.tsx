import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { useProfile } from "@farcaster/auth-kit";
import axios from "axios";
// components
import Profile from "./Profile";
import { IconBellRinging, IconMenu } from "@tabler/icons-react";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;

  const [userMinData, setUserMinData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/getUserByFid/${fid}/`);
        setUserMinData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (fid) {
      fetchData();
    }
  }, [fid]);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  const [degenPrice, setDegenPrice] = useState(0.69);
  const [gasFee, setGasFee] = useState(69);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getGas/getMaxFeePerGas");
        const result = await response.json();
        setGasFee(result.result.data / 2251568);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // 60 saniye

    // Temizleme işlemi
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Button variant="contained" disableElevation color="primary">
            Avg Gas Fee = {gasFee.toFixed(0)}
          </Button>
          <Profile userMinData={userMinData} />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
