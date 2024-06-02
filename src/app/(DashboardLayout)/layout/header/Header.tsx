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
import Link from "next/link";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);

  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    const storedProfile = localStorage.getItem("userProfile");
    if (storedIsAuthenticated && storedProfile) {
      const profile = JSON.parse(storedProfile);
      setFid(profile.fid);
      setDisplayName(profile.displayName);
      setCustody(profile.custody);
    }
  }, []);

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
  const [bleuPrice, setBleuPrice] = useState(0.69);

  const [gasFee, setGasFee] = useState(69);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Degen Price
        const degenResponse = await fetch(
          "https://li.quest/v1/token?chain=8453&token=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
        );
        const degenResult = await degenResponse.json();
        setDegenPrice(parseFloat(parseFloat(degenResult.priceUSD).toFixed(5)));

        // Fetch Bleu Price
        const bleuResponse = await fetch(
          "https://li.quest/v1/token?chain=8453&token=0xBf4Db8b7A679F89Ef38125d5F84dd1446AF2ea3B"
        );
        const bleuResult = await bleuResponse.json();
        setBleuPrice(parseFloat(parseFloat(bleuResult.priceUSD).toFixed(7)));

        // Fetch Gas Fee
        const gasResponse = await fetch("/api/getGas/getMaxFeePerGas");
        const gasResult = await gasResponse.json();
        setGasFee(gasResult.result.data / 2251568);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initial fetch
    fetchData();

    // Set interval to fetch data every 60 seconds
    const intervalId = setInterval(fetchData, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <Box flexGrow={1} />
        <Stack direction="row" spacing={1}>
          <Chip
            avatar={
              <Avatar
                alt="Degen"
                src="https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png?1706198225"
              />
            }
            label={`$${degenPrice}`}
            variant="outlined"
          />
          <Chip
            avatar={
              <Avatar
                alt="Bleu"
                src="https://dd.dexscreener.com/ds-data/tokens/base/0xbf4db8b7a679f89ef38125d5f84dd1446af2ea3b.png?size=lg&key=7c0dda"
              />
            }
            label={`$${bleuPrice}`}
            variant="outlined"
          />
          <Chip
            avatar={
              <Avatar
                alt="Gas"
                src="https://www.alfafrens.com/_next/image?url=%2Ficon-64.png&w=96&q=75"
              />
            }
            label={`Avg Gas Fee = ${gasFee.toFixed(2)}`}
            variant="outlined"
          />
          <Chip label={`${displayName}`} variant="outlined" />
        </Stack>
        <Stack spacing={1} direction="row" alignItems="center">
          <a href={"/logout"}>
            <Chip label={`Logout`} variant="outlined" />
          </a>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
