import api from "./api";

export const getDashboard = () => api.get("/dashboard");
export const getPortfolio = () => api.get("/portfolio");
export const getTransactions = () => api.get("/transactions");
export const getStocks = () => api.get("/stocks");
export const addTransaction = (data: {
  stock_id: number;
  transaction_type: "BUY" | "SELL";
  quantity: number;
  price: number;
  brokerage_fee: number;
}) => api.post("/transactions", data);

export const getWatchlist = () => api.get("/watchlist");
export const addToWatchlist = (stock_id: number) => api.post("/watchlist", { stock_id });
export const removeFromWatchlist = (stock_id: number) => api.delete(`/watchlist/${stock_id}`);
