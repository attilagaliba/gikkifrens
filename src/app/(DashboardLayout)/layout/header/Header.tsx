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

  const [degenPrice, setDegenPrice] = useState(0.016445613061035641);
  const [gasFee, setGasFee] = useState(1);

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
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // 60 saniye

    // Temizleme işlemi
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://li.quest/v1/token?chain=8453&token=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
        );
        const result = await response.json();
        setDegenPrice(parseFloat(result.priceUSD).toFixed(4));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // 60 saniye

    // Temizleme işlemi
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <Button variant="contained" disableElevation color="primary">
          Avg Gas Fee = {gasFee.toFixed(0)}
        </Button>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Button variant="contained" disableElevation color="primary">
            $Degen = {degenPrice}
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
