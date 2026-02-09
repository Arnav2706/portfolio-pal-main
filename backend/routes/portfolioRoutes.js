const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user.user_id;

  const [rows] = await db.query(
    `SELECT s.stock_id, s.stock_symbol, s.company_name,
            p.total_quantity, p.average_price,
            s.current_price,
            (p.total_quantity * s.current_price) -
            (p.total_quantity * p.average_price) AS profit_loss
     FROM portfolio p
     JOIN stocks s ON p.stock_id = s.stock_id
     WHERE p.user_id = ?`,
    [userId]
  );

  res.json(rows);
});

module.exports = router;