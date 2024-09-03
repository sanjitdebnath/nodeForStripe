const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const cors = require('cors');
const path = require('path');
app.use(express.json())
app.use(cors());




app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

