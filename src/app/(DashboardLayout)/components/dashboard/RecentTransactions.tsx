import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Link, Typography } from "@mui/material";
import { Key } from "react";

interface Props {
  userRecentTransactions: any;
  limit: number;
}

interface ColorAndLabel {
  color: "success" | "error" | "secondary" | "grey" | "inherit" | "primary" | "info" | "warning";
  label: string;
}

const getColorAndLabel = (action: any): ColorAndLabel => {
  switch (action) {
    case "withdraw":
      return { color: "success", label: "Withdraw" };
    case "gas":
      return { color: "error", label: "Gas" };
    case "deposit":
      return { color: "secondary", label: "Deposit" };
    default:
      return { color: "grey", label: "Unknown" };
  }
};

const RecentTransactions: React.FC<Props> = ({ userRecentTransactions, limit }) => {
  const getTimeDifferenceInMinutes = (timestamp: string) => {
    const now = Date.now() / 1000; // current time in seconds
    const differenceInSeconds = now - parseInt(timestamp);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    return differenceInMinutes;
  };

  const getTimeDifferenceFormatted = (differenceInMinutes: number) => {
    if (differenceInMinutes < 60) {
      return `${differenceInMinutes}m`;
    } else if (differenceInMinutes < 24 * 60) {
      const hours = Math.floor(differenceInMinutes / 60);
      const remainingMinutes = differenceInMinutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    } else if (differenceInMinutes < 30 * 24 * 60) {
      const days = Math.floor(differenceInMinutes / (24 * 60));
      return `${days}d`;
    } else {
      const years = Math.floor(differenceInMinutes / (365 * 24 * 60));
      return `${years}y`;
    }
  };

  return (
    <DashboardCard title="Recent Transactions">
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,
            mb: "-40px",
            "& .MuiTimelineConnector-root": {
              width: "1px",
              backgroundColor: "#efefef",
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >

          {userRecentTransactions.slice(0, limit).map((transaction: { action: any; value: any; date: any; }, index: Key | null | undefined) => {
            const { action, value, date } = transaction;
            const { color, label } = getColorAndLabel(action);
            const timeDifference = getTimeDifferenceInMinutes(date);
            const formattedTimeDifference = getTimeDifferenceFormatted(timeDifference);

            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent>
                  {formattedTimeDifference}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={color} variant="outlined" />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography fontWeight="600">{value} Degen</Typography>
                  <Link underline="none">{label}</Link>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
