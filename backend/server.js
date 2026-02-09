const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/watchlist", require("./routes/watchlistRoutes"));
app.use("/api/stocks", require("./routes/stocksRoutes"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});