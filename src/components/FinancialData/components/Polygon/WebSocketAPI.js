import { useState, useReducer, useEffect } from "react";

import { useParams } from "react-router-dom";
import NumberFormat from "react-number-format";

import { Box, Card, Typography, Chip } from "@mui/material";
import CloudSharpIcon from "@mui/icons-material/CloudSharp";
import Stack from "@mui/material/Stack";
import CloudOffSharpIcon from "@mui/icons-material/CloudOffSharp";

const GRID_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "auto",
  gridTemplateColumns: "100%",
  gridTemplateAreas: `"topLeft"`,
};

const MAIN_SX = {
  // Newsfeed center style
  gridArea: "topLeft",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
};

const CONNECTION_CARD_SX = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "50px",
};

const API_KEY = "gwsD_t1ZWmSdlVLZRpO7mmeOKrh8R_e4";

export default function WebSocketAPI() {
  let { dataEntity } = useParams();

  //-- 'readyState' of WebSocket can be for displaying a status indicator to the user --//
  const [webSocketReadyState, webSocketReadyStateDispatch] = useReducer(
    webSocketReadyStateReducer,
    {
      readyState: "closed",
      chipContent: "closed",
      color: "warning",
      cloudConnected: false,
    }
  );

  function webSocketReadyStateReducer(state, action) {
    switch (action.type) {
      case "0":
        return {
          readyState: "connecting",
          chipContent: "connecting",
          color: "warning", //-- warning is orange --//
          cloudConnected: false,
        };
      case "1":
        return {
          readyState: "open",
          chipContent: "open",
          color: "success", //-- success is green --//
          cloudConnected: true,
        };
      case "2":
        return {
          readyState: "closing",
          chipContent: "closing",
          color: "error", //-- error is red --//
          cloudConnected: true,
        };
      case "3":
        return {
          readyState: "closed",
          chipContent: "closed",
          color: "warning", //-- warning is orange --//
          cloudConnected: false,
        };
      default:
        //-- In case of unexpected 'status' value --//
        return {
          readyState: "closed",
          chipContent: "closed",
          color: "warning",
          cloudConnected: false,
        };
    }
  }

  const [polygonState, polygonDispatch] = useReducer(polygonReducer, {
    cloudConnected: false,
    chipContent: "not connected",
    color: "warning", //-- warning is orange --//
    subscriptionSymbol: "",
  });

  function polygonReducer(state, action) {
    switch (action.type) {
      case "connected":
        return {
          cloudConnected: true,
          chipContent: "connected",
          color: "success", //-- success is green --//
          symbol: "",
        };
      case "auth_success":
        return {
          cloudConnected: true,
          chipContent: "authorized",
          color: "success", //-- success is green --//
          symbol: "",
        };
      case "success":
        return {
          cloudConnected: true,
          chipContent: "subscribed: ",
          color: "success", //-- success is green --//
          symbol: `${action.symbol}`,
        };
      case "not connected":
        return {
          cloudConnected: false,
          chipContent: "not connected",
          color: "warning", //-- warning is orange --//
          symbol: "",
        };
      default:
        //-- In case of unexpected 'status' value --//
        return {
          cloudConnected: true,
          chipContent: "API code unknown",
          color: "warning", //-- warning is orange --//
          symbol: "",
        };
    }
  }

  const [agg1s, setAgg1s] = useState({
    ev: "",
    sym: "",
    v: null,
    av: null,
    op: null,
    vw: null,
    o: null,
    c: null,
    h: null,
    l: null,
    a: null,
    z: null,
    s: null,
    e: null,
  });

  const [agg1m, setAgg1m] = useState({
    ev: "",
    sym: "",
    v: null,
    av: null,
    op: null,
    vw: null,
    o: null,
    c: null,
    h: null,
    l: null,
    a: null,
    z: null,
    s: null,
    e: null,
  });

  const [trades, setTrades] = useState({
    ev: "",
    sym: "",
    x: null,
    i: "",
    z: null,
    p: null,
    s: null,
    c: [],
    t: null,
  });

  const [quotes, setQuotes] = useState({
    ev: "",
    sym: "",
    bx: null,
    bp: null,
    bs: null,
    ax: null,
    ap: null,
    as: null,
    c: null,
    t: null,
    z: null,
  });

  useEffect(() => {
    //-- Auth and subscription data for polygon.io WebSocket API --//
    const authData = `{"action": "auth", "params": "${API_KEY}"}`;
    const subscriptionDataFor1sAggregates = `{"action": "subscribe", "params": "A.${dataEntity}"}`;
    const subscriptionDataFor1mAggregates = `{"action": "subscribe", "params": "AM.${dataEntity}"}`;
    // const subscriptionDataForQuotes = `{"action": "subscribe", "params": "Q.${dataEntity}"}`;
    // const subscriptionDataForTrades = `{"action": "subscribe", "params": "T.${dataEntity}"}`;

    //-- Connect to Polygon WebSocket API and send API Key for authorization --//
    const ws = new WebSocket("wss://socket.polygon.io/stocks");

    //-- (1/4) webSocketReadyDispatch, (1/4) polygonDispatch--//
    webSocketReadyStateDispatch({ type: `${ws.readyState}` });
    polygonDispatch({ type: "not connected" });

    ws.onopen = () => {
      ws.send(authData);
      ws.send(subscriptionDataFor1sAggregates);
      ws.send(subscriptionDataFor1mAggregates);
      // ws.send(subscriptionDataForQuotes);
      // ws.send(subscriptionDataForTrades);
    };

    //-- (2/4) webSocketReadyDispatch--//
    webSocketReadyStateDispatch({ type: `${ws.readyState}` });

    //-- For each message received, display desired data --//
    ws.onmessage = (event) => {
      if (event.data) {
        //-- Use only the final object of the array (it's the most recent data) --//
        let lastBar = JSON.parse(event.data).at(-1);

        console.log(lastBar.ev + " " + lastBar.o); // DEV

        //-- Filter message by stream. Set values to new value, or reset the values (don't keep old values). --//
        switch (lastBar.ev) {
          case "status":
            //-- Incoming 'data.status: "success"' messages are for successful subscriptions (??) --//
            let type = lastBar.status.toString();
            if (lastBar.status === "success") {
              let symbol = lastBar["message"]; // TODO - parse out just the symbol
              polygonDispatch({ type: type, symbol: symbol }); //-- (2/4) polygonDispatch --//
            } else {
              polygonDispatch({ type: type }); //-- (3/4) polygonDispatch --//
            }
            break;
          case "A":
            setAgg1s({
              ev: lastBar.ev | "",
              sym: lastBar.sym | "",
              v: lastBar.v | null,
              av: lastBar.av | null,
              op: lastBar.op | null,
              vw: lastBar.vw | null,
              o: lastBar.o, // testing
              c: lastBar.c, // testing
              h: lastBar.h, // testing
              l: lastBar.l, // testing
              a: lastBar.a | null,
              z: lastBar.z | null,
              s: lastBar.s | null,
              e: lastBar.e | null,
            });
            console.log("agg1s.o: " + agg1s.o); // DEV
            break;
          case "AM":
            setAgg1m({
              ev: lastBar.ev | "",
              sym: lastBar.sym | "",
              v: lastBar.v | null,
              av: lastBar.av | null,
              op: lastBar.op | null,
              vw: lastBar.vw | null,
              o: lastBar.o | null,
              c: lastBar.c | null,
              h: lastBar.h | null,
              l: lastBar.l | null,
              a: lastBar.a | null,
              z: lastBar.z | null,
              s: lastBar.s | null,
              e: lastBar.e | null,
            });
            break;
          case "T":
            setTrades({
              ev: lastBar.ev | "",
              sym: lastBar.sym | "",
              x: lastBar.x | null,
              i: lastBar.i | "",
              z: lastBar.z | null,
              p: lastBar.p | null,
              s: lastBar.s | null,
              c: lastBar.c | [],
              t: lastBar.t | null,
            });
            break;
          case "Q":
            setQuotes({
              ev: lastBar.ev | "",
              sym: lastBar.sym | "",
              bx: lastBar.bx | null,
              bp: lastBar.bp | null,
              bs: lastBar.bs | null,
              ax: lastBar.ax | null,
              ap: lastBar.ap | null,
              as: lastBar.as | null,
              c: lastBar.c | null,
              t: lastBar.t | null,
              z: lastBar.z | null,
            });
            break;
          default:
            break;
        }
      }

      ws.onclose = (event) => {
        //-- (3/4) webSocketReadyDispatch, (4/4) polygonDispatch --//
        webSocketReadyStateDispatch({ type: `${ws.readyState}` });
        polygonDispatch({ type: "not connected" });
      };

      //-- (4/4) webSocketReadyDispatch--//
      webSocketReadyStateDispatch({ type: `${ws.readyState}` });
    };

    //-- On componentWillUnmount, close WebSocket connection --//
    return () => {
      ws.close();
    };
  }, [dataEntity]);

  // DEV -  need to build nice frontend component
  return (
    <Box sx={GRID_SX}>
      <Box sx={MAIN_SX}>
        <Card sx={CONNECTION_CARD_SX}>
          <Stack direction="row" spacing={1}>
            {/*-- Network Connection Status Indicator --*/}

            {/*-- WebSocket.readyState Status Indicator --*/}
            <Chip
              icon={
                webSocketReadyState.cloudConnected ? (
                  <CloudSharpIcon />
                ) : (
                  <CloudOffSharpIcon />
                )
              }
              label={`${webSocketReadyState.chipContent}`}
              color={`${webSocketReadyState.color}`}
            />

            {/* Polygon API Status Indicator */}
            <Chip
              icon={
                polygonState.cloudConnected ? (
                  <CloudSharpIcon />
                ) : (
                  <CloudOffSharpIcon />
                )
              }
              label={`${polygonState.chipContent} ${polygonState.symbol}`}
              color={`${polygonState.color}`}
            />
          </Stack>
        </Card>

        {/*-- Data Display --*/}
        <Card>
          <Typography variant="h6">Symbol: {dataEntity}</Typography>
          {/* 1s aggregates */}
          1s aggregates
          <Typography>{JSON.stringify(agg1s)}</Typography>
          <Typography>
            O:
            <NumberFormat
              displayType="text"
              value={agg1s.o}
              prefix="$"
              decimalSeparator="."
              decimalScale={2}
              thousandSeparator=","
            />
          </Typography>
          <Typography>
            H:
            <NumberFormat
              displayType="text"
              value={agg1s.h}
              prefix="$"
              decimalSeparator="."
              decimalScale={2}
              thousandSeparator=","
            />
          </Typography>
          <Typography>
            L:
            <NumberFormat
              displayType="text"
              value={agg1s.l}
              prefix="$"
              decimalSeparator="."
              decimalScale={2}
              thousandSeparator=","
            />
          </Typography>
          <Typography>
            C:
            <NumberFormat
              displayType="text"
              value={agg1s.c}
              prefix="$"
              decimalSeparator="."
              decimalScale={2}
              thousandSeparator=","
            />
          </Typography>
          {/* 1m aggregates */}
          1m aggregates
          <Typography>{JSON.stringify(agg1m)}</Typography>
          {/* Trades  */}
          Trades
          <Typography>{JSON.stringify(trades)}</Typography>
          {/* Quotes */}
          Quotes
          <Typography>{JSON.stringify(quotes)}</Typography>
        </Card>
      </Box>
    </Box>
  );
}
