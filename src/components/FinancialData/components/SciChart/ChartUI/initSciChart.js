//-- React --//

//-- AWS SDK --//

//-- CHRT Components --//
import initSciChartSurfaces from "./initSciChartSurfaces";

//-- npm Package Functions --//
import { NumberRange } from "scichart/Core/NumberRange";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { EAutoRange } from "scichart/types/AutoRange";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import {
  ENumericLabelProvider,
  NumericLabelProvider,
} from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { EPaletteProviderType } from "scichart/types/PaletteProviderType";
import { SmartDateLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/SmartDateLabelProvider";
import { parseColorToUIntArgb } from "scichart/utils/parseColor"; //-- Helper for matching volume column color to OHLC candle color --//
import { Thickness } from "scichart/Core/Thickness";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { CursorModifier } from "scichart/Charting/ChartModifiers/CursorModifier";
import { XAxisDragModifier } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { EXyDirection } from "scichart/types/XyDirection";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { EBaseType } from "scichart/types/BaseType";

import { DefaultSciChartLoader } from "scichart/Charting/Visuals/loader";
import { UpdateSuspender } from "scichart/Charting/Visuals/UpdateSuspender";

//-- npm Package Components --//
import { SciChartSurface } from "scichart";

//-- SX --//

export default async function initSciChart(
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
) {
  SciChartSurface.setRuntimeLicenseKey(
    "regplP1DN9cwd2XScIv7hJCa5uRk75HJLcWLCCmrsx1+/MBUL5UtC4LAdXxFBaCU38AKXfJ3gejPr6dFabGCIxk8AKJ9kjGku77aaD4GqRAIxStd3k08jWt3z3PcnEcC5ZTFql1I7swXMEOmji+4PM7STx1yuu3nEV6bJX2Cs6F0jxSwNKHmt8i//CvFhCMadeZlgxRbnWXzG1ikROB2IxfxD/5jQ9hhnUB3FvdO+ZilFvEugIcDiqm8cqdz7vguOyiXg81Ak4xn7EnAwx8QhvO24fO/TVaGA01Bvi09KmFfv7RY0H1uut0Zai+bnoqUlY5SyUThYXYh/JE0fniM6oYWBOOc1AFOWRmTirDtDccfrk9d3i9Kz+NLjyqKM/EHu/NJz2ZaYVk3x88PdmwdRK3L8WVnFpMStjVBvbwwzQKR0rE4H1nlnu5ReFv8yiukNDkbCHUBERkF4ZUJaBT7OuY1IsrzVbUmrIXSYx7tW7elWiKahiXSiokAEo9QWNWxm5eLfFbLKiRt6V6IzyUmGhj4zQpixdteWII+Ob5qzJ3JT9QBliGyqFMATAjD5Xq3/xR8II96/dsG2RgJdazZbLDPZ1adJOsIxgOr2m+iIVc4JfLGXMc5J856CdiX+Sw5y8WdyIGZ3bRxxz3yA9/eYbsWsFRKJrPamxvStJTP6DRy8lo="
  ); //-- Last updated 2022-09-28 --//

  //-- Create vertical group. Each surface will be added to this vertical group --//
  const verticalGroup = new SciChartVerticalGroup();

  //-- Init SciChart Surfaces and wasm contexts --//
  const {
    chart1Surface,
    chart2Surface,
    chart3Surface,
    chart4Surface,
    wasmContext1,
    wasmContext2,
    wasmContext3,
    wasmContext4,
  } = await initSciChartSurfaces(
    initialChartTheme, // added
    chart1Height,
    chart2Height,
    chart3Height,
    chart4Height
  );

  //-- ******************* CHART 1 ************************* --//
  //-- OHLC x-axis --//
  const chart1XAxis = new CategoryAxis(wasmContext1, {
    //-- autoRange & growBy --//
    autoRange: EAutoRange.Never,
    growBy: new NumberRange(0, 0), //-- Fill space --//
    //-- Grid, Ticks, & Labels --//
    drawLabels: false,
    maxAutoTicks: 60,
    minorsPerMajor: 1,
  });

  //-- OHLC data series & renderable series --//
  const ohlcDataSeries = new OhlcDataSeries(wasmContext1, {
    dataSeriesName: "ohlcSeriesChart1",
    xValues,
    openValues,
    highValues,
    lowValues,
    closeValues,
  });
  const ohlcRenderableSeries = new FastCandlestickRenderableSeries(
    wasmContext1,
    {
      dataSeries: ohlcDataSeries,
      isVisible: initialDataTheme.ohlcSeriesChart1.isVisible,
      opacity: initialDataTheme.ohlcSeriesChart1.opacity,
      brushUp: initialDataTheme.ohlcSeriesChart1.brushUp,
      brushDown: initialDataTheme.ohlcSeriesChart1.brushDown,
      strokeUp: initialDataTheme.ohlcSeriesChart1.strokeUp,
      strokeDown: initialDataTheme.ohlcSeriesChart1.strokeDown,
      strokeThickness: initialDataTheme.ohlcSeriesChart1.strokeThickness,
      dataPointWidth: initialDataTheme.ohlcSeriesChart1.dataPointWidth,
    }
  );
  //-- EMA12 data series & renderable series --//
  const ema12VWDataSeries = new XyDataSeries(wasmContext1, {
    dataSeriesName: "ema12SeriesChart1",
    xValues: xValues,
    yValues: ema12VWValues,
  });
  const ema12VWRenderableSeries = new FastLineRenderableSeries(wasmContext1, {
    dataSeries: ema12VWDataSeries,
    isVisible: initialDataTheme.ema12SeriesChart1.isVisible,
    opacity: initialDataTheme.ema12SeriesChart1.opacity,
    stroke: initialDataTheme.ema12SeriesChart1.stroke,
    strokeThickness: initialDataTheme.ema12SeriesChart1.strokeThickness,
    strokeDashArray: initialDataTheme.ema12SeriesChart1.strokeDashArray,
  });
  //-- ABANDS data series & renderable series --//
  const abandsLowerDataSeries = new XyDataSeries(wasmContext1, {
    dataSeriesName: "abandsLowerSeriesChart1",
    xValues: xValues,
    yValues: abandsValues.lower,
  });
  const abandsMiddleDataSeries = new XyDataSeries(wasmContext1, {
    dataSeriesName: "abandsMiddleSeriesChart1",
    xValues: xValues,
    yValues: abandsValues.middle,
  });
  const abandsUpperDataSeries = new XyDataSeries(wasmContext1, {
    dataSeriesName: "abandsUpperSeriesChart1",
    xValues: xValues,
    yValues: abandsValues.upper,
  });
  const abandsLowerRenderableSeries = new FastLineRenderableSeries(
    wasmContext1,
    {
      dataSeries: abandsLowerDataSeries,
      isVisible: initialDataTheme.abandsLowerSeriesChart1.isVisible,
      opacity: initialDataTheme.abandsLowerSeriesChart1.opacity,
      stroke: initialDataTheme.abandsLowerSeriesChart1.stroke,
      strokeThickness: initialDataTheme.abandsLowerSeriesChart1.strokeThickness,
      strokeDashArray: initialDataTheme.abandsLowerSeriesChart1.strokeDashArray,
    }
  );
  const abandsMiddleRenderableSeries = new FastLineRenderableSeries(
    wasmContext1,
    {
      dataSeries: abandsMiddleDataSeries,
      isVisible: initialDataTheme.abandsMiddleSeriesChart1.isVisible,
      opacity: initialDataTheme.abandsMiddleSeriesChart1.opacity,
      stroke: initialDataTheme.abandsMiddleSeriesChart1.stroke,
      strokeThickness:
        initialDataTheme.abandsMiddleSeriesChart1.strokeThickness,
      strokeDashArray:
        initialDataTheme.abandsMiddleSeriesChart1.strokeDashArray,
    }
  );
  const abandsUpperRenderableSeries = new FastLineRenderableSeries(
    wasmContext1,
    {
      dataSeries: abandsUpperDataSeries,
      isVisible: initialDataTheme.abandsUpperSeriesChart1.isVisible,
      opacity: initialDataTheme.abandsUpperSeriesChart1.opacity,
      stroke: initialDataTheme.abandsUpperSeriesChart1.stroke,
      strokeThickness: initialDataTheme.abandsUpperSeriesChart1.strokeThickness,
      strokeDashArray: initialDataTheme.abandsUpperSeriesChart1.strokeDashArray,
    }
  );
  //-- OHLC Modifiers --//
  const chart1ZoomExtentsModifier = new ZoomExtentsModifier();
  const chart1ZoomPanModifier = new ZoomPanModifier({
    xyDirection: EXyDirection.XDirection,
  });
  const chart1MouseWheelZoomModifier = new MouseWheelZoomModifier();
  const chart1CursorModifier = new CursorModifier();
  const chart1XAxisDragModifier = new XAxisDragModifier();

  //-- Chart 1 Updates --//
  UpdateSuspender.using(chart1Surface, () => {
    //-- Set initial viewport size --//
    chart1Surface.changeViewportSize(
      INITIAL_WINDOW_INNER_WIDTH,
      INITIAL_WINDOW_INNER_WIDTH * initialChartTheme.chart1AspectRatio
    );

    chart1Surface.xAxes.add(chart1XAxis);
    //-- OHLC y-axis --//
    chart1Surface.yAxes.add(
      new NumericAxis(wasmContext1, {
        //-- autoRange & growBy --//
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0, 0), //-- Fill space --//
        //-- Grid, Ticks, & Labels --//
        maxAutoTicks: 15,
        minorsPerMajor: 1,
        labelFormat: ENumericFormat.Decimal,
        labelPrefix: "$",
        labelPrecision: 2,
      })
    );
    chart1Surface.renderableSeries.add(ohlcRenderableSeries);
    chart1Surface.renderableSeries.add(ema12VWRenderableSeries);
    chart1Surface.renderableSeries.add(abandsLowerRenderableSeries);
    chart1Surface.renderableSeries.add(abandsMiddleRenderableSeries);
    chart1Surface.renderableSeries.add(abandsUpperRenderableSeries);
    chart1Surface.chartModifiers.add(chart1ZoomExtentsModifier);
    chart1Surface.chartModifiers.add(chart1ZoomPanModifier);
    chart1Surface.chartModifiers.add(chart1MouseWheelZoomModifier);
    chart1Surface.chartModifiers.add(chart1CursorModifier);
    chart1Surface.chartModifiers.add(chart1XAxisDragModifier);
    // chart1Surface.applyTheme(initialChartTheme); // testing passing theme during surface initialization
    //-- Add to vertical group --//
    verticalGroup.addSurfaceToGroup(chart1Surface);
  });

  //-- ********************** CHART 2 ********************** --//
  //-- Volume x-axis --//
  const chart2XAxis = new CategoryAxis(wasmContext2, {
    //-- autoRange & growBy --//
    autoRange: EAutoRange.Never,
    growBy: new NumberRange(0, 0), //-- Fill space --//
    //-- Grid, Ticks, & Labels --//
    maxAutoTicks: 60,
    minorsPerMajor: 1,
    // labelProvider: new SmartDateLabelProvider(), // console error when attempting chart2 serialization: Setting or getting numericFormat is not supported for SmartDateLabelProvider
  });

  //-- Volume y-axis --//
  const volumeYAxis = {
    //-- autoRange & growBy --//
    autoRange: EAutoRange.Always,
    growBy: new NumberRange(0, 0), //-- Fill space --//
    //-- Grid, Ticks, & Labels --//
    maxAutoTicks: 5,
    minorsPerMajor: 1,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
  };

  //-- Volume data series & renderable series --//
  const volumeDataSeries = new XyDataSeries(wasmContext2, {
    dataSeriesName: "volumeSeriesChart2",
    xValues: xValues,
    yValues: volumeValues,
  });
  const volumePaletteProvider = new VolumePaletteProvider(
    ohlcDataSeries,
    initialDataTheme.ohlcSeriesChart1.brushUp,
    initialDataTheme.ohlcSeriesChart1.brushDown
  );
  const volumeRenderableSeries = new FastColumnRenderableSeries(wasmContext2, {
    dataSeries: volumeDataSeries,
    isVisible: initialDataTheme.volumeSeriesChart2.isVisible,
    opacity: initialDataTheme.volumeSeriesChart2.opacity,
    dataPointWidth: initialDataTheme.volumeSeriesChart2.dataPointWidth,
    strokeThickness: initialDataTheme.volumeSeriesChart2.strokeThickness,
    paletteProvider: volumePaletteProvider,
  });

  //-- Chart 2 Modifiers --//
  const chart2ZoomExtentsModifier = new ZoomExtentsModifier();
  const chart2ZoomPanModifier = new ZoomPanModifier({
    xyDirection: EXyDirection.XDirection,
  });
  const chart2MouseWheelZoomModifier = new MouseWheelZoomModifier();
  const chart2CursorModifier = new CursorModifier();
  const chart2XAxisDragModifier = new XAxisDragModifier();

  //-- Chart 2 Updates --//
  UpdateSuspender.using(chart2Surface, () => {
    //-- Set initial viewport size --//
    chart2Surface.changeViewportSize(
      INITIAL_WINDOW_INNER_WIDTH,
      INITIAL_WINDOW_INNER_WIDTH * initialChartTheme.chart2AspectRatio
    );
    chart2Surface.xAxes.add(chart2XAxis);
    chart2Surface.yAxes.add(new NumericAxis(wasmContext2, volumeYAxis));
    chart2Surface.renderableSeries.add(volumeRenderableSeries);
    chart2Surface.chartModifiers.add(chart2ZoomExtentsModifier);
    chart2Surface.chartModifiers.add(chart2ZoomPanModifier);
    chart2Surface.chartModifiers.add(chart2MouseWheelZoomModifier);
    chart2Surface.chartModifiers.add(chart2CursorModifier);
    chart2Surface.chartModifiers.add(chart2XAxisDragModifier);
    // chart2Surface.applyTheme(initialChartTheme); // testing passing theme during surface initialization
    //-- Add to vertical group --//
    verticalGroup.addSurfaceToGroup(chart2Surface);
  });

  //-- ********************** CHART 3 ********************** --//
  //-- Surface3 x-axis --//
  const chart3XAxis = new CategoryAxis(wasmContext3, {
    //-- autoRange and growBy --//
    autoRange: EAutoRange.Never,
    growBy: new NumberRange(0, 0), //-- Fill space --//
    //-- Grid, Ticks, & Labels --//
    maxAutoTicks: 60,
    minorsPerMajor: 1,
    // labelProvider: new SmartDateLabelProvider(), // console error when attempting chart2 serialization: Setting or getting numericFormat is not supported for SmartDateLabelProvider
  });

  //-- Surface3 y-axis --//
  const __surface3YAxis = {
    //-- autoRange & growBy --//
    autoRange: EAutoRange.Always,
    growBy: new NumberRange(0, 0), //-- Fill space --//
    //-- Grid, Ticks, & Labels --//
    maxAutoTicks: 5,
    minorsPerMajor: 1,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
  };

  //-- MACD data series & renderable series --//
  const macdHistogramDataSeriesChart3 = new XyDataSeries(wasmContext3, {
    dataSeriesName: "macdHistogramSeriesChart3",
    xValues: xValues,
    yValues: macdValues.histogram,
  });
  const macdMACDDataSeriesChart3 = new XyDataSeries(wasmContext3, {
    dataSeriesName: "macdMACDSeriesChart3",
    xValues: xValues,
    yValues: macdValues.macd,
  });
  const macdSignalDataSeriesChart3 = new XyDataSeries(wasmContext3, {
    dataSeriesName: "macdSignalSeriesChart3",
    xValues: xValues,
    yValues: macdValues.signal,
  });
  const macdHistogramChart3PaletteProvider = new MACDPaletteProviderChart3(
    macdHistogramDataSeriesChart3,
    initialDataTheme.macdHistogramSeriesChart3.above0,
    initialDataTheme.macdHistogramSeriesChart3.below0
  );
  const macdHistogramRenderableSeriesChart3 = new FastColumnRenderableSeries(
    wasmContext3,
    {
      dataSeries: macdHistogramDataSeriesChart3,
      isVisible: initialDataTheme.macdHistogramSeriesChart3.isVisible,
      opacity: initialDataTheme.macdHistogramSeriesChart3.opacity,
      strokeThickness:
        initialDataTheme.macdHistogramSeriesChart3.strokeThickness,
      dataPointWidth: initialDataTheme.macdHistogramSeriesChart3.dataPointWidth,
      paletteProvider: macdHistogramChart3PaletteProvider,
    }
  );

  const macdMACDRenderableSeriesChart3 = new FastLineRenderableSeries(
    wasmContext3,
    {
      dataSeries: macdMACDDataSeriesChart3,
      isVisible: initialDataTheme.macdMACDSeriesChart3.isVisible,
      opacity: initialDataTheme.macdMACDSeriesChart3.opacity,
      stroke: initialDataTheme.macdMACDSeriesChart3.stroke,
      strokeThickness: initialDataTheme.macdMACDSeriesChart3.strokeThickness,
      strokeDashArray: initialDataTheme.macdMACDSeriesChart3.strokeDashArray,
    }
  );
  const macdSignalRenderableSeriesChart3 = new FastLineRenderableSeries(
    wasmContext3,
    {
      dataSeries: macdSignalDataSeriesChart3,
      isVisible: initialDataTheme.macdSignalSeriesChart3.isVisible,
      opacity: initialDataTheme.macdSignalSeriesChart3.opacity,
      stroke: initialDataTheme.macdSignalSeriesChart3.stroke,
      strokeThickness: initialDataTheme.macdSignalSeriesChart3.strokeThickness,
      strokeDashArray: initialDataTheme.macdSignalSeriesChart3.strokeDashArray,
    }
  );

  //-- RSI data series & renderable series --//
  const rsiDataSeriesChart3 = new XyDataSeries(wasmContext3, {
    dataSeriesName: "rsiSeriesChart3",
    xValues: xValues,
    yValues: rsiValues,
  });
  const rsiRenderableSeriesChart3 = new FastLineRenderableSeries(wasmContext3, {
    dataSeries: rsiDataSeriesChart3,
    isVisible: initialDataTheme.rsiSeriesChart3.isVisible,
    opacity: initialDataTheme.rsiSeriesChart3.opacity,
    stroke: initialDataTheme.rsiSeriesChart3.stroke,
    strokeThickness: initialDataTheme.rsiSeriesChart3.strokeThickness,
    strokeDashArray: initialDataTheme.rsiSeriesChart3.strokeDashArray,
  });

  //-- Chart 3 Modifiers --//
  const chart3ZoomExtentsModifier = new ZoomExtentsModifier();
  const chart3ZoomPanModifier = new ZoomPanModifier({
    xyDirection: EXyDirection.XDirection,
  });
  const chart3MouseWheelZoomModifier = new MouseWheelZoomModifier();
  const chart3CursorModifier = new CursorModifier();
  const chart3XAxisDragModifier = new XAxisDragModifier();

  //-- Chart 3 Updates --//
  UpdateSuspender.using(chart3Surface, () => {
    //-- Set initial viewport size --//
    chart3Surface.changeViewportSize(
      INITIAL_WINDOW_INNER_WIDTH,
      INITIAL_WINDOW_INNER_WIDTH * initialChartTheme.chart3AspectRatio
    );
    chart3Surface.xAxes.add(chart3XAxis);
    chart3Surface.yAxes.add(new NumericAxis(wasmContext3, __surface3YAxis));
    chart3Surface.renderableSeries.add(macdHistogramRenderableSeriesChart3);
    chart3Surface.renderableSeries.add(macdMACDRenderableSeriesChart3);
    chart3Surface.renderableSeries.add(macdSignalRenderableSeriesChart3);
    chart3Surface.renderableSeries.add(rsiRenderableSeriesChart3);
    chart3Surface.chartModifiers.add(chart3ZoomExtentsModifier);
    chart3Surface.chartModifiers.add(chart3ZoomPanModifier);
    chart3Surface.chartModifiers.add(chart3MouseWheelZoomModifier);
    chart3Surface.chartModifiers.add(chart3CursorModifier);
    chart3Surface.chartModifiers.add(chart3XAxisDragModifier);
    // chart3Surface.applyTheme(initialChartTheme); // testing passing theme during surface initialization
    //-- Add to vertical group --//
    verticalGroup.addSurfaceToGroup(chart3Surface);
  });

  //-- ********************** CHART 4 ********************** --//
  //-- Surface4 x-axis --//
  const chart4XAxis = new CategoryAxis(wasmContext4, {
    //-- autoRange and growBy --//
    autoRange: EAutoRange.Never,
    growBy: new NumberRange(0, 0), //-- Fill space --//
    //-- Grid, Ticks, & Labels --//
    maxAutoTicks: 60,
    minorsPerMajor: 1,
    // labelProvider: new SmartDateLabelProvider(), // console error when attempting chart2 serialization: Setting or getting numericFormat is not supported for SmartDateLabelProvider
  });

  //-- Surface3 y-axis --//
  const __surface4YAxis = {
    //-- autoRange & growBy --//
    autoRange: EAutoRange.Always,
    growBy: new NumberRange(0, 0), //-- Fill space --//
    //-- Grid, Ticks, & Labels --//
    maxAutoTicks: 5,
    minorsPerMajor: 1,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
  };

  //-- Chart 4 Renderable Series --//
  //-- MACD data series & renderable series --//
  const macdHistogramDataSeriesChart4 = new XyDataSeries(wasmContext4, {
    dataSeriesName: "macdHistogramSeriesChart4",
    xValues: xValues,
    yValues: macdValues.histogram,
  });
  const macdMACDDataSeriesChart4 = new XyDataSeries(wasmContext4, {
    dataSeriesName: "macdMACDSeriesChart4",
    xValues: xValues,
    yValues: macdValues.macd,
  });
  const macdSignalDataSeriesChart4 = new XyDataSeries(wasmContext4, {
    dataSeriesName: "macdSignalSeriesChart4",
    xValues: xValues,
    yValues: macdValues.signal,
  });
  const macdHistogramChart4PaletteProvider = new MACDPaletteProviderChart4(
    macdHistogramDataSeriesChart4,
    initialDataTheme.macdHistogramSeriesChart4.above0,
    initialDataTheme.macdHistogramSeriesChart4.below0
  );
  const macdHistogramRenderableSeriesChart4 = new FastColumnRenderableSeries(
    wasmContext4,
    {
      dataSeries: macdHistogramDataSeriesChart4,
      isVisible: initialDataTheme.macdHistogramSeriesChart4.isVisible,
      opacity: initialDataTheme.macdHistogramSeriesChart4.opacity,
      strokeThickness:
        initialDataTheme.macdHistogramSeriesChart4.strokeThickness,
      dataPointWidth: initialDataTheme.macdHistogramSeriesChart4.dataPointWidth,
      paletteProvider: macdHistogramChart4PaletteProvider,
    }
  );
  const macdMACDRenderableSeriesChart4 = new FastLineRenderableSeries(
    wasmContext4,
    {
      dataSeries: macdMACDDataSeriesChart4,
      isVisible: initialDataTheme.macdMACDSeriesChart4.isVisible,
      opacity: initialDataTheme.macdMACDSeriesChart4.opacity,
      stroke: initialDataTheme.macdMACDSeriesChart4.stroke,
      strokeThickness: initialDataTheme.macdMACDSeriesChart4.strokeThickness,
      strokeDashArray: initialDataTheme.macdMACDSeriesChart4.strokeDashArray,
    }
  );
  const macdSignalRenderableSeriesChart4 = new FastLineRenderableSeries(
    wasmContext4,
    {
      dataSeries: macdSignalDataSeriesChart4,
      isVisible: initialDataTheme.macdSignalSeriesChart4.isVisible,
      opacity: initialDataTheme.macdSignalSeriesChart4.opacity,
      stroke: initialDataTheme.macdSignalSeriesChart4.stroke,
      strokeThickness: initialDataTheme.macdSignalSeriesChart4.strokeThickness,
      strokeDashArray: initialDataTheme.macdSignalSeriesChart4.strokeDashArray,
    }
  );

  //-- RSI data series & renderable series --//
  const rsiDataSeriesChart4 = new XyDataSeries(wasmContext4, {
    dataSeriesName: "rsiSeriesChart4",
    xValues: xValues,
    yValues: rsiValues,
  });
  const rsiRenderableSeriesChart4 = new FastLineRenderableSeries(wasmContext4, {
    dataSeries: rsiDataSeriesChart4,
    isVisible: initialDataTheme.rsiSeriesChart4.isVisible,
    opacity: initialDataTheme.rsiSeriesChart4.opacity,
    stroke: initialDataTheme.rsiSeriesChart4.stroke,
    strokeThickness: initialDataTheme.rsiSeriesChart4.strokeThickness,
    strokeDashArray: initialDataTheme.rsiSeriesChart4.strokeDashArray,
  });

  //-- Chart 4 modifiers --//
  const chart4ZoomExtentsModifier = new ZoomExtentsModifier();
  const chart4ZoomPanModifier = new ZoomPanModifier({
    xyDirection: EXyDirection.XDirection,
  });
  const chart4MouseWheelZoomModifier = new MouseWheelZoomModifier();
  const chart4CursorModifier = new CursorModifier();
  const chart4XAxisDragModifier = new XAxisDragModifier();

  //-- Chart 4 Updates --//
  UpdateSuspender.using(chart4Surface, () => {
    //-- Set initial viewport size --//
    chart4Surface.changeViewportSize(
      INITIAL_WINDOW_INNER_WIDTH,
      INITIAL_WINDOW_INNER_WIDTH * initialChartTheme.chart4AspectRatio
    );
    chart4Surface.xAxes.add(chart4XAxis);
    chart4Surface.yAxes.add(new NumericAxis(wasmContext4, __surface4YAxis));
    chart4Surface.renderableSeries.add(macdHistogramRenderableSeriesChart4);
    chart4Surface.renderableSeries.add(macdMACDRenderableSeriesChart4);
    chart4Surface.renderableSeries.add(macdSignalRenderableSeriesChart4);
    chart4Surface.renderableSeries.add(rsiRenderableSeriesChart4);
    chart4Surface.chartModifiers.add(chart4ZoomExtentsModifier);
    chart4Surface.chartModifiers.add(chart4ZoomPanModifier);
    chart4Surface.chartModifiers.add(chart4MouseWheelZoomModifier);
    chart4Surface.chartModifiers.add(chart4CursorModifier);
    chart4Surface.chartModifiers.add(chart4XAxisDragModifier);
    // chart4Surface.applyTheme(initialChartTheme); // testing passing theme during surface initialization
    //-- Add to vertical group --//
    verticalGroup.addSurfaceToGroup(chart4Surface);
  });

  //-- **************** OTHER ******************--//
  //-- Subscribe to visibleRangeChanged events, using callbacks to synchronize charts --//
  chart1XAxis.visibleRangeChanged.subscribe((x) => {
    chart2XAxis.visibleRange = x.visibleRange;
    chart3XAxis.visibleRange = x.visibleRange;
    chart4XAxis.visibleRange = x.visibleRange;
  });
  chart2XAxis.visibleRangeChanged.subscribe((x) => {
    chart1XAxis.visibleRange = x.visibleRange;
    chart3XAxis.visibleRange = x.visibleRange;
    chart4XAxis.visibleRange = x.visibleRange;
  });
  chart3XAxis.visibleRangeChanged.subscribe((x) => {
    chart1XAxis.visibleRange = x.visibleRange;
    chart2XAxis.visibleRange = x.visibleRange;
    chart4XAxis.visibleRange = x.visibleRange;
  });
  chart4XAxis.visibleRangeChanged.subscribe((x) => {
    chart1XAxis.visibleRange = x.visibleRange;
    chart2XAxis.visibleRange = x.visibleRange;
    chart3XAxis.visibleRange = x.visibleRange;
  });
  //-- Set custom visible range for initial render --//
  chart1XAxis.visibleRange = new NumberRange(0, resultsCount - 1);

  return {
    //-- Chart 1 --//
    chart1Surface,
    chart1XAxis,
    ohlcDataSeries,
    ohlcRenderableSeries,
    ema12VWDataSeries,
    ema12VWRenderableSeries,
    abandsLowerDataSeries,
    abandsLowerRenderableSeries,
    abandsMiddleDataSeries,
    abandsMiddleRenderableSeries,
    abandsUpperDataSeries,
    abandsUpperRenderableSeries,
    //-- Chart 2 --//
    chart2Surface,
    chart2XAxis,
    volumeDataSeries,
    volumeRenderableSeries,
    //-- Chart 3 --//
    chart3Surface,
    chart3XAxis,
    macdHistogramDataSeriesChart3,
    macdHistogramRenderableSeriesChart3,
    macdMACDDataSeriesChart3,
    macdMACDRenderableSeriesChart3,
    macdSignalDataSeriesChart3,
    macdSignalRenderableSeriesChart3,
    rsiDataSeriesChart3,
    rsiRenderableSeriesChart3,
    //-- Chart 4 --//
    chart4Surface,
    chart4XAxis,
    macdHistogramDataSeriesChart4,
    macdHistogramRenderableSeriesChart4,
    macdMACDDataSeriesChart4,
    macdMACDRenderableSeriesChart4,
    macdSignalDataSeriesChart4,
    macdSignalRenderableSeriesChart4,
    rsiDataSeriesChart4,
    rsiRenderableSeriesChart4,
  };
}

//-- Returns green / red fills and strokes matching OHLC candles --//
export class VolumePaletteProvider {
  constructor(ohlcDataSeries, volumeUpColor, volumeDownColor) {
    this.name = "VolumePaletteProvider";
    this.ohlcDataSeries = ohlcDataSeries;
    this.volumeUpRGBA = parseColorToUIntArgb(volumeUpColor);
    this.volumeDownRGBA = parseColorToUIntArgb(volumeDownColor);
  }
  onAttached() {}
  onDetached() {}
  overrideFillArgb(xValue, yValue, index) {
    const open = this.ohlcDataSeries.getNativeOpenValues().get(index);
    const close = this.ohlcDataSeries.getNativeCloseValues().get(index);
    return close >= open ? this.volumeUpRGBA : this.volumeDownRGBA;
  }
  overrideStrokeArgb(xValue, yValue, index) {
    return this.overrideFillArgb(xValue, yValue, index);
  }
  // for serialization
  toJSON() {
    return {
      type: EPaletteProviderType.Custom,
      customType: this.name,
      options: this.options,
    };
  }
}

//--- Register Volume Palette Provider with Chart Builder API --//
// chartBuilder.registerType(
//   EBaseType.PaletteProvider,
//   VolumePaletteProvider.name,
//   (options) => new VolumePaletteProvider(options)
// );

//-- MACD Palette Provider for Chart 3 --//
class MACDPaletteProviderChart3 {
  constructor(macdHistogramDataSeriesChart3, above0Color, below0Color) {
    this.macdHistogramDataSeriesChart3 = macdHistogramDataSeriesChart3;
    this.above0ColorRGBA = parseColorToUIntArgb(above0Color);
    this.below0ColorRGBA = parseColorToUIntArgb(below0Color);
  }
  onAttached() {}
  onDetached() {}
  overrideFillArgb(xValue, yValue, index) {
    const y = this.macdHistogramDataSeriesChart3.getNativeYValues().get(index);
    return y >= 0 ? this.above0ColorRGBA : this.below0ColorRGBA;
  }
  overrideStrokeArgb(xValue, yValue, index) {
    return this.overrideFillArgb(xValue, yValue, index);
  }
  // for serialization
  toJSON() {
    return {
      type: EPaletteProviderType.Custom,
      customType: this.name,
      options: this.options,
    };
  }
}

//-- MACD Palette Provider for Chart 4 --//
class MACDPaletteProviderChart4 {
  constructor(macdHistogramDataSeriesChart4, above0Color, below0Color) {
    this.macdHistogramDataSeriesChart4 = macdHistogramDataSeriesChart4;
    this.above0ColorRGBA = parseColorToUIntArgb(above0Color);
    this.below0ColorRGBA = parseColorToUIntArgb(below0Color);
  }
  onAttached() {}
  onDetached() {}
  overrideFillArgb(xValue, yValue, index) {
    const y = this.macdHistogramDataSeriesChart4.getNativeYValues().get(index);
    return y >= 0 ? this.above0ColorRGBA : this.below0ColorRGBA;
  }
  overrideStrokeArgb(xValue, yValue, index) {
    return this.overrideFillArgb(xValue, yValue, index);
  }
  // for serialization
  toJSON() {
    return {
      type: EPaletteProviderType.Custom,
      customType: this.name,
      options: this.options,
    };
  }
}
