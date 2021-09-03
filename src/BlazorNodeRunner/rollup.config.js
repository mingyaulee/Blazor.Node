import json from "@rollup/plugin-json";
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/app.js',
    output: {
      dir: 'dist',
      format: 'iife' // immediately-invoked function expression — suitable for <script> tags
    },
    plugins: [
      json(),    // converts .json files to ES6 modules
      commonjs() // converts date-fns to ES modules
    ],
    external: [
      "path",
      "fs",
      "child_process",
      "readline",
      "jsdom",
      "node-fetch",
      "app.js"
    ]
  }
];