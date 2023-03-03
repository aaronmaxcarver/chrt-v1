//-- React --//
import { useEffect, useState, Fragment } from "react";

//-- AWS SDK --//

//-- CHRT Components --//
import Chart1Overlays from "./Chart1Overlays";
import Chart2Overlays from "./Chart2Overlays";
import Chart3Overlays from "./Chart3Overlays";
import Chart4Overlays from "./Chart4Overlays";
import ChartThemeMenu from "./ChartThemeMenu";
import DataThemeMenu from "./DataThemeMenu";
import fetchData from "./fetchData";
import initSciChart from "./initSciChart";
import TickerReportAutocomplete from "../../Formik/TickerReportAutocomplete";
import TopControlBarLeft from "./TopControlBarLeft";
import TopControlBarRight from "./TopControlBarRight";
import BottomControlBarLeft from "./BottomControlBarLeft";
import BottomControlBarRight from "./BottomControlBarRight";

import chrtDefaultChartThemeLight1 from "./Themes/chrtDefaultChartThemeLight1.json";
import chrtDefaultChartThemeLight2 from "./Themes/chrtDefaultChartThemeLight2.json";
import chrtDefaultChartThemeDark1 from "./Themes/chrtDefaultChartThemeDark1.json";
import chrtDefaultChartThemeDark2 from "./Themes/chrtDefaultChartThemeDark2.json";
import chrtDefaultChartThemeCustom1 from "./Themes/chrtDefaultChartThemeCustom1.json";
import chrtDefaultDataTheme1 from "./Themes/chrtDefaultDataTheme1.json";

//-- npm Package Functions --//
import { add, format } from "date-fns";
import { ResizableBox } from "react-resizable";
import "../../../../../react-resizeable.css";
import { useParams } from "react-router-dom";
import { NumberRange } from "scichart/Core/NumberRange";
import { UpdateSuspender } from "scichart/Charting/Visuals/UpdateSuspender";

//-- npm Package Components --//
import Box from "@mui/material/Box";

//-- SX --//

//-- Globals --//
const CHARTS_MIN_WIDTH = 600;
const CHARTS_MAX_WIDTH = 3840;
const INITIAL_WINDOW_INNER_WIDTH = window.innerWidth;

const GRID_4_CHARTS_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: `60px minmax(60px, auto) minmax(60px, auto) minmax(60px, auto) minmax(60px, auto) 60px`,
  gridTemplateColumns: "1fr 1fr 1fr",
  gridTemplateAreas: `"topControlBarLeft topControlBarCenter topControlBarRight"
                      "chart1 chart1 chart1"
                      "chart2 chart2 chart2"
                      "chart3 chart3 chart3"
                      "chart4 chart4 chart4"
                      "bottomControlBarLeft bottomControlBarCenter bottomControlBarRight"`,
};

const TOP_CONTROL_BAR_LEFT_SX = {
  gridArea: "topControlBarLeft",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  background: "#888",
  paddingTop: "12px",
  paddingBottom: "6px",
  paddingLeft: "6px",
  paddingRight: "6px",
};

const TOP_CONTROL_BAR_CENTER_SX = {
  gridArea: "topControlBarCenter",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  background: "#888",
  paddingTop: "12px",
  paddingBottom: "6px",
  paddingLeft: "6px",
  paddingRight: "6px",
};

const TOP_CONTROL_BAR_RIGHT_SX = {
  gridArea: "topControlBarRight",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  background: "#888",
  paddingTop: "12px",
  paddingBottom: "6px",
  paddingLeft: "6px",
  paddingRight: "6px",
};

const CHART_1_SX = {
  gridArea: "chart1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // was flex-start
  zIndex: 1001,
};

const CHART_2_SX = {
  gridArea: "chart2",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // was flex-start
  zIndex: 1001,
};

const CHART_3_SX = {
  gridArea: "chart3",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // was flex-start
  zIndex: 1001,
};

const CHART_4_SX = {
  gridArea: "chart4",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // was flex-start
  zIndex: 1001,
};

const BOTTOM_CONTROL_BAR_LEFT_SX = {
  gridArea: "bottomControlBarLeft",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  background: "#888",
};

const BOTTOM_CONTROL_BAR_CENTER_SX = {
  gridArea: "bottomControlBarCenter",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  background: "#888",
};

const BOTTOM_CONTROL_BAR_RIGHT_SX = {
  gridArea: "bottomControlBarRight",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  background: "#888",
};

export default function ChartUI() {
  console.log("**RENDER**"); // DEV
  //-- ChartTheme --//
  const [chartTheme, setChartTheme] = useState(chrtDefaultChartThemeDark1);
  const [dataTheme, setDataTheme] = useState(chrtDefaultDataTheme1);
  const initialChartTheme = chrtDefaultChartThemeDark1; // DEV - fetch default theme from localstorage (if no default, set CHRT Dark 1 as the default), and assign theme to initialChartTheme
  const initialDataTheme = chrtDefaultDataTheme1; // DEV - fetch default theme from localstorage (if no default, set CHRT default as the default), and assign theme to initialDataTheme
  //-- Chart 1 --//
  const [chart1Surface, setChart1Surface] = useState();
  const [chart1XAxis, setChart1XAxis] = useState();
  const [ohlcDataSeries, setOHLCDataSeries] = useState();
  const [ohlcRenderableSeries, setOHLCRenderableSeries] = useState();
  const [ema12VWDataSeries, setEMA12VWDataSeries] = useState();
  const [ema12VWRenderableSeries, setEMA12VWRenderableSeries] = useState();
  const [abandsLowerDataSeries, setABANDSLowerDataSeries] = useState();
  const [abandsLowerRenderableSeries, setABANDSLowerRenderableSeries] =
    useState();
  const [abandsMiddleDataSeries, setABANDSMiddleDataSeries] = useState();
  const [abandsMiddleRenderableSeries, setABANDSMiddleRenderableSeries] =
    useState();
  const [abandsUpperDataSeries, setABANDSUpperDataSeries] = useState();
  const [abandsUpperRenderableSeries, setABANDSUpperRenderableSeries] =
    useState();
  //-- Chart 2 --//
  const [chart2Surface, setChart2Surface] = useState();
  const [chart2XAxis, setChart2XAxis] = useState();
  const [volumeDataSeries, setVolumeDataSeries] = useState();
  const [volumeRenderableSeries, setVolumeRenderableSeries] = useState();
  //-- Chart 3 --//
  const [chart3Surface, setChart3Surface] = useState();
  const [chart3XAxis, setChart3XAxis] = useState();
  const [macdHistogramDataSeriesChart3, setMACDHistogramDataSeriesChart3] =
    useState();
  const [
    macdHistogramRenderableSeriesChart3,
    setMACDHistogramRenderableSeriesChart3,
  ] = useState();
  const [macdMACDDataSeriesChart3, setMACDMACDDataSeriesChart3] = useState();
  const [macdMACDRenderableSeriesChart3, setMACDMACDRenderableSeriesChart3] =
    useState();
  const [macdSignalDataSeriesChart3, setMACDSignalDataSeriesChart3] =
    useState();
  const [
    macdSignalRenderableSeriesChart3,
    setMACDSignalRenderableSeriesChart3,
  ] = useState();
  const [rsiDataSeriesChart3, setRSIDataSeriesChart3] = useState();
  const [rsiRenderableSeriesChart3, setRSIRenderableSeriesChart3] = useState();
  //-- Chart 4 --//
  const [chart4Surface, setChart4Surface] = useState();
  const [chart4XAxis, setChart4XAxis] = useState();
  const [macdHistogramDataSeriesChart4, setMACDHistogramDataSeriesChart4] =
    useState();
  const [
    macdHistogramRenderableSeriesChart4,
    setMACDHistogramRenderableSeriesChart4,
  ] = useState();
  const [macdMACDDataSeriesChart4, setMACDMACDDataSeriesChart4] = useState();
  const [macdMACDRenderableSeriesChart4, setMACDMACDRenderableSeriesChart4] =
    useState();
  const [macdSignalDataSeriesChart4, setMACDSignalDataSeriesChart4] =
    useState();
  const [
    macdSignalRenderableSeriesChart4,
    setMACDSignalRenderableSeriesChart4,
  ] = useState();
  const [rsiDataSeriesChart4, setRSIDataSeriesChart4] = useState();
  const [rsiRenderableSeriesChart4, setRSIRenderableSeriesChart4] = useState();
  //-- Other Stuff --//
  const [visibleStartIndexState, setVisibleStartIndexState] = useState();
  const [visibleEndIndexState, setVisibleEndIndexState] = useState();
  const [multiplier, setMultiplier] = useState("1");
  const [timeInterval, setTimeInterval] = useState("minute");
  const [requests, setRequests] = useState({});
  const [addedCandleCount, setAddedCandleCount] = useState(0); // needs to not reset each render
  //-- URL Params --//
  let { dataEntity } = useParams();

  //-- Set up windowWidth state and an event listener that updates windowWidth state--//
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    //-- handle window resize events --//
    const handleWindowWidthResize = () => {
      setWindowWidth(window.innerWidth);
    };
    //-- add event listener --//
    window.addEventListener("resize", handleWindowWidthResize);
    //-- remove event listener --//
    return () => {
      window.removeEventListener("resize", handleWindowWidthResize);
    };
  }, []);

  //-- Initial height set by aspect ratio, then sync with react-resizable --//
  const [chart1Height, setChart1Height] = useState(
    windowWidth * chartTheme.chart1AspectRatio // was initialChartTheme
  );
  const [chart2Height, setChart2Height] = useState(
    windowWidth * chartTheme.chart2AspectRatio // was initialChartTheme
  );
  const [chart3Height, setChart3Height] = useState(
    windowWidth * chartTheme.chart3AspectRatio // was initialChartTheme
  );
  const [chart4Height, setChart4Height] = useState(
    windowWidth * chartTheme.chart4AspectRatio // was initialChartTheme
  );

  //-- Create chart divs, used in initSciChart and as children for Resizable boxes --//
  // let chart1div = document.createElement("div");
  // chart1div.setAttribute("id", "chart1div");
  // chart1div.style.height = `${chart1Height}px`;
  // chart1div.style.width = `${INITIAL_WINDOW_INNER_WIDTH}px`;
  //----//
  // let chart2div = document.createElement("div");
  // chart2div.setAttribute("id", "chart2div");
  // chart2div.style.height = `${chart2Height}px`;
  // chart2div.style.width = `${INITIAL_WINDOW_INNER_WIDTH}px`;
  //----//
  // let chart3div = document.createElement("div");
  // chart3div.setAttribute("id", "chart3div");
  // chart3div.style.height = `${chart3Height}px`;
  // chart3div.style.width = `${INITIAL_WINDOW_INNER_WIDTH}px`;
  //----//
  // let chart4div = document.createElement("div");
  // chart4div.setAttribute("id", "chart4div");
  // chart4div.style.height = `${chart4Height}px`;
  // chart4div.style.width = `${INITIAL_WINDOW_INNER_WIDTH}px`;

  //-- Initialize SciChart for Chart UI --//
  //-- ******************************** --//
  let sciChartSurface1;
  let sciChartSurface2;
  let sciChartSurface3;
  let sciChartSurface4;
  useEffect(() => {
    (async () => {
      //-- Start date is a chosen number of days ago and end date is Date.now() --//
      let startDate = format(add(Date.now(), { days: -3 }), "yyyy-MM-dd");
      let endDate = Date.now(); //-- Avoid cache hits (which would exclude newest data) --//

      //-- Fetch Data --//
      // TODO - to use Cognito as auth provider for API Gateway API endpoints such as polygonStocksAPI.chrt.com/...
      // DEV note - this was successful: https://polygonStocksAPI.chrt.com/v2/aggs/ticker/AAPL/range/1/minute/2022-07-06/2022-07-11?adjusted=true&sort=asc&limit=50000
      let data = await fetchData(
        `https://polygonStocksAPI.chrt.com/v2/aggs/ticker/${dataEntity}/range/${multiplier}/${timeInterval}/${startDate}/${endDate}?adjusted=true&sort=asc&limit=50000`
      );
      let resultsCount = data.resultsCount;
      let xValues = data.xValues;
      let openValues = data.openValues;
      let highValues = data.highValues;
      let lowValues = data.lowValues;
      let closeValues = data.closeValues;
      let volumeValues = data.volumeValues;
      let ema12VWValues = data.ema12VWValues;
      let abandsValues = data.abandsValues;
      let macdValues = data.macdValues;
      let rsiValues = data.rsiValues;

      //-- Initialize SciChart --//
      let res = await initSciChart(
        initialDataTheme,
        initialChartTheme,
        chart1Height,
        chart2Height,
        chart3Height,
        chart4Height,
        INITIAL_WINDOW_INNER_WIDTH,
        resultsCount,
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        volumeValues,
        ema12VWValues,
        abandsValues,
        macdValues,
        rsiValues
      );
      //-- ISciChartSurfaceBase objects to delete via useEffect return --//
      sciChartSurface1 = res.chart1Surface; // eslint-disable-line react-hooks/exhaustive-deps
      sciChartSurface2 = res.chart2Surface; // eslint-disable-line react-hooks/exhaustive-deps
      sciChartSurface3 = res.chart3Surface; // eslint-disable-line react-hooks/exhaustive-deps
      sciChartSurface4 = res.chart4Surface; // eslint-disable-line react-hooks/exhaustive-deps

      //-- Chart 1 --//
      setChart1Surface(res.chart1Surface);
      setChart1XAxis(res.chart1XAxis);
      setOHLCDataSeries(res.ohlcDataSeries);
      setOHLCRenderableSeries(res.ohlcRenderableSeries);
      setEMA12VWDataSeries(res.ema12VWDataSeries);
      setEMA12VWRenderableSeries(res.ema12VWRenderableSeries);
      setABANDSLowerDataSeries(res.abandsLowerDataSeries);
      setABANDSLowerRenderableSeries(res.abandsLowerRenderableSeries);
      setABANDSMiddleDataSeries(res.abandsMiddleDataSeries);
      setABANDSMiddleRenderableSeries(res.abandsMiddleRenderableSeries);
      setABANDSUpperDataSeries(res.abandsUpperDataSeries);
      setABANDSUpperRenderableSeries(res.abandsUpperRenderableSeries);
      //-- Chart 2 --//
      setChart2Surface(res.chart2Surface);
      setChart2XAxis(res.chart2XAxis);
      setVolumeDataSeries(res.volumeDataSeries);
      setVolumeRenderableSeries(res.volumeRenderableSeries);
      //-- Chart 3 --//
      setChart3Surface(res.chart3Surface);
      setChart3XAxis(res.chart3XAxis);
      setMACDHistogramDataSeriesChart3(res.macdHistogramDataSeriesChart3);
      setMACDHistogramRenderableSeriesChart3(
        res.macdHistogramRenderableSeriesChart3
      );
      setMACDMACDDataSeriesChart3(res.macdMACDDataSeriesChart3);
      setMACDMACDRenderableSeriesChart3(res.macdMACDRenderableSeriesChart3);
      setMACDSignalDataSeriesChart3(res.macdSignalDataSeriesChart3);
      setMACDSignalRenderableSeriesChart3(res.macdSignalRenderableSeriesChart3);
      setRSIDataSeriesChart3(res.rsiDataSeriesChart3);
      setRSIRenderableSeriesChart3(res.rsiRenderableSeriesChart3);
      //-- Chart 4 --//
      setChart4Surface(res.chart4Surface);
      setChart4XAxis(res.chart4XAxis);
      setMACDHistogramDataSeriesChart4(res.macdHistogramDataSeriesChart4);
      setMACDHistogramRenderableSeriesChart4(
        res.macdHistogramRenderableSeriesChart4
      );
      setMACDMACDDataSeriesChart4(res.macdMACDDataSeriesChart4);
      setMACDMACDRenderableSeriesChart4(res.macdMACDRenderableSeriesChart4);
      setMACDSignalDataSeriesChart4(res.macdSignalDataSeriesChart4);
      setMACDSignalRenderableSeriesChart4(res.macdSignalRenderableSeriesChart4);
      setRSIDataSeriesChart4(res.rsiDataSeriesChart4);
      setRSIRenderableSeriesChart4(res.rsiRenderableSeriesChart4);
      //-- Subscribe to changes of the Chart 1 X-Axis and set visible start/end index upon each change --//
      res.chart1XAxis.visibleRangeChanged.subscribe((args) => {
        setVisibleStartIndexState(Math.round(args.visibleRange.min)); //-- Used for backward-fetching data --//
        setVisibleEndIndexState(Math.round(args.visibleRange.max)); //-- TODO - use for forward-fetching data --//
      });
    })();

    return () => {
      //-- Delete chart surface objects to free native (WebAssembly) memory --//
      sciChartSurface1?.delete();
      sciChartSurface2?.delete();
      sciChartSurface3?.delete();
      sciChartSurface4?.delete();
    };
  }, [
    dataEntity,
    initialChartTheme,
    initialDataTheme,
    multiplier,
    timeInterval,
  ]);

  //-- Update SciChart (skip inital render, when ohlcDataSeries is null) --//
  //-- ***************************************************************** --//
  if (ohlcDataSeries) {
    //-- Forward Data Fetching (for when chart extends right beyond all data) --//
    let { max: maxOHLCDataSeriesIndex } = ohlcDataSeries.getIndicesRange(
      ohlcDataSeries.getXRange()
    );
    if (visibleEndIndexState > maxOHLCDataSeriesIndex) {
      // TODO - forward data fetching logic
    }

    //-- Backward Data Fetching (for when chart extends left beyond all data) --//
    if (visibleStartIndexState < 0) {
      // TODO - change this to use the request URL as a hashmap?
      if (!requests[`${addedCandleCount}`]) {
        setRequests((prevState) => ({
          ...prevState,
          [`${addedCandleCount}`]: true,
        }));

        async function fetchAndInsertData() {
          let { min: minUnixTimestampInSeconds } = ohlcDataSeries.getXRange();
          let startDate = format(
            add(minUnixTimestampInSeconds * 1000, { days: -15 }),
            "yyyy-MM-dd"
          );
          let endDate = format(
            add(minUnixTimestampInSeconds * 1000, { days: -1 }),
            "yyyy-MM-dd"
          );

          let {
            resultsCount,
            xValues,
            openValues,
            highValues,
            lowValues,
            closeValues,
            volumeValues,
            ema12VWValues,
            abandsValues,
            macdValues,
            rsiValues,
          } = await fetchData(
            `https://polygonStocksAPI.chrt.com/v2/aggs/ticker/${dataEntity}/range/${multiplier}/${timeInterval}/${startDate}/${endDate}?adjusted=true&sort=asc&limit=50000`
          );

          //-- Suspend updates while inserting data and setting visibleRange --//
          // TODO - adjust setting visibleRange for forward data fetching
          UpdateSuspender.using(chart2Surface, () => {
            volumeDataSeries.insertRange(
              0, //-- startIndex --//
              xValues,
              volumeValues
            );
            let minVolume = resultsCount + chart2XAxis.visibleRange.min;
            let maxVolume = Math.floor(
              chart2XAxis.visibleRange.max + resultsCount
            );
            chart2XAxis.visibleRange = new NumberRange(minVolume, maxVolume);

            UpdateSuspender.using(chart1Surface, () => {
              ohlcDataSeries.insertRange(
                0, //-- startIndex --//
                xValues,
                openValues,
                highValues,
                lowValues,
                closeValues
              );
              ema12VWDataSeries.insertRange(
                0, //-- start index --//
                xValues,
                ema12VWValues
              );
              abandsLowerDataSeries.insertRange(
                0, //-- Start  Index --//
                xValues,
                abandsValues.lower
              );
              abandsMiddleDataSeries.insertRange(
                0, //-- Start Index --//
                xValues,
                abandsValues.middle
              );
              abandsUpperDataSeries.insertRange(
                0, //-- Start Index --//
                xValues,
                abandsValues.upper
              );

              chart1XAxis.visibleRange = new NumberRange(minVolume, maxVolume);
            });
            //-- Chart 3 --//
            UpdateSuspender.using(chart3Surface, () => {
              macdHistogramDataSeriesChart3.insertRange(
                0, //-- startIndex --//
                xValues,
                macdValues.histogram
              );
              macdMACDDataSeriesChart3.insertRange(
                0, //-- startIndex--//
                xValues,
                macdValues.macd
              );
              macdSignalDataSeriesChart3.insertRange(
                0, //-- startIndex --//
                xValues,
                macdValues.signal
              );
              rsiDataSeriesChart3.insertRange(
                0, //-- startIndex --//
                xValues,
                rsiValues
              );

              chart3XAxis.visibleRange = new NumberRange(minVolume, maxVolume);
            });
            //-- Chart 4 --//
            UpdateSuspender.using(chart4Surface, () => {
              macdHistogramDataSeriesChart4.insertRange(
                0, //-- startIndex --//
                xValues,
                macdValues.histogram
              );
              macdMACDDataSeriesChart4.insertRange(
                0, //-- startIndex--//
                xValues,
                macdValues.macd
              );
              macdSignalDataSeriesChart4.insertRange(
                0, //-- startIndex --//
                xValues,
                macdValues.signal
              );
              rsiDataSeriesChart4.insertRange(
                0, //-- startIndex --//
                xValues,
                rsiValues
              );

              chart4XAxis.visibleRange = new NumberRange(minVolume, maxVolume);
            });
          });

          setAddedCandleCount((prevState) => (prevState -= resultsCount)); //-- Uses negative range?? --//
        }
        fetchAndInsertData();
      } else {
        console.log("**E** SKIPPING FETCH, requests: "); // DEV
      }
    }
  }

  //-- Chart 1 Indicator Selections --//
  const [chart1IndicatorsSelected, setChart1Indicators] = useState(["OHLC"]);
  // chart1SeriesActive
  const chart1Indicators = [
    // chart1SeriesGroupedByLabel
    { label: "OHLC", renderableSeries: [ohlcRenderableSeries] },
    { label: "EMA", renderableSeries: [ema12VWRenderableSeries] },
    {
      label: "ABANDS",
      renderableSeries: [
        abandsLowerRenderableSeries,
        abandsMiddleRenderableSeries,
        abandsUpperRenderableSeries,
      ],
    },
  ];

  //-- Chart 3 Indicator Selections --//
  const [chart3IndicatorValue, setChart3IndicatorValue] = useState("");
  const chart3Indicators = [
    {
      label: "MACD",
      renderableSeries: [
        macdMACDRenderableSeriesChart3,
        macdSignalRenderableSeriesChart3,
        macdHistogramRenderableSeriesChart3,
      ],
    },
    { label: "RSI", renderableSeries: [rsiRenderableSeriesChart3] },
  ]; //-- These values are used to create menu items and also in the switch-case statement for showing/hiding renderable series --//

  //-- Chart 4 Indicator Selections --//
  const [chart4IndicatorValue, setChart4IndicatorValue] = useState("");
  const chart4Indicators = [
    {
      label: "MACD",
      renderableSeries: [
        macdMACDRenderableSeriesChart4,
        macdSignalRenderableSeriesChart4,
        macdHistogramRenderableSeriesChart4,
      ],
    },
    { label: "RSI", renderableSeries: [rsiRenderableSeriesChart4] },
  ]; //-- These values are used to create menu items and also in the switch-case statement for showing/hiding renderable series --//

  //-- Properties Menu for Data Series (opens in modal component) --//
  const [dataThemeMenuIsOpen, setDataThemeMenuIsOpen] = useState(false);
  const seriesPropertiesMenuOpenHandler = (renderableSeriesLabel) => {
    setDataThemeMenuIsOpen(true);
  };
  const dataThemeMenuCloseHandler = () => {
    setDataThemeMenuIsOpen(false);
  };

  //-- ChartTheme Properties Menu (opens in modal component) --//
  const [chartThemePropertiesMenuIsOpen, setChartThemePropertiesMenuIsOpen] =
    useState(false);
  const chartThemeMenuOpenHandler = () => {
    setChartThemePropertiesMenuIsOpen(true);
  };
  const chartThemeMenuCloseHandler = () => {
    setChartThemePropertiesMenuIsOpen(false);
  };

  //-- When react-resizable resizes, fire event and trigger re-render of SciChart --//
  const chart1ResizeHandler = (event, data) => {
    chart1Surface.changeViewportSize(data.size.width, data.size.height);
    setChart1Height(data.size.height);
  };
  const chart2ResizeHandler = (event, data) => {
    chart2Surface.changeViewportSize(data.size.width, data.size.height);
    setChart2Height(data.size.height);
  };
  const chart3ResizeHandler = (event, data) => {
    chart3Surface.changeViewportSize(data.size.width, data.size.height);
    setChart3Height(data.size.height);
  };
  const chart4ResizeHandler = (event, data) => {
    chart4Surface.changeViewportSize(data.size.width, data.size.height);
    setChart4Height(data.size.height);
  };

  //-- Select the divs created in initSciChart to use a children for the Resizable Boxes

  //-- Functional Component Return --//
  //-- *************************** --//
  return (
    <Fragment>
      {/* //-- Start of Modals for Menus --// */}
      {/*-- Modal - Draggable Dialog menu for Renderable Series Properties --*/}
      <DataThemeMenu
        dataTheme={dataTheme}
        setDataTheme={setDataTheme}
        dataThemeMenuIsOpen={dataThemeMenuIsOpen}
        dataThemeMenuCloseHandler={dataThemeMenuCloseHandler}
        // chart1Surface={chart1Surface}
        chart2Surface={chart2Surface}
        chart3Surface={chart3Surface}
        chart4Surface={chart4Surface}
        ohlcRenderableSeries={ohlcRenderableSeries}
        ema12VWRenderableSeries={ema12VWRenderableSeries}
        abandsLowerRenderableSeries={abandsLowerRenderableSeries}
        abandsMiddleRenderableSeries={abandsMiddleRenderableSeries}
        abandsUpperRenderableSeries={abandsUpperRenderableSeries}
        volumeRenderableSeries={volumeRenderableSeries}
        macdHistogramRenderableSeriesChart3={
          macdHistogramRenderableSeriesChart3
        }
        macdMACDRenderableSeriesChart3={macdMACDRenderableSeriesChart3}
        macdSignalRenderableSeriesChart3={macdSignalRenderableSeriesChart3}
        rsiRenderableSeriesChart3={rsiRenderableSeriesChart3}
        macdHistogramRenderableSeriesChart4={
          macdHistogramRenderableSeriesChart4
        }
        macdMACDRenderableSeriesChart4={macdMACDRenderableSeriesChart4}
        macdSignalRenderableSeriesChart4={macdSignalRenderableSeriesChart4}
        rsiRenderableSeriesChart4={rsiRenderableSeriesChart4}
      />

      {/*-- Modal - Draggable Dialog menu for ChartTheme Properties --*/}
      <ChartThemeMenu
        chartThemePropertiesMenuIsOpen={chartThemePropertiesMenuIsOpen}
        chartThemeMenuCloseHandler={chartThemeMenuCloseHandler}
        chartTheme={chartTheme}
        setChartTheme={setChartTheme}
        chart1Surface={chart1Surface}
        chart2Surface={chart2Surface}
        chart3Surface={chart3Surface}
        chart4Surface={chart4Surface}
        setChart1Height={setChart1Height}
        setChart2Height={setChart2Height}
        setChart3Height={setChart3Height}
        setChart4Height={setChart4Height}
      />
      {/* //-- End of Modals for Menus --// */}

      <Box sx={GRID_4_CHARTS_SX}>
        {/*-- Top ControlBar - LHS --*/}
        <Box sx={TOP_CONTROL_BAR_LEFT_SX}>
          <TopControlBarLeft
            setDataThemeMenuIsOpen={setDataThemeMenuIsOpen}
            ohlcRenderableSeries={ohlcRenderableSeries}
            ema12VWRenderableSeries={ema12VWRenderableSeries}
            abandsLowerRenderableSeries={abandsLowerRenderableSeries}
            abandsMiddleRenderableSeries={abandsMiddleRenderableSeries}
            abandsUpperRenderableSeries={abandsUpperRenderableSeries}
            macdMACDRenderableSeriesChart3={macdMACDRenderableSeriesChart3}
            macdSignalRenderableSeriesChart3={macdSignalRenderableSeriesChart3}
            macdHistogramRenderableSeriesChart3={
              macdHistogramRenderableSeriesChart3
            }
            rsiRenderableSeriesChart3={rsiRenderableSeriesChart3}
            macdHistogramRenderableSeriesChart4={
              macdHistogramRenderableSeriesChart4
            }
            macdMACDRenderableSeriesChart4={macdMACDRenderableSeriesChart4}
            macdSignalRenderableSeriesChart4={macdSignalRenderableSeriesChart4}
            rsiRenderableSeriesChart4={rsiRenderableSeriesChart4}
            chart1Indicators={chart1Indicators}
            setChart1Indicators={setChart1Indicators}
            chart1IndicatorsSelected={chart1IndicatorsSelected}
            chart3Indicators={chart3Indicators}
            setChart3IndicatorValue={setChart3IndicatorValue}
            chart3IndicatorValue={chart3IndicatorValue}
            chart4Indicators={chart4Indicators}
            setChart4IndicatorValue={setChart4IndicatorValue}
            chart4IndicatorValue={chart4IndicatorValue}
          />
        </Box>
        {/*-- Top ControlBar - Center --*/}
        <Box sx={TOP_CONTROL_BAR_CENTER_SX}>
          <TickerReportAutocomplete />
        </Box>
        {/*-- Top ControlBar - RHS --*/}
        <Box sx={TOP_CONTROL_BAR_RIGHT_SX}>
          <TopControlBarRight />
        </Box>

        {/*-- Charts 1-4 Surfaces & Overlays --*/}
        {/*-- Chart 1 Overlays (uses CSS grid row and column start/end numbers for positioning) --*/}
        <Chart1Overlays
          dataTheme={dataTheme}
          chart1Indicators={chart1Indicators}
          chart1IndicatorsSelected={chart1IndicatorsSelected}
          seriesPropertiesMenuOpenHandler={seriesPropertiesMenuOpenHandler}
        />
        {/*-- Chart 1 --*/}
        <Box sx={CHART_1_SX}>
          <ResizableBox
            children={<div id="chart1div" />}
            className="react-resizable"
            axis="y"
            onResize={chart1ResizeHandler}
            width={windowWidth}
            height={chart1Height}
            minConstraints={[
              CHARTS_MIN_WIDTH, //-- Width --//
              CHARTS_MIN_WIDTH * 0.1, //-- Height --//
            ]}
            maxConstraints={[
              CHARTS_MAX_WIDTH, //-- Width --//
              CHARTS_MAX_WIDTH, //-- Height --//
            ]}
          />
        </Box>

        {/*-- Chart 2 Overlays (uses CSS grid row and column start/end numbers for positioning) --*/}
        <Chart2Overlays dataTheme={dataTheme} />
        {/*-- Chart 2 --*/}
        <Box sx={CHART_2_SX}>
          <ResizableBox
            children={<div id="chart2div" />}
            className="react-resizable"
            axis="y"
            onResize={chart2ResizeHandler}
            width={windowWidth}
            height={chart2Height}
            minConstraints={[
              CHARTS_MIN_WIDTH, //-- Width --//
              CHARTS_MIN_WIDTH * 0.1, //-- Height --//
            ]}
            maxConstraints={[
              CHARTS_MAX_WIDTH, //-- Width --//
              CHARTS_MAX_WIDTH, //-- Height --//
            ]}
          />
        </Box>

        {/*-- Chart 3 Overlays (uses CSS grid row and column start/end numbers for positioning) --*/}
        <Chart3Overlays
          dataTheme={dataTheme}
          chart3IndicatorValue={chart3IndicatorValue}
          seriesPropertiesMenuOpenHandler={seriesPropertiesMenuOpenHandler}
        />
        {/*-- Chart 3 --*/}
        <Box sx={CHART_3_SX}>
          <ResizableBox
            children={<div id="chart3div" />}
            className="react-resizable"
            axis="y"
            onResize={chart3ResizeHandler}
            width={windowWidth}
            height={chart3Height}
            minConstraints={[
              CHARTS_MIN_WIDTH, //-- Width --//
              CHARTS_MIN_WIDTH * 0.1, //-- Height --//
            ]}
            maxConstraints={[
              CHARTS_MAX_WIDTH, //-- Width --//
              CHARTS_MAX_WIDTH, //-- Height --//
            ]}
          />
        </Box>

        {/*-- Chart 4 Overlays (uses CSS grid row and column start/end numbers for positioning) --*/}
        <Chart4Overlays
          dataTheme={dataTheme}
          chart4IndicatorValue={chart4IndicatorValue}
          seriesPropertiesMenuOpenHandler={seriesPropertiesMenuOpenHandler}
        />
        {/*-- Chart 4 --*/}
        <Box sx={CHART_4_SX}>
          <ResizableBox
            children={<div id="chart4div" />}
            className="react-resizable"
            axis="y"
            onResize={chart4ResizeHandler}
            width={windowWidth}
            height={chart4Height}
            minConstraints={[
              CHARTS_MIN_WIDTH, //-- Width --//
              CHARTS_MIN_WIDTH * 0.1, //-- Height --//
            ]}
            maxConstraints={[
              CHARTS_MAX_WIDTH, //-- Width --//
              CHARTS_MAX_WIDTH, //-- Height --//
            ]}
          />
        </Box>

        {/*-- Bottom ControlBar --*/}
        {/*-- LHS - Theming --*/}
        <Box sx={BOTTOM_CONTROL_BAR_LEFT_SX}>
          <BottomControlBarLeft
            chart1Surface={chart1Surface}
            chart2Surface={chart2Surface}
            chart3Surface={chart3Surface}
            chart4Surface={chart4Surface}
            chartThemeMenuOpenHandler={chartThemeMenuOpenHandler}
            setChartTheme={setChartTheme}
            chrtDefaultChartThemeLight1={chrtDefaultChartThemeLight1}
            chrtDefaultChartThemeLight2={chrtDefaultChartThemeLight2}
            chrtDefaultChartThemeDark1={chrtDefaultChartThemeDark1}
            chrtDefaultChartThemeDark2={chrtDefaultChartThemeDark2}
            chrtDefaultChartThemeCustom1={chrtDefaultChartThemeCustom1}
          />
        </Box>

        {/*-- Center - Placeholder --*/}
        <Box sx={BOTTOM_CONTROL_BAR_CENTER_SX}></Box>

        {/*-- RHS - Sharing --*/}
        <Box sx={BOTTOM_CONTROL_BAR_RIGHT_SX}>
          <BottomControlBarRight />
        </Box>
      </Box>
    </Fragment>
  );
}
