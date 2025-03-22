const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development", // Set the mode to "development" or "production"
    entry: "./src/index.js", // Entry point for the application
    output: {
        path: path.resolve(__dirname, "dist"), // Output directory
        filename: "bundle.js", // Output file name
        publicPath: "/", // Ensure the public path is set for SPA routing
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            "@": path.resolve(__dirname, "src"), // Ensure this alias points to the correct directory
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html", // Path to your HTML template
            favicon: "./src/favicon.ico", // Path to your favicon
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"), // Ensure this serves the "dist" directory
        },
        historyApiFallback: {
            index: "index.html", // Serve index.html for all routes
        },
        port: 8080,
        open: true,
    },
};