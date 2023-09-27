import { Box, Button, ListItem, ListItemText, Paper, Stack,  Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import Breadcrumbs from '../components/Breadcrumbs';
import { Link as RouterLink } from "react-router-dom"
import "./../style/history.css"

const Historico: React.FC = () => {
  const [userHistory, setUserHistory] = useState<any[] | null>(null);

  useEffect(() => {
    
    const userHistoryData = localStorage.getItem('users');

    if (userHistoryData) {
       
      const parsedUserHistory = JSON.parse(userHistoryData);
      setUserHistory(parsedUserHistory);
    }
  }, []);

return (
    <Stack>
    <Stack direction={{ xs: "column", sm: "row" }} gap={1} mb={2}>
        <Box sx={{ flexGrow: 1 }}>
          <PageTitle title="Lista de Funcionários" />
          <Breadcrumbs
            path={[{ label: "Funcionários", to: "/users" }, { label: "Histórico" }]}
          />
   </Box>
   
      </Stack>
  {userHistory &&
    userHistory.map((item, index) => (
        <Stack sx={{ padding: 2 }} className='card'>
        <Paper className='paper'>
        
       
        <ListItem  key={index}>
  <Grid container spacing={2}>
    {/* Coluna Esquerda: ID */}
    <Grid item xs={1}>
      <ListItemText
        primary={`ID: ${item.id}`}
      />
    </Grid>
    {/* Coluna Direita: Outras Informações */}
    <Grid item xs={9}>
      <ListItemText
        primary={`Nome: ${item.fullName}`}
        secondary={`Cargo: ${item.position}`}
      />
      <ListItemText
        primary={`Departamento: ${item.department}`}
        secondary={`Trabalhando/Dispensado: ${item.situacion}`}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
        <Button
          component={RouterLink}
          to="/historico/detalhes"
          variant="contained"
         
        >
          ver os dados cadastrais
        </Button>
        
      </Box>
    </Grid>
  </Grid>


              
            </ListItem>
            
            </Paper>
            </Stack>

          ))}
          
  
 </Stack>
  );
  
}

export default Historico