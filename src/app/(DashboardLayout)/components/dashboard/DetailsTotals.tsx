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
import { useTheme } from "@mui/material/styles";

interface Props {
  channelData: any;
}

interface ColorAndLabel {
  color:
    | "success"
    | "error"
    | "secondary"
    | "grey"
    | "inherit"
    | "primary"
    | "info"
    | "warning";
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

const RecentTransactions: React.FC<Props> = ({ channelData }) => {
  const theme = useTheme();
  console.log(channelData);
  return (
    <DashboardCard title="Your Channel">
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
          <TimelineItem>
            <TimelineOppositeContent>Subs</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {channelData?.numberOfSubscribers}
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>Stakers</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {channelData?.numberOfStakers}
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>Stake</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {(channelData?.currentStaked / 100000000000000).toFixed(2)}
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>Income</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {Number(
                  (
                    channelData?.totalSubscriptionFlowRate /
                    380517503805.174 /
                    channelData?.numberOfSubscribers
                  ).toFixed(0)
                ) *
                  0.25 *
                  channelData?.numberOfSubscribers}
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>DpA</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {Number(
                  (channelData?.estimatedEarningsPerSecond *
                    60 *
                    60 *
                    24 *
                    30) /
                    10000000000
                ).toFixed(2)}
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>Cost</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {(
                  channelData?.totalSubscriptionFlowRate /
                  380517503805.174 /
                  channelData?.numberOfSubscribers
                ).toFixed(0)}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
