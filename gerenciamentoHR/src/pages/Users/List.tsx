import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Stack } from "@mui/material";
import Breadcrumbs from "../../components/Breadcrumbs";
import PageTitle from "../../components/PageTitle";
import Grid from "../../domains/users/components/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

export default function List() {
  const navigate = useNavigate();

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={1}
        mb={2}
        sx={{
          padding: 2, // Adicione algum espaço em torno do Stack
          alignItems: "center", // Centralize os elementos verticalmente
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <PageTitle title="Lista de Funcionários" />
          <Breadcrumbs
            path={[{ label: "Funcionários", to: "/users" }, { label: "Lista" }]}
          />
        </Box>
        <Box
          sx={{
            alignSelf: "center",
            mt: { xs: 1, sm: 0 }, // Margem superior menor em telas pequenas
          }}
        >
          <Button
            component={RouterLink}
            to="/users/new"
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
          >
            Adicionar Funcionário
          </Button>
        </Box>
        <Box
          sx={{
            alignSelf: "center",
            mt: { xs: 1, sm: 0 }, // Margem superior menor em telas pequenas
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
          >
            Voltar para o Dashboard
          </Button>
        </Box>
      </Stack>
      <Paper>
        <Grid />
      </Paper>
    </>
  );
}
