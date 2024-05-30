/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Paper,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Link from "next/link";
import LinearProgress from "@mui/material/LinearProgress";
import { CSVLink } from "react-csv";

interface Subscription {
  channelCost: number;
  title: React.ReactNode;
  channelId: any;
  userDisplayName: React.ReactNode;
  index: number;
  pbg: string;
  priority: string;
  userChannelCost: any;
  userChannelAlfa: number;
  userPfp: string;
  profileimgurl: string;
}

interface ProductPerformanceProps {
  userSubs: any[];
  degenPrice?: number;
}

type Order = "asc" | "desc";

interface HeadCell {
  id: keyof Subscription;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}

const headCells: HeadCell[] = [
  { id: "profileimgurl", numeric: false, disablePadding: true, label: " " },
  { id: "title", numeric: false, disablePadding: false, label: "Channel" },
  {
    id: "userChannelAlfa",
    numeric: true,
    disablePadding: false,
    label: "Alfa Allocation",
  },
  {
    id: "channelCost",
    numeric: true,
    disablePadding: false,
    label: "Channel Cost",
  },
];

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if ((b[orderBy] as unknown as number) < (a[orderBy] as unknown as number))
    return -1;
  if ((b[orderBy] as unknown as number) > (a[orderBy] as unknown as number))
    return 1;
  return 0;
};

const getComparator = <Key extends keyof any>(order: Order, orderBy: Key) => {
  return order === "desc"
    ? (
        a: { [key in Key]: string | number },
        b: { [key in Key]: string | number }
      ) => descendingComparator(a, b, orderBy)
    : (
        a: { [key in Key]: string | number },
        b: { [key in Key]: string | number }
      ) => -descendingComparator(a, b, orderBy);
};

const stableSort = <T,>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

interface EnhancedTableHeadProps {
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof Subscription;
  numSelected: number;
  rowCount: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Subscription
  ) => void;
}

const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = (props) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Subscription) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  userSubs,
}) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof Subscription>("channelCost");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [csvData, setCsvData] = React.useState<
    { Channel: any; "Alfa Allocation": any; "Channel Cost": any }[]
  >([]);

  const prepareCsvData = () => {
    const data = userSubs.map((sub) => ({
      Channel: sub.title,
      "Alfa Allocation": sub.userChannelAlfa,
      "Channel Cost": sub.channelCost,
      "Channel URL": `https://www.alfafrens.com/channel/${sub.channelId}` // Yeni eklenen satır
    }));
    setCsvData(data);
  };
  

  React.useEffect(() => {
    prepareCsvData();
  }, [userSubs]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Subscription
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = userSubs.map((n: { index: any }) => n.index);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, index: any) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(userSubs, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, userSubs]
  );

  return (
    <DashboardCard title={`Subscriptions (${userSubs.length})`}>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 500 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={userSubs.length}
              />

              {userSubs && userSubs.length > 0 ? (
                <TableBody>
                  {visibleRows.map((sub, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, sub.index)}
                        tabIndex={-1}
                        key={sub.index}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <Link
                            href={`https://www.alfafrens.com/channel/${sub.channelId}`}
                            target="_blank"
                          >
                            <img
                              src={String(sub.profileimgurl)}
                              alt="pfp"
                              style={{
                                borderRadius: "50%",
                                width: "35px",
                                height: "35px",
                                margin: "10px",
                              }}
                            />
                          </Link>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Link
                            href={`https://www.alfafrens.com/channel/${sub.channelId}`}
                            target="_blank"
                          >
                            {sub.title}
                          </Link>
                        </TableCell>
                        {Number(sub.userChannelAlfa) < 1 ||
                          (sub.userChannelAlfa === 999999 && (
                            <a
                              target="_blank"
                              href="https://www.alfafrens.com/channel/0x35dfccae83f23a7f91c0e4ff27d323fc161baca7"
                            >
                              <TableCell align="right">
                                Sub @degenfans for see Reward
                              </TableCell>
                            </a>
                          ))}
                        {Number(sub.userChannelAlfa) >= 1 &&
                          sub.userChannelAlfa !== 999999 && (
                            <TableCell align="right">
                              {sub.userChannelAlfa}
                            </TableCell>
                          )}
                        <TableCell align="right">{sub.channelCost}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <>
                  <LinearProgress color="secondary" />
                  <LinearProgress color="success" />
                  <LinearProgress color="inherit" />
                </>
              )}
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CSVLink
              data={csvData}
              filename={"SubscriptionsFromGikkiFrens.csv"}
            >
              Export
            </CSVLink>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={userSubs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Paper>
      </Box>
    </DashboardCard>
  );
};

export default ProductPerformance;
