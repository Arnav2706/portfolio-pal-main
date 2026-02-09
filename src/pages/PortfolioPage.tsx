import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getPortfolio } from "@/services/stockApi";
import { Loader2 } from "lucide-react";

interface Holding {
  stock_id: number;
  stock_symbol: string;
  company_name: string;
  total_quantity: number;
  average_price: number;
  current_price: number;
  profit_loss: number;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const PortfolioPage = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPortfolio()
      .then((res) => setHoldings(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load portfolio"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );

  if (error)
    return (
      <AppLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">{error}</div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Portfolio</h1>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium text-right">Qty</th>
                <th className="px-5 py-3 font-medium text-right">Avg Price</th>
                <th className="px-5 py-3 font-medium text-right">Current</th>
                <th className="px-5 py-3 font-medium text-right">P/L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    No holdings yet. Add your first transaction!
                  </td>
                </tr>
              ) : (
                holdings.map((h) => (
                  <tr key={h.stock_id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3 font-semibold text-foreground">{h.stock_symbol}</td>
                    <td className="px-5 py-3 text-muted-foreground">{h.company_name}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{h.total_quantity}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{formatCurrency(h.average_price)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{formatCurrency(h.current_price)}</td>
                    <td className={`px-5 py-3 text-right tabular-nums font-semibold ${h.profit_loss >= 0 ? "text-success" : "text-destructive"}`}>
                      {h.profit_loss >= 0 ? "+" : ""}
                      {formatCurrency(h.profit_loss)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default PortfolioPage;
