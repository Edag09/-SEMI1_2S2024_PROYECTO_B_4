const express = require("express");
const cors = require('cors');
const app = express();
const routes = require("./routes");

app.use(cors());
app.use("/", routes);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
