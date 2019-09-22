
import path from 'path';

import htmlMiddleware from './middleware/html';
import renderMiddleware from './middleware/render';
const express = require('express');

const publicPath = path.join(__dirname, '/public');
const app = express();

app.use(express.static(publicPath));
app.use(htmlMiddleware());
app.use(renderMiddleware());

export default app;
