
import path from 'path';

import renderMiddleware from './middleware/render';
const express = require('express');

const publicPath = path.join(__dirname, '/public');
const app = express();

app.use(express.static(publicPath));
// app.get('*', htmlMiddleware());
app.get('*', renderMiddleware());

export default app;
