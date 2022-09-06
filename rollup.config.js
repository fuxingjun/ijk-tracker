import tsPlugin from "rollup-plugin-typescript2"
import dtsPlugin from "rollup-plugin-dts"
import path from "path"

export default [
  {
    input: "./src/core/index.ts",
    output: [
      {
        file: path.resolve(__dirname, "./dist/index.esm.js"),
        format: "es",
      },
      {
        file: path.resolve(__dirname, "./dist/index.cjs.js"),
        format: "cjs",
      },
      {
        file: path.resolve(__dirname, "./dist/index.js"),
        format: "umd",
        name: "tracker"
      },
    ],
    plugins: [
      tsPlugin(),
    ],
  },
  {
    input: "./src/core/index.ts",
    output: {
      file: path.resolve(__dirname, "./dist/index.d.ts"),
      format: "es",
    },
    plugins: [
      dtsPlugin(),
    ],
  },
]
