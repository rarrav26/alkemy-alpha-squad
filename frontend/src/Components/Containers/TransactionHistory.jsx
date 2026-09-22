import { Box, Card, Typography, Grid, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TransactionFiltersBar from "../TransactionFiltersBar";

function TransactionHistory({
  limit = null,
  showFilters = true,
  title = "Mis Movimientos",
}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "all",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const params = new URLSearchParams({
          pagina: pagina,
          porPagina: 10,
        });

        if (filters.fechaDesde) params.append("fechaDesde", filters.fechaDesde);
        if (filters.fechaHasta) params.append("fechaHasta", filters.fechaHasta);
        if (filters.type && filters.type !== "all")
          params.append("tipo", filters.type);

        const response = await fetch(
          `http://localhost:5016/api/Transactions?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("No se pudieron cargar las transacciones");
        }

        const data = await response.json();
        const txs = limit
          ? data.transacciones.slice(0, limit)
          : data.transacciones;
        setTransactions(txs);
        setTotalPaginas(data.totalPaginas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [pagina, filters.fechaDesde, filters.fechaHasta, filters.type, limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagina(1);
  };

  if (loading) return <p>Cargando transfeerencias...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box
      sx={{
        minHeight: limit ? "auto" : "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: limit ? "flex-start" : "space-around",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography
        component="h2"
        variant={limit ? "h6" : "h3"}
        sx={{
          my: limit ? { xs: 1, sm: 1.5 } : { xs: 3, sm: 4, md: 5 },
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        {title}
      </Typography>
      {limit && (
        <Button
          component={Link}
          to="/transactionHistory"
          size="small"
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Ver todos
        </Button>
      )}
      {showFilters && !limit && (
        <Box>
          <TransactionFiltersBar
            handleChange={handleFilterChange}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </Box>
      )}
      {transactions.length === 0 ? (
        <Box
          sx={{
            width: "50vw",
            height: "50vh",
            margin: "2rem auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <img
            src="/Assets/Empty-history.jpg"
            alt="Error message"
            loading="lazy"
            style={{ maxWidth: "40%", height: "auto" }}
          />
          <Typography variant="h4" component="h3" fontWeight="bold">
            No tienes transferencias registradas.
          </Typography>
          <Typography variant="body1" component="p" fontWeight="bold">
            No tienes transferencias registradas.
          </Typography>
          <Link
            to="/dashboard"
            style={{
              fontWeight: "bold",
              textTransform: "none",
              p: 0,
              minWidth: 0,
              textDecoration: "none",
            }}
          >
            Hacé un deposito
          </Link>
        </Box>
      ) : (
        <>
          <Grid
            container
            spacing={2}
            sx={{
              width: { xs: "95vw", sm: "80vw", md: "50vw" },
              margin: "0 auto",
              flexDirection: "column",
            }}
          >
            {transactions.map((tx) => {
              const isCredit = tx.tipo === "Crédito";
              const formattedDate = new Date(tx.date).toLocaleString();

              return (
                <Grid item xs={12} key={tx.id}>
                  <Card
                    sx={{
                      width: "100%",
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.200",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      {tx.tipo.charAt(0)}
                    </Box>

                    <Box sx={{ flex: 1, textAlign: "left" }}>
                      <Typography fontWeight="bold">
                        {tx.description || tx.tipo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formattedDate}
                      </Typography>
                    </Box>

                    <Typography
                      fontWeight="bold"
                      color={isCredit ? "success.main" : "error.main"}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {isCredit
                        ? `+$${tx.amount.toFixed(2)}`
                        : `-$${tx.amount.toFixed(2)}`}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          {!limit && (
            <Box sx={{ display: "flex", gap: 2, mt: 4, alignItems: "center" }}>
              <Button
                variant="contained"
                disabled={pagina === 1}
                onClick={() => setPagina((prev) => prev - 1)}
              >
                Anterior
              </Button>
              <Typography>
                Página {pagina} de {totalPaginas || 1}
              </Typography>
              <Button
                variant="contained"
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina((prev) => prev + 1)}
              >
                Siguiente
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default TransactionHistory;
