
const express = require('express');
const app = express();
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
