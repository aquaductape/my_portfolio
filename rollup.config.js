import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import del from "rollup-plugin-delete";
import md5File from "md5-file";
import sass from "sass";
import CleanCSS from "clean-css";
import { terser } from "rollup-plugin-terser";

const extensions = [".ts", ".tsx", ".jsx"];
const styleRegex = /^.*css|scss$/;
const sassRegex = /^.*scss$/;

export default [
  {
    input: "src/index.tsx",
    output: [
      {
        dir: "build/js",
        format: "esm",
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "[name]-chunkFile-[hash].js",
        assetFileNames: "[name].[hash][extname]",
      },
    ],
    preserveEntrySignatures: false,
    plugins: [
      del({ targets: "build" }),
      typescript(),
      nodeResolve({ extensions, exportConditions: ["solid"] }),
      babel({
        extensions,
        babelHelpers: "bundled",
        presets: [["solid", { generate: "dom", hydratable: true }]],
      }),
      copy({
        targets: [
          {
            src: ["public/favicon/*"],
            dest: "build/favicon",
          },
          {
            src: ["public/open-graph/*"],
            dest: "build/open-graph",
          },
          {
            src: ["public/robots.txt"],
            dest: "build",
          },
          {
            src: ["public/fonts/*"],
            dest: "build/fonts",
          },
          {
            src: ["public/styles/index.scss"],
            dest: "build/styles",
            transform: (contents, filename) => {
              if (!sassRegex.test(filename)) return contents.toString();
              const css = sass
                .renderSync({ file: `public/styles/${filename}` })
                .css.toString();
              return new CleanCSS({}).minify(css).styles;
            },
            rename: (name, extension, fullPath) => {
              if (styleRegex.test(extension)) {
                const hash = md5File.sync(fullPath);
                return `${name}-${hash}.css`;
              }

              return `${name}.${extension}`;
            },
          },
          {
            src: ["public/styles/fonts.css"],
            dest: "build/styles",
            transform: (contents) => {
              return new CleanCSS({}).minify(contents.toString()).styles;
            },
            rename: (name, extension, fullPath) => {
              if (styleRegex.test(extension)) {
                const hash = md5File.sync(fullPath);
                return `${name}-${hash}.css`;
              }

              return `${name}.${extension}`;
            },
          },
        ],
      }),
      terser(),
      url({
        limit: 0,
        emitsFiles: true,
        fileName: "[dirname][hash][extname]",
        destDir: "build/assets",
        publicPath: "assets/",
        include: [
          "**/*.pdf",
          "**/*.svg",
          "**/*.png",
          "**/*.jp(e)?g",
          "**/*.gif",
          "**/*.webp",
        ],
      }),
    ],
    // external: ["fusioncharts"],
  },
  {
    input: "ssg/index.jsx",
    output: [
      {
        dir: "ssg/lib",
        exports: "auto",
        format: "cjs",
      },
    ],
    external: [
      "solid-js",
      "solid-js/web",
      "node-fetch",
      // "@fortawesome/fontawesome-svg-core/styles.css",
      // "fusioncharts",
      // "jquery-fusioncharts",
      // "jquery",
    ],
    ignore: ["@fortawesome/fontawesome-svg-core/styles.css"],
    plugins: [
      del({ targets: "ssg/lib" }),
      typescript(),
      nodeResolve({
        extensions,
        preferBuiltins: true,
        exportConditions: ["solid"],
      }),
      babel({
        extensions,
        babelHelpers: "bundled",
        presets: [
          ["solid", { generate: "ssr", hydratable: true, async: true }],
        ],
      }),
      json(),
      url({
        limit: 0,
        emitsFiles: true,
        fileName: "[dirname][hash][extname]",
        destDir: "build/assets",
        publicPath: "assets/",
        include: [
          "**/*.pdf",
          "**/*.svg",
          "**/*.png",
          "**/*.jp(e)?g",
          "**/*.gif",
          "**/*.webp",
        ],
      }),
    ],
  },
];
