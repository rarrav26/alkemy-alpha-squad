import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function TransactionFiltersBar({ handleChange, filters, handleFilterChange }) {
  return (
    <Box
      sx={{
        minWidth: 200,
        width: { xs: "95vw", sm: "80vw", md: "50vw" },
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <FormControl sx={{ width: "50%" }}>
        <InputLabel id="demo-simple-select-label">
          Tipo de movimiento
        </InputLabel>
        <Select
          name="type"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filters.type}
          label="Todas"
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value={"all"}>Todas</MenuItem>
          <MenuItem value={"sent"}>Depósito</MenuItem>
          <MenuItem value={"recived"}>Transferencia</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{ width: "50%", display: "flex", justifyContent: "end" }}
      >
        <input
          type="date"
          name="fechaDesde"
          value={filters.fechaDesde}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            height: "100%",
            width: "40%",
          }}
        />
        <input
          type="date"
          name="fechaHasta"
          value={filters.fechaHasta}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            height: "100%",
            marginLeft: "0.5rem",
            width: "40%",
          }}
        />
      </Box>
    </Box>
  );
}

export default TransactionFiltersBar;
