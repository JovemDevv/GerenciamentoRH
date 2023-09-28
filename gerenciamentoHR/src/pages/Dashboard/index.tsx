import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box, Grid } from "@mui/material";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

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

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          {user && (
            <Box>
              <Typography variant="subtitle1">
                {user.displayName ? (
                  `Nome do Usuário: ${user.displayName}`
                ) : (
                  "Nome do Usuário: Nome não fornecido"
                )}
              </Typography>
              {user.email && (
                <Typography variant="subtitle1">
                  Email do Usuário: {user.email}
                </Typography>
              )}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Link to="/users">
              <Button variant="contained" color="primary">
                Ir para Usuários Cadastrados
              </Button>
            </Link>

            <Box mt={2}>
              <Button variant="outlined" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
