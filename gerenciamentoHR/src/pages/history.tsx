import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProfile } from "../shared/services/profile";
import { User } from "../domains/users/types/User";
import {
  Container,
  Grid,
  Typography,
  Avatar,
  Paper,
  Button,
} from "@mui/material";
import PageTitle from "../components/PageTitle";
import Breadcrumbs from "../components/Breadcrumbs";
import { obterHistoricoAtualizacoesUsuario } from "../shared/services/profile";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

function Historico() {
  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id !== undefined) {
          const fetchedData = await getProfile(id);
          setUserData(fetchedData as User);
          // Buscar histórico de atualizações quando o perfil do usuário for carregado
          const historicalData = await obterHistoricoAtualizacoesUsuario(id);
          setUpdates(historicalData); // Atualizar o estado das atualizações
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setError(error as Error);
      }
    };

    if (id !== undefined) {
      fetchData();
    }
  }, [id]);

  if (error) {
    return (
      <div>
        <h2>Ocorreu um erro:</h2>
        <pre>{error.message}</pre>
      </div>
    );
  }

  if (!userData) {
    return <div>Carregando...</div>;
  }

  function calculateAge(birthDate: Date) {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  }

  const birthDate =
    userData.birthDate instanceof Date
      ? userData.birthDate
      : new Date(userData.birthDate);
  const age = calculateAge(birthDate);

  const generatePDF = async () => {
    try {
      const response = await fetch("https://seu-microservico-url/gerar-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      window.open(data.pdfUrl, "_blank");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
  };

  return (
    <Container>
      <Breadcrumbs
        path={[
          { label: "Funcionários", to: "/users/" },
          { label: "Histórico" },
        ]}
      />
      <PageTitle title="Informações" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Avatar
              src={userData.profilePicture || undefined}
              alt="Foto de Perfil"
              sx={{
                width: 200,
                height: 200,
                margin: "0 auto",
              }}
            />
            <Typography variant="h4" align="center">
              {userData.fullName}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3}>
            <Typography variant="h6">Detalhes empregadícios</Typography>
            <Typography>Cargo: {userData.position}</Typography>
            <Typography>Setor: {userData.department}</Typography>
            <Typography>Salário: {userData.salary}</Typography>
            <Typography>Situação: {userData.situacion}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3}>
            <Typography variant="h6">Informações Pessoais</Typography>
            <Typography>Idade: {age}</Typography>
            <Typography>Documento: {userData.document}</Typography>
            <Typography>Email: {userData.email}</Typography>
            <Typography>Celular: {userData.mobile}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={6}>
            <Typography variant="h6">Endereço do funcionário</Typography>
            <Typography>Endereço: {userData.addressName}</Typography>
            <Typography>Bairro: {userData.neighborhood}</Typography>
            <Typography>CEP: {userData.zipCode}</Typography>
            <Typography>Número: {userData.number}</Typography>
            <Typography>Cidade: {userData.city}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        sx={{ mt: 3, mr: 4 }}
      >
        Gerar PDF
      </Button>
      <Link to="/users">
        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
          Voltar
        </Button>
      </Link>
      <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
        <PageTitle title="Histórico" />
        <Paper elevation={6}>
          {updates.map((update, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <Typography variant="h6">{`Atualização: ${
                index + 1
              }`}</Typography>
              <Typography>
                Data e Hora:{" "}
                {format(new Date(update.timestamp), "dd/MM/yyyy HH:mm:ss", {
                  locale: ptBR,
                })}
              </Typography>
              <Typography>Campo: {update.field}</Typography>
              <Typography>Valor Antigo: {update.oldValue}</Typography>
              <Typography>Novo Valor: {update.newValue}</Typography>
              <hr />
            </div>
          ))}
        </Paper>
      </Grid>
    </Container>
  );
}

export default Historico;
