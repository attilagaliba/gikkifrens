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

const RecentTransactions: React.FC<Props> = ({
  userRecentTransactions,
  limit,
}) => {
  const getFormattedTimeDifference = (timestamp: any) => {
    const now = Math.floor(Date.now() / 1000); // Şu anki zaman (saniye cinsinden)
    const differenceInSeconds = now - parseInt(timestamp);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    const minutesInAnHour = 60;
    const minutesInADay = 24 * minutesInAnHour;
    const minutesInAMonth = 30 * minutesInADay;
    const minutesInAYear = 365 * minutesInADay;

    if (differenceInMinutes < minutesInAnHour) {
      return `${differenceInMinutes}m`;
    } else if (differenceInMinutes < minutesInADay) {
      const hours = Math.floor(differenceInMinutes / minutesInAnHour);
      const remainingMinutes = differenceInMinutes % minutesInAnHour;
      return `${hours}h ${remainingMinutes}m`;
    } else if (differenceInMinutes < minutesInAMonth) {
      const days = Math.floor(differenceInMinutes / minutesInADay);
      const remainingHours = Math.floor(
        (differenceInMinutes % minutesInADay) / minutesInAnHour
      );
      return `${days}d ${remainingHours}h`;
    } else if (differenceInMinutes < minutesInAYear) {
      const months = Math.floor(differenceInMinutes / minutesInAMonth);
      const remainingDays = Math.floor(
        (differenceInMinutes % minutesInAMonth) / minutesInADay
      );
      return `${months}mo ${remainingDays}d`;
    } else {
      const years = Math.floor(differenceInMinutes / minutesInAYear);
      const remainingMonths = Math.floor(
        (differenceInMinutes % minutesInAYear) / minutesInAMonth
      );
      return `${years}y ${remainingMonths}mo`;
    }
  };
  const calculateTotals = (transactions: any) => {
    let totalGas = 0;
    let totalDeposit = 0;
    let totalWithdraw = 0;
    let gasCount = 0;
    let depositCount = 0;
    let withdrawCount = 0;
    let oldestGasTime = Infinity;
    let oldestDepositTime = Infinity;
    let oldestWithdrawTime = Infinity;

    transactions.forEach((transaction: any) => {
      if (transaction.action === "deposit") {
        totalDeposit += transaction.value;
        depositCount++;
        if (parseInt(transaction.date) < oldestDepositTime) {
          oldestDepositTime = parseInt(transaction.date);
        }
      } else if (transaction.action === "gas") {
        totalGas += transaction.value;
        gasCount++;
        if (parseInt(transaction.date) < oldestGasTime) {
          oldestGasTime = parseInt(transaction.date);
        }
      } else if (transaction.action === "withdraw") {
        totalWithdraw += transaction.value;
        withdrawCount++;
        if (parseInt(transaction.date) < oldestWithdrawTime) {
          oldestWithdrawTime = parseInt(transaction.date);
        }
      }
    });

    return {
      totalGas: totalGas,
      gasCount: gasCount,
      gasTime: oldestGasTime,
      totalDeposit: totalDeposit,
      depositCount: depositCount,
      depositTime: oldestDepositTime,
      totalWithdraw: totalWithdraw,
      withdrawCount: withdrawCount,
      withdrawTime: oldestWithdrawTime,
    };
  };

  // İşlem verilerini işle
  const totals = calculateTotals(userRecentTransactions);

  return (
    <DashboardCard title="Your Totals">
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,
            mb: "-20px",
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
            <TimelineOppositeContent>
              <Typography fontWeight="600">Deposit</Typography>
              <Link underline="none">
                Since {getFormattedTimeDifference(totals.depositTime)}
              </Link>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {totals?.totalDeposit} Degen
              </Typography>
              <Link underline="none">{totals?.depositCount} Times</Link>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <Typography fontWeight="600">Withdraw</Typography>
              <Link underline="none">
                Since {getFormattedTimeDifference(totals.withdrawTime)}
              </Link>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {totals?.totalWithdraw} Degen
              </Typography>
              <Link underline="none">{totals?.withdrawCount} Times</Link>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <Typography fontWeight="600">wtfGas</Typography>
              <Link underline="none">
                Since {getFormattedTimeDifference(totals.gasTime)}
              </Link>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">{totals?.totalGas} Degen</Typography>
              <Link underline="none">{totals?.gasCount} Times</Link>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent></TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent></TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>Difference</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              {totals?.totalWithdraw - totals?.totalDeposit} Degen
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
