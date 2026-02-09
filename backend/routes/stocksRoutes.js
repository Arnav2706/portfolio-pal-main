const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET all stocks (for dropdown)
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT stock_id, stock_symbol, company_name FROM stocks"
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stocks" });
  }
});

module.exports = router;
