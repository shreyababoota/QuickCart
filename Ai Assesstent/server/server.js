// Load .env from project root FIRST
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const chatRouter = require("./routes/chat");
const cartRouter = require("./routes/cart");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// DB test
app.get("/api/test-db", async (req, res) => {
  try {
    const [countResult, sampleResult, intentResult] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total FROM products"),
      pool.query("SELECT product_id, name, price, category, stock FROM products LIMIT 5"),
      pool.query("SELECT COUNT(*) AS total FROM intents"),
    ]);

    res.json({
      product_count:  Number(countResult.rows[0].total),
      intent_count:   Number(intentResult.rows[0].total),
      sample_products: sampleResult.rows,
    });
  } catch (err) {
    console.error("DB test error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Chat route
app.use("/api/chat", chatRouter);

// Cart intelligence route
app.use("/api/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health`);
  console.log(`   DB test: http://localhost:${PORT}/api/test-db`);
});
