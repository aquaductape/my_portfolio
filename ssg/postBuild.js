const fs = require("fs");
const path = require("path");
const prependFile = require("prepend-file");
const FindFiles = require("file-regex");
const { minify } = require("terser");

const jsBuildPath = path.resolve(__dirname, "../build/js/");

const runInjectFusionTimeChunk = async () => {
  const [result] = await FindFiles(
    jsBuildPath,
    /FusionTimeChart-chunkFile-.*\.js/
  );

  const fusionTimeChunkPath = `${result.dir}/${result.file}`;

  const postBuildLibPath = __dirname + "/postBuildLib/";
  const jqueryPath = postBuildLibPath + "jquery.js";
  const fusionchartsJqueryPluginPath =
    postBuildLibPath + "fusioncharts.jqueryplugin.js";
  const fusionchartsPath = postBuildLibPath + "fusioncharts.js";
  const timeseriesPath = postBuildLibPath + "timeseries.js";

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

const runInjectIndex = async () => {
  const [result] = await FindFiles(
    jsBuildPath,
    /index-.*\.js/
  );

  const indexPath = `${result.dir}/${result.file}`;

  const postBuildLibPath = __dirname + "/postBuildLib/";
  const fileSavePath = postBuildLibPath + "fileSave.js";

  const fileSaveFile = fs.readFileSync(fileSavePath).toString();

  prependFile.sync(indexPath, fileSaveFile);
};

runInjectFusionTimeChunk();
// doesnt work
// runInjectIndex()
