const express = require("express");
const path = require("path");
const app = express();
const reviewRoutes = require("./api/index");

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/reviews", reviewRoutes); // This line is CRUCIAL

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
