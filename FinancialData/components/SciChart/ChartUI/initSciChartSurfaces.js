//-- React --//

//-- AWS SDK --//

//-- CHRT Components --//

//-- npm Package Functions --//
import { Thickness } from "scichart/Core/Thickness";

//-- npm Package Components --//
import { SciChartSurface } from "scichart";

//-- SX --//

export default async function initSciChartSurfaces(
  initialChartTheme, // ADDED
  chart1Height,
  chart2Height,
  chart3Height,
  chart4Height
) {
  let chart1Surface;
  let chart2Surface;
  let chart3Surface;
  let chart4Surface;
  let wasmContext1;
  let wasmContext2;
  let wasmContext3;
  let wasmContext4;

  //-- Create custom ISciChartLoader(s) to show while awaiting (loading) SciChartSurface(s) --//
  class CustomChart1Loader {
    addChartLoader(domChartRoot, theme) {
      const loaderContainerDiv1 = document.createElement("div");
      loaderContainerDiv1.style.backgroundColor = "#080"; // theme.loadingAnimationBackground;
      loaderContainerDiv1.style.height = `${chart1Height}px`;
      loaderContainerDiv1.style.width = "100%";

      domChartRoot.appendChild(loaderContainerDiv1);

      return loaderContainerDiv1;
    }
    removeChartLoader(domChartRoot, loaderElement) {
      setTimeout(() => {
        domChartRoot.removeChild(loaderElement);
      }, 0);
    }
  }
  class CustomChart2Loader {
    addChartLoader(domChartRoot, theme) {
      const loaderContainerDiv2 = document.createElement("div");
      loaderContainerDiv2.style.backgroundColor = "#080"; // theme.loadingAnimationBackground;s
      loaderContainerDiv2.style.height = `${chart2Height}px`;
      loaderContainerDiv2.style.width = "100%";

      domChartRoot.appendChild(loaderContainerDiv2);
      return loaderContainerDiv2;
    }
    removeChartLoader(domChartRoot, loaderElement) {
      setTimeout(() => {
        domChartRoot.removeChild(loaderElement);
      }, 0);
    }
  }
  class CustomChart3Loader {
    addChartLoader(domChartRoot, theme) {
      const loaderContainerDiv3 = document.createElement("div");
      loaderContainerDiv3.style.backgroundColor = "#080"; // theme.loadingAnimationBackground
      loaderContainerDiv3.style.height = `${chart3Height}px`;
      loaderContainerDiv3.style.width = "100%";

      domChartRoot.appendChild(loaderContainerDiv3);
      return loaderContainerDiv3;
    }
    removeChartLoader(domChartRoot, loaderElement) {
      setTimeout(() => {
        domChartRoot.removeChild(loaderElement);
      }, 0);
    }
  }
  class CustomChart4Loader {
    addChartLoader(domChartRoot, theme) {
      const loaderContainerDiv4 = document.createElement("div");
      loaderContainerDiv4.style.backgroundColor = "#080"; // theme.loadingAnimationBackground
      loaderContainerDiv4.style.height = `${chart4Height}px`;
      loaderContainerDiv4.style.width = "100%";

      domChartRoot.appendChild(loaderContainerDiv4);
      return loaderContainerDiv4;
    }
    removeChartLoader(domChartRoot, loaderElement) {
      setTimeout(() => {
        domChartRoot.removeChild(loaderElement);
      }, 0);
    }
  }

  //-- Create all 4 chart surfaces --//
  let [res1, res2, res3, res4] = await Promise.all([
    SciChartSurface.create("chart1div", {
      theme: initialChartTheme,
      // loader: new CustomChart1Loader(),
      disableAspect: true,
      padding: new Thickness(6, 6, 6, 6), //-- Top, Right, Bottom, Left --//
    }),
    SciChartSurface.create("chart2div", {
      theme: initialChartTheme,
      // loader: new CustomChart2Loader(),
      disableAspect: true,
      padding: new Thickness(0, 6, 6, 6), //-- Top, Right, Bottom, Left --//
    }),
    SciChartSurface.create("chart3div", {
      theme: initialChartTheme,
      // loader: new CustomChart3Loader(),
      disableAspect: true,
      padding: new Thickness(0, 6, 6, 6), //-- Top, Right, Bottom, Left --//
    }),
    SciChartSurface.create("chart4div", {
      theme: initialChartTheme,
      // loader: new CustomChart4Loader(),
      disableAspect: true,
      padding: new Thickness(0, 6, 6, 6), //-- Top, Right, Bottom, Left --//
    }),
  ]);

  chart1Surface = res1.sciChartSurface;
  chart2Surface = res2.sciChartSurface;
  chart3Surface = res3.sciChartSurface;
  chart4Surface = res4.sciChartSurface;
  wasmContext1 = res1.wasmContext;
  wasmContext2 = res2.wasmContext;
  wasmContext3 = res3.wasmContext;
  wasmContext4 = res4.wasmContext;

  return {
    chart1Surface,
    chart2Surface,
    chart3Surface,
    chart4Surface,
    wasmContext1,
    wasmContext2,
    wasmContext3,
    wasmContext4,
  };
}
