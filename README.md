
## Moretrees
This project is an attempt at creating a web app where awareness towards the conservation of trees is spread and a place where they can donate for the same cause.

## Set up env

Will require node and npm.

Create a .env file in the root of the directory.
```
RAZZLE_TEST_ENDPOINT=http://localhost:<port of the server>
RAZZLE_RUNTIME_TEST_ENDPOINT=http://localhost:<port of the server>
RAZZLE_RUNTIME_RAZORPAY_TEST_KEY=rzp_test_key
RAZZLE_RUNTIME_DISABLE_CAPTCHA=true
```
RAZZLE_RUNTIME_RAZORPAY_TEST_KEY is needed if checkout has to be initiated.


## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all projects dependencies mentioned in package.json.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://create-react-ssr-app.dev/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://create-react-ssr-app.dev/docs/deployment) for more information.


