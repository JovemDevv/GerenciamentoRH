import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProfile } from "../users/services/profile";
import { User } from "../users/types/User";
import {
  Container,
  Grid,
  Typography,
  Avatar,
  Paper,
  Button,
} from "@mui/material";
import { jsPDF } from "jspdf";
import PageTitle from "../users/components/PageTitle";
import Breadcrumbs from "../users/components/Breadcrumbs";
import { obterHistoricoAtualizacoesUsuario } from "../users/services/profile";
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

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.text(userData.fullName, doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Detalhes empregadícios", 20, 50);
    doc.line(20, 52, 95, 52);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Cargo: " + userData.position, 20, 60);
    doc.text("Setor: " + userData.department, 20, 70);
    doc.text("Situação: " + userData.situacion, 20, 90);
    doc.text("Salário: " + userData.salary, 20, 80);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Informações Pessoais", 20, 110);
    doc.line(20, 112, 90, 112);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Idade: " + age, 20, 120);
    doc.text("Documento: " + userData.document, 20, 130);
    doc.text("Email: " + userData.email, 20, 140);
    doc.text("Celular: " + userData.mobile, 20, 150);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Endereço do Funcionário", 20, 170);
    doc.line(20, 172, 98, 172);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Endereço: " + userData.addressName, 20, 180);
    doc.text("Número: " + userData.number, 20, 210);
    doc.text("Bairro: " + userData.neighborhood, 20, 190);
    doc.text("CEP: " + userData.zipCode, 20, 200);
    doc.text("Cidade: " + userData.city, 20, 220);

    doc.save(userData.fullName + ".pdf");
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
