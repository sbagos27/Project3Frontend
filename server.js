const express = require('express');
const path = require('path');
const app = express();

// 1. Serve static files from "dist"
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 3. Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
