import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Paper,
  Alert,
} from "@mui/material";
import {
  PeopleAltOutlined as UsersIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

function UsersList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const fetchUsuarios = async (pageToFetch = pagina) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5016/api/User?pagina=${pageToFetch}&porPagina=${porPagina}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        throw new Error("No tienes permisos suficientes para acceder a esta sección.");
      }

      if (!response.ok) {
        throw new Error("Error al obtener el listado de usuarios.");
      }

      const data = await response.json();
      setUsuarios(data.usuarios || []);
      setTotalPaginas(data.totalPaginas || 1);
      setTotalRegistros(data.totalRegistros || 0);
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios(pagina);
  }, [pagina]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        animation: "fadeInUp 0.6s ease both",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                display: "inline-flex",
                p: 1,
                borderRadius: "12px",
                bgcolor: "rgba(56, 189, 248, 0.12)",
              }}
            >
              <UsersIcon sx={{ fontSize: 26, color: "#38bdf8" }} />
            </Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 700, color: "#f3f4f6" }}
            >
              Usuarios del Sistema
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#9ca3af" }}>
            Lista de usuarios con rol Usuario y su estado actual en la plataforma
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchUsuarios(pagina)}
          disabled={loading}
          sx={{
            borderColor: "rgba(255,255,255,0.1)",
            color: "#f3f4f6",
            textTransform: "none",
            borderRadius: "10px",
            "&:hover": {
              borderColor: "#38bdf8",
              bgcolor: "rgba(56, 189, 248, 0.08)",
            },
          }}
        >
          Actualizar
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Card
        sx={{
          bgcolor: "rgba(18, 18, 26, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 10,
            }}
          >
            <CircularProgress size={36} sx={{ color: "#38bdf8" }} />
          </Box>
        ) : usuarios.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
            <Typography variant="h6" sx={{ color: "#9ca3af", fontWeight: 500 }}>
              No se encontraron usuarios registrados con rol Usuario.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.02)",
                      "& th": {
                        color: "#9ca3af",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        borderColor: "rgba(255, 255, 255, 0.06)",
                        py: 2,
                      },
                    }}
                  >
                    <TableCell>USUARIO</TableCell>
                    <TableCell>CORREO ELECTRÓNICO</TableCell>
                    <TableCell>DOCUMENTO</TableCell>
                    <TableCell>FECHA REGISTRO</TableCell>
                    <TableCell align="center">ROL</TableCell>
                    <TableCell align="center">ESTADO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.map((user) => {
                    const formattedDate = user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-";

                    return (
                      <TableRow
                        key={user.id}
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.03)",
                          },
                          "& td": {
                            borderColor: "rgba(255, 255, 255, 0.05)",
                            py: 2,
                          },
                        }}
                      >
                        {/* Usuario */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: "rgba(56, 189, 248, 0.15)",
                                color: "#38bdf8",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                              }}
                            >
                              {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                            </Avatar>
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  color: "#f3f4f6",
                                  fontSize: "0.92rem",
                                }}
                              >
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#6b7280" }}
                              >
                                ID: #{user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Email */}
                        <TableCell sx={{ color: "#d1d5db", fontSize: "0.9rem" }}>
                          {user.email}
                        </TableCell>

                        {/* Documento */}
                        <TableCell sx={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                          {user.documentType ? `${user.documentType} ` : ""}
                          {user.documentNumber || "-"}
                        </TableCell>

                        {/* Fecha Registro */}
                        <TableCell sx={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                          {formattedDate}
                        </TableCell>

                        {/* Rol */}
                        <TableCell align="center">
                          <Chip
                            label={user.role || "Usuario"}
                            size="small"
                            sx={{
                              bgcolor: "rgba(56, 189, 248, 0.1)",
                              color: "#38bdf8",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                              border: "1px solid rgba(56, 189, 248, 0.2)",
                            }}
                          />
                        </TableCell>

                        {/* Estado */}
                        <TableCell align="center">
                          <Chip
                            icon={
                              user.isActive ? (
                                <ActiveIcon sx={{ "&&": { color: "#10b981", fontSize: 16 } }} />
                              ) : (
                                <InactiveIcon sx={{ "&&": { color: "#ef4444", fontSize: 16 } }} />
                              )
                            }
                            label={user.isActive ? "Activo" : "Desactivado"}
                            size="small"
                            sx={{
                              bgcolor: user.isActive
                                ? "rgba(16, 185, 129, 0.12)"
                                : "rgba(239, 68, 68, 0.12)",
                              color: user.isActive ? "#10b981" : "#ef4444",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                              border: user.isActive
                                ? "1px solid rgba(16, 185, 129, 0.2)"
                                : "1px solid rgba(239, 68, 68, 0.2)",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                p: 2.5,
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Typography sx={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                Mostrando {usuarios.length} de {totalRegistros} usuarios
              </Typography>

              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={pagina === 1}
                  onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                  sx={{
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#f3f4f6",
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": {
                      borderColor: "#38bdf8",
                      bgcolor: "rgba(56, 189, 248, 0.08)",
                    },
                  }}
                >
                  Anterior
                </Button>
                <Typography sx={{ color: "#9ca3af", fontSize: "0.85rem", px: 1 }}>
                  Página {pagina} de {totalPaginas || 1}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={pagina >= totalPaginas}
                  onClick={() => setPagina((prev) => prev + 1)}
                  sx={{
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#f3f4f6",
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": {
                      borderColor: "#38bdf8",
                      bgcolor: "rgba(56, 189, 248, 0.08)",
                    },
                  }}
                >
                  Siguiente
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
}

export default UsersList;
