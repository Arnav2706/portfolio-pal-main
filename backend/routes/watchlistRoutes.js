const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user.user_id;

  const [rows] = await db.query(
    `SELECT s.stock_id, s.stock_symbol, s.company_name, s.current_price
     FROM watchlist w
     JOIN stocks s ON w.stock_id = s.stock_id
     WHERE w.user_id = ?`,
    [userId]
  );

  res.json(rows);
});

router.post("/", auth, async (req, res) => {
  const userId = req.user.user_id;
  const { stock_id } = req.body;

  await db.query(
    "INSERT IGNORE INTO watchlist (user_id, stock_id) VALUES (?, ?)",
    [userId, stock_id]
  );

  res.json({ message: "Added to watchlist" });
});

router.delete("/:stock_id", auth, async (req, res) => {
  const userId = req.user.user_id;
  const { stock_id } = req.params;

  await db.query(
    "DELETE FROM watchlist WHERE user_id = ? AND stock_id = ?",
    [userId, stock_id]
  );

  res.json({ message: "Removed from watchlist" });
});

module.exports = router;