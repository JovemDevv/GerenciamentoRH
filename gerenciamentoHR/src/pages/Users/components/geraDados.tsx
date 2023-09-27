import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, Grid, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';


// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white',
    
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  
  },
  title: {
    fontSize: 23,
    marginBottom: 10,
    textAlign: 'center', // Centralizar o título
    color: "#121977", 
  },
  subTitle:{
    fontSize: 17,
    textDecoration: 'underline',
    textAlign: 'center', // Centralizar o título
    color: "#121977",

  },

  content: {
    padding: 2,
    flexDirection: 'row',
    marginBottom: 10,
  },
  column: {
    flexDirection: 'row', // Organizar em duas colunas
    justifyContent: 'space-between', // Espaço entre as colunas
    paddingTop: 20,
    alignItems:"center",
  },
  columnItem: {
    width: '50%', // Largura das colunas
    
  },

  text1:{
    marginBottom:10,
    fontSize: 12,
    textAlign: 'center'
  },
  text2:{
    marginBottom:10,
    fontSize: 12,
    textAlign: 'center'
  },
});

const Detalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<any | null>(null);

  useEffect(() => {
    fetchEmployeeDetails(id || ''); // Usando uma string vazia como valor padrão
  }, [id]);

  // Função para buscar os detalhes do funcionário (substitua por sua própria lógica)
  const fetchEmployeeDetails = (employeeId: string) => {
    // Aqui você pode fazer uma chamada à API ou acessar dados de localStorage, etc.
    // Substitua este exemplo pelo código real de busca de dados do funcionário
    const employeeData = {
      id: employeeId,
      fullName: 'Nome do Funcionário',
      position: 'Cargo do Funcionário',
      department: 'Departamento do Funcionário',
      situacion: 'Trabalhando',
      // Adicione outros campos de dados do funcionário aqui
    };

    setEmployee(employeeData);
  };

  // Componente de PDF para os detalhes do funcionário
  // Componente de PDF para os detalhes do funcionário
const EmployeePdf = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Detalhes do Funcionário</Text>
          <View style={styles.column}>
            <View style={styles.columnItem}>
              <Text style={styles.content}>
                <Text style={styles.subTitle}>Nome:</Text>
                </Text>
                <Text style={styles.text1}>
                 {employee.fullName} 
              </Text>

              <Text style={styles.content}>
                <Text style={styles.subTitle}>Cargo:</Text> 
              </Text>
              <Text style={styles.text1}>
              {employee.position}
              </Text>
            </View>
            <View style={styles.columnItem}>
              <Text style={styles.content}>
                <Text style={styles.subTitle}>Departamento:</Text>
                </Text>
                <Text style={styles.text2}>
                 {employee.department}
              </Text>

              <Text style={styles.content}>
                <Text style={styles.subTitle}>Situação:</Text>
                </Text>
                <Text style={styles.text2}>
                 {employee.situacion}
              </Text>
            </View>
          </View>
          {/* Adicione aqui outros campos de dados do funcionário conforme necessário */}
        </View>
      </Page>
    </Document>
  );
  

  return (
    <Box>
      <Card>
        <CardHeader
          title={`Detalhes do Funcionário ID: ${id}`}
          action={
            <Button
              component={RouterLink}
              to="/users"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
            >
              Voltar
            </Button>
          }
        />
        <CardContent>
          {employee ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6">Nome:</Typography>
                <Typography>{employee.fullName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Cargo:</Typography>
                <Typography>{employee.position}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Departamento:</Typography>
                <Typography>{employee.department}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Situação:</Typography>
                <Typography>{employee.situacion}</Typography>
              </Grid>
              {/* Adicione aqui outros campos de dados do funcionário conforme necessário */}
            </Grid>
          ) : (
            <Typography>Nenhum detalhe do funcionário encontrado.</Typography>
          )}
        </CardContent>
        {employee && (
          <PDFDownloadLink document={<EmployeePdf />} fileName={`Funcionario_${id}.pdf`}>
            {({ loading }) =>
              loading ? (
                <Button variant="contained" disabled>
                  Gerando PDF...
                </Button>
              ) : (
                <Button variant="contained" color="primary">
                  Gerar PDF
                </Button>
              )
            }
          </PDFDownloadLink>
        )}
      </Card>
    </Box>
  );
};

export default Detalhes;
