import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Box, Button, Paper, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import PageTitle from "../../components/PageTitle";
import Grid from "./components/Grid";
import { auth } from "../../config/firebase";

export default function List() {
  const navigate = useNavigate(); // Inicialize useNavigate

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Desloga o usuário
      navigate("/"); // Redireciona para a tela de login
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1} mb={2}>
        <Box sx={{ flexGrow: 1 }}>
          <PageTitle title="Lista de Funcionários" />
          <Breadcrumbs
            path={[{ label: "Funcionários", to: "/users" }, { label: "Lista" }]}
          />
        </Box>
        <Box sx={{ alignSelf: "center" }}>
          <Button
            component={RouterLink}
            to="/users/new"
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
          >
            Adicionar Funcionário
          </Button>
        </Box>
        <Box sx={{ alignSelf: "center" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Box>
      </Stack>
      <Paper>
        <Grid />
        
      </Paper>
    </>
  );
}
