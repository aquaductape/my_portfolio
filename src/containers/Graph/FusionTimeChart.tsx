// import FusionCharts from "fusioncharts";
// import TimeSeries from "fusioncharts/fusioncharts.timeseries";
// import $ from "jquery";
// import jQueryFusionCharts from "jquery-fusioncharts";
import { createEffect, onMount } from "solid-js";
import { WakaData, WakaSchema } from "../../ts";
import { isBrowser } from "../../utils";

const chartConfig = {
  type: "timeseries",
  renderAt: "container",
  width: "100%",
  height: "400",
  dataSource: {
    chart: {},
    // caption: {
    //   text: "Web visits & downloads"
    // },
    data: {},
    extensions: {
      standardRangeSelector: {
        enabled: "1",
        style: {
          "button-text:active": {
            fill: "rgb(158, 158, 158)",
          },
        },
      },
      customRangeSelector: {
        enabled: "0",
      },
    },
    // subcaption: {
    //   text: "since 2015"
    // },
    navigator: {
      enabled: false,
    },
    yAxis: [
      {
        title: "",
        plot: [
          {
            value: "Total",
            type: "column",
          },
        ],
        format: {
          suffix: "h",
        },
      },
    ],
    xaxis: {
      initialInterval: {
        from: "2019-16-11",
        to: "2019-21-11",
      },
    },
    series: "Project",
  },
};

const FusionTimeChart = ({
  fetchResult,
  setLoading,
}: {
  fetchResult: { res: [WakaData[], WakaSchema] };
  setLoading: (v: boolean) => void;
}) => {
  onMount(() => {
    if (!isBrowser) return;
    const [data, schema] = fetchResult.res;
    setLoading(false);

    // @ts-ignore
    const $ = window.$;
    // @ts-ignore
    const FusionCharts = window.FusionCharts;
    // @ts-ignore
    const TimeSeries = window.TimeSeries;
    // @ts-ignore
    const jQueryFusionCharts = window.jQueryFusionCharts;

    TimeSeries(FusionCharts); // Resolve Charts as dependency for FusionCharts.
    jQueryFusionCharts(FusionCharts); // Resolve FusionCharts as dependency for jqueryFusionCharts.

    const fusionDataStore = new FusionCharts.DataStore();
    // After that we are creating a DataTable by passing our data and schema as arguments
    const fusionTable = fusionDataStore.createDataTable(data, schema);
    chartConfig.dataSource.data = fusionTable;
    // @ts-ignore
    $("#chart-container").insertFusionCharts(chartConfig);
  });
  return <div id="chart-container"></div>;
};

export default FusionTimeChart;
