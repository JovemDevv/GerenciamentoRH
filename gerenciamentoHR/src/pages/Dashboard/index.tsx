import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { getAllProfiles } from "../../shared/services/profile";
import { User } from "../../domains/users/types/User";

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        setUser(userAuth);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profilesData = await getAllProfiles(); // Obtém os perfis cadastrados
        setProfiles(profilesData);
      } catch (error) {
        console.error("Erro ao buscar os perfis:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          {user && (
            <Box boxShadow={3} p={3} bgcolor="background.paper">
              <Typography variant="h4" gutterBottom>
                {user.displayName
                  ? `${user.displayName}`
                  : "Nome do Usuário: Nome não fornecido"}
              </Typography>
              {user.email && (
                <Typography variant="subtitle1">
                  Email do Usuário: {user.email}
                </Typography>
              )}
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box mt={3} ml={25}>
            <Link to="/users" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" size="large">
                Ver Funcionários
              </Button>
            </Link>
          </Box>
          <Box mt={3} mb={3} ml={25}>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Typography variant="h5" align="center" gutterBottom>
          Funcionários Cadastrados
        </Typography>
        <List>
          {profiles.map((profile, index) => (
            <Paper
              elevation={6}
              key={profile.id}
              style={{ marginBottom: index !== profiles.length - 1 ? 7 : 0 }}
            >
              <ListItem>
                <ListItemText
                  primary={profile.fullName}
                  secondary={`Cargo: ${profile.position}`}
                />
                <Link
                  to={`/historico/${profile.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="outlined" color="primary">
                    Informações
                  </Button>
                </Link>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Box>
    </Container>
  );
}
