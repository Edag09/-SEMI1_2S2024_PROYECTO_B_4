const express = require("express");
const app = express();
const routes = require("./routes");

app.use("/", routes);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
