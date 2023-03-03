//-- React --//

//-- AWS SDK --//
import freshCUPTokens from "../../../../SDK_CLIENTS/freshCUPTokens";

//-- CHRT Components --//

//-- npm Package Functions --//
import axios from "axios";
import {
  FasterAccelerationBands,
  FasterEMA,
  FasterMACD,
  FasterRSI,
  FasterSMA,
} from "trading-signals";

//-- npm Package Components --//

export default async function fetchData(axiosURL) {
  //-- Polygon API Request --//
  let { idToken } = await freshCUPTokens();
  let res = await axios
    .get(axiosURL, {
      headers: {
        authorization: idToken,
      },
    })
    .catch(function (error) {
      if (error.response) {
        // TODO - what is the right error handling?
        //-- Server responded with status code outside 2xx --//
        console.log(error.response);
      } else if (error.request) {
        //-- No response received --//
        console.log(error.request);
      } else {
        //-- Request setup failed and triggered an Error --//
        console.log("Error", error.message);
      }
      console.log(error.config); // not sure what this is
    });

  //-- OHLC --//
  //-- **** --//
  let resultsCount = res.data.resultsCount;
  let xValues = res.data.results.map((x) => {
    return x.t / 1000;
  });
  let openValues = res.data.results.map((x) => {
    return x.o;
  });
  let highValues = res.data.results.map((x) => {
    return x.h;
  });
  let lowValues = res.data.results.map((x) => {
    return x.l;
  });
  let closeValues = res.data.results.map((x) => {
    return x.c;
  });
  let volumeValues = res.data.results.map((x) => {
    return x.v;
  });

  //-- ********** Chart 1 Indicators ********** --//
  //-- ********************************************* --//
  //-- EMA 12 VW (trading-signals) --//
  const ema12VW = new FasterEMA(12);
  let ema12VWValues = [];
  res.data.results.forEach((x) => {
    ema12VW.update(x.vw);
    try {
      ema12VWValues.push(ema12VW.getResult());
    } catch (error) {
      ema12VWValues.push(NaN); //-- Indicator array to match length of OHLC array --//
    }
  });
  //-- ABANDS (Acceleration Bands) --//
  const abands = new FasterAccelerationBands(12, 8, FasterSMA);
  let abandsValues = { lower: [], middle: [], upper: [] };
  res.data.results.forEach((x) => {
    abands.update({ high: x.h, low: x.l, close: x.c });
    try {
      abandsValues.lower.push(abands.getResult().lower);
      abandsValues.middle.push(abands.getResult().middle);
      abandsValues.upper.push(abands.getResult().upper);
    } catch (error) {
      abandsValues.lower.push(NaN); //-- Indicator arry to match length of OHLC array --//
      abandsValues.middle.push(NaN);
      abandsValues.upper.push(NaN);
    }
  });

  //-- ********** Chart 3 Indicators ********** --//
  //-- ********************************************* --//
  //-- MACD (trading-signals) --//
  //-- ********************** --//
  const macd = new FasterMACD(
    new FasterEMA(12),
    new FasterEMA(26),
    new FasterEMA(9)
  );
  let macdValues = { histogram: [], macd: [], signal: [] };
  res.data.results.forEach((x) => {
    macd.update(x.c);
    try {
      macdValues.histogram.push(macd.getResult().histogram);
      macdValues.macd.push(macd.getResult().macd);
      macdValues.signal.push(macd.getResult().signal);
    } catch (error) {
      macdValues.histogram.push(NaN); //-- Indicator array needs to match length of OHLC array --//
      macdValues.macd.push(NaN);
      macdValues.signal.push(NaN);
    }
  });
  //-- RSI (trading-signals) --//
  //-- ********************* --//
  const rsi = new FasterRSI(14);
  let rsiValues = [];
  res.data.results.forEach((x) => {
    rsi.update(x.c);
    try {
      rsiValues.push(rsi.getResult());
    } catch (error) {
      rsiValues.push(NaN); //-- Indicator array needs to match length of OHLC array --//
    }
  });

  return {
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
  };
}

//   let vwValues = res.data.results.map((x) => {
//     return x.vw;
//   });

//-- trading-signals (https://www.npmjs.com/package/trading-signals) --//

// // Hervey picks
// Average True Range (ATR)
// Acceleration Bands (ABANDS) ✅
// Bollinger Bands (BBANDS)
// Bollinger Bands Width (BBW)
// Exponential Moving Average (EMA) ✅
// Relative Strength Index (RSI) ✅
// Moving Average Convergence Divergence (MACD) ✅
// Simple Moving Average (SMA)
// Wilder's Smoothed Moving Average (WSMA / WMA / WWS / SMMA / MEMA)
// VWAP

// just inform user that it's EMA12 (and offer some common options like EMA8, etc.) or allow changes?

// What about
// // Relative volume (with secondary y axis) to volume chart or to surface 3 or as an option on both??

// Annotations
// // (1) Price level - horizontal line set at price with start x axis point, extends to right infinitely
// // (2) Support/resistance rectangle
// // (3) Trendline - line with start and end x-axis point and any slope
// Customize stroke - color, weight, style (dashes, solid, alternating short/long dashes)
