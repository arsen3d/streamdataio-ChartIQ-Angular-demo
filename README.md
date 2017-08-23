# Streamdata.io - ChartIQ Angular demo

[ ![Codeship Status for ChartIQ/Charting-Library---Angular-Seed-Project](https://app.codeship.com/projects/0b85d6c0-4010-0135-fa79-62e905eb1dfe/status?branch=master)](https://app.codeship.com/projects/229967)
[![dependencies Status](https://david-dm.org/ChartIQ/Charting-Library---Angular-2.0-Seed-Project/status.svg)](https://david-dm.org/ChartIQ/Charting-Library---Angular-2.0-Seed-Project)

- [Questions and support](#questions-and-support)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Contributing to this project](#contributing-to-this-project)

A sample build of the ChartIQ library within the Angular framework, and using Streamdata.io for real time updates. This provides an example of how to implement real time updated graphs in the charting library. This is not a comprehensive example, more like a good starting point for an Angular developer.

## Questions and support

If you have questions or get stuck using this project or the ChartIQ library, the dev support team can be reached through [dev@chartiq.com](mailto:dev@chartiq.com).
If you have questions or remarks related to the use of Streamdata.io, please contact [support@streamdata.io](mailto:support@streamdata.io).

## Requirements

- A copy of the ChartIQ library, version 3.0+ is required. To get your copy, visit https://www.chartiq.com/products/html5-charting-library/ to see a demo and get in touch with us.
- A Streamdata.io token. You can get one for free on streamdata.io https://portal.streamdata.io/#/register.
- [node.js](https://nodejs.org/) installed version 5+
- NPM installed (version 3+) or [Yarn](https://yarnpkg.com/en/)


## Getting started

- Clone this repository.
- Extract the contents of your zipped copy of the library into `src/chartiq_library/`. You should now have the folders `src/chartiq_library/css` and `src/chartiq_library/js`. You may be prompted about overwriting the contents of `src/chartiq_librar/js`. These pre-existing files are just stub files and should be overwritten.
- Update src/app/chart_service/chart.service.ts, and replace your token at line 20
> super(chart, "http://stockmarket.streamdata.io/v2/prices", "<your token>");
- Run `npm install` to install dependencies. It is strongly recommended to not have any of the dependencies installed globally.
- Run `npm start` to start up the dev server.
- Open your browser to [`http://localhost:3000`](http://localhost:3000).
- If you want to use another port, open `package.json` file, then change the `server` script from `--port 3000` to the desired port number. A full list of webpack-dev-server command line options can be found [here](https://webpack.js.org/api/cli/#common-options).

## Contributing to this project

If you wish to contribute to this project, fork it and send us a pull request.
We'd love to see what it is you want to do with our charting tools!
