import forIn from "lodash/forIn";
import { v4 as uuidv4 } from "uuid";
import NumberFormat from "react-number-format";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import { grey } from "@mui/material/colors";

const MAIN_CARD_SX = {
  backgroundColor: grey[200],
};

const CARD_SX = {
  marginBottom: "6px",
  marginX: "6px",
};

const TABLE_SX = {
  minWidth: 600,
};

//-- Table Styling --//
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#808080",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#CFF0FC", //-- Seems to be the EDGAR SEC 10K color --//
  },
  //-- Hides last border --//
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createRow(id, label, value, unit, order) {
  return { id, label, value, unit, order };
}

export default function StockFinancialsVXFiling(props) {
  //-- Destructure filing from props. Set variables to represent data for a given statement --//
  let { filing } = props;
  let incomeStatement = filing.financials.income_statement;
  let cashFlowStatement = filing.financials.cash_flow_statement;
  let comprehensiveIncome = filing.financials.comprehensive_income;
  let balanceSheet = filing.financials.balance_sheet;

  //-- Populate Income Statment Rows & sort by 'order' ascending --//
  const incomeStatementRows = [];
  forIn(incomeStatement, function (value, key) {
    incomeStatementRows.push(
      createRow(uuidv4(), value.label, value.value, value.unit, value.order)
    );
  });
  incomeStatementRows.sort(function (a, b) {
    return a.order - b.order;
  });

  //-- Populate Cash Flow Statement Rows & sort by 'order' ascending --//
  const cashFlowStatementRows = [];
  forIn(cashFlowStatement, function (value, key) {
    cashFlowStatementRows.push(
      createRow(uuidv4(), value.label, value.value, value.unit, value.order)
    );
  });
  cashFlowStatementRows.sort(function (a, b) {
    return a.order - b.order;
  });

  //-- Populate Balance Sheet Rows & sort by 'order' ascending --//
  const balanceSheetRows = [];
  forIn(balanceSheet, function (value, key) {
    balanceSheetRows.push(
      createRow(uuidv4(), value.label, value.value, value.unit, value.order)
    );
  });
  balanceSheetRows.sort(function (a, b) {
    return a.order - b.order;
  });

  //-- Populate Comprehensive Income Rows & sort by 'order' ascending --//
  const comprehensiveIncomeRows = [];
  forIn(comprehensiveIncome, function (value, key) {
    comprehensiveIncomeRows.push(
      createRow(uuidv4(), value.label, value.value, value.unit, value.order)
    );
  });
  comprehensiveIncomeRows.sort(function (a, b) {
    return a.order - b.order;
  });

  return (
    <Card sx={MAIN_CARD_SX}>
      {/* Filing Company and Fiscal Period */}
      <Typography variant="h6">{filing.company_name}</Typography>
      <Chip label={`Fiscal Year: ${filing.fiscal_year}`} />
      <Chip label={`Fiscal Period: ${filing.fiscal_period}`} />
      <Typography align="right">
        Period(??) start date: {filing.start_date}
      </Typography>
      <Typography align="right">
        Period(??) end date: {filing.end_date}
      </Typography>

      {/* Income Statement Card*/}
      <Card sx={CARD_SX}>
        <TableContainer component={Paper}>
          <Table sx={TABLE_SX} size="small" aria-label="a dense table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>INCOME STATEMENT</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {/* Map over incomeStatementRows, creating StyledTableRow for each */}
              {incomeStatementRows.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.label}</StyledTableCell>
                    <StyledTableCell>
                      ({row.unit}){" "}
                      <NumberFormat
                        displayType="text"
                        value={row.value}
                        prefix="$"
                        decimalSeparator="."
                        decimalScale={2}
                        thousandSeparator=","
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Cash Flow Statement Card */}
      <Card sx={CARD_SX}>
        <TableContainer component={Paper}>
          <Table sx={TABLE_SX} size="small" aria-label="a dense table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>CASH FLOW STATEMENT</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {/* Map over cashFlowStatementRows, creating StyledTableRow for each */}
              {cashFlowStatementRows.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.label}</StyledTableCell>
                    <StyledTableCell>
                      ({row.unit}){" "}
                      <NumberFormat
                        displayType="text"
                        value={row.value}
                        prefix="$"
                        decimalSeparator="."
                        decimalScale={2}
                        thousandSeparator=","
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Balance Sheet Statement Card */}
      <Card sx={CARD_SX}>
        <TableContainer component={Paper}>
          <Table sx={TABLE_SX} size="small" aria-label="a dense table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>BALANCE SHEET</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {/* Map over balanceSheetRows, creating StyledTableRow for each */}
              {balanceSheetRows.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.label}</StyledTableCell>
                    <StyledTableCell>
                      ({row.unit}){" "}
                      <NumberFormat
                        displayType="text"
                        value={row.value}
                        prefix="$"
                        decimalSeparator="."
                        decimalScale={2}
                        thousandSeparator=","
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Comprehensive Income Card */}
      <Card sx={CARD_SX}>
        <TableContainer component={Paper}>
          <Table sx={TABLE_SX} size="small" aria-label="a dense table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>COMPREHENSIVE INCOME</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {/* Map over comprehensiveIncomeRows, creating StyledTableRow for each */}
              {cashFlowStatementRows.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.label}</StyledTableCell>
                    <StyledTableCell>
                      ({row.unit}){" "}
                      <NumberFormat
                        displayType="text"
                        value={row.value}
                        prefix="$"
                        decimalSeparator="."
                        decimalScale={2}
                        thousandSeparator=","
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Card>
  );
}

// (1) Beautify entire card, especially the header
// // handle cases when no results are shown for a given report
// // manage SWR for the requests? When do they udpate? test with many symbols
// // add filing toggler / date methods??
