const fs = require("fs");
const path = require("path");
const prependFile = require("prepend-file");
const FindFiles = require("file-regex");
const { minify } = require("terser");

const jsBuildPath = path.resolve(__dirname, "../build/js/");

const run = async () => {
  const [result] = await FindFiles(
    jsBuildPath,
    /FusionTimeChart-chunkFile-.*\.js/
  );

  const fusionTimeChunkPath = `${result.dir}/${result.file}`;

  const libInjectsPath = __dirname + "/libInjects/";
  const jqueryPath = libInjectsPath + "jquery.js";
  const fusionchartsJqueryPluginPath =
    libInjectsPath + "fusioncharts.jqueryplugin.js";
  const fusionchartsPath = libInjectsPath + "fusioncharts.js";
  const timeseriesPath = libInjectsPath + "timeseries.js";

  const jqueryFile = fs.readFileSync(jqueryPath).toString();
  const timeseriesFile = fs.readFileSync(timeseriesPath).toString();
  const fusionchartsFile = fs.readFileSync(fusionchartsPath).toString();
  const fusionchartsJqueryPluginFile = fs
    .readFileSync(fusionchartsJqueryPluginPath)
    .toString();

  const { code } = await minify(
    jqueryFile +
      fusionchartsFile +
      fusionchartsJqueryPluginFile +
      timeseriesFile,
    {
      mangle: false,
    }
  );
  // console.log(typeof code);
  prependFile.sync(fusionTimeChunkPath, code);
};
run();
