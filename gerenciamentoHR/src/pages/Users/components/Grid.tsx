import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DataTable from "../../../components/DataTable";
import { User } from "../types/User";
import { getAllProfiles, deleteProfile, getProfile} from "../../../services/profile";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import HistoryIcon from '@mui/icons-material/History';

export default function Grid() {
  const [profileData, setProfileData] = useState<User[]>([]);
  const navigate = useNavigate();
  const { id } = useParams(); // Obtém o ID da rota usando o React Router
  const [formData, setFormData] = useState<User>();

  const onCall = (params: GridRenderCellParams) => {
    if (!params.row.mobile) return;
    window.location.href = `https://wa.me/55${params.row.mobile.replace(/[^\d]+/g, "")}`;
  };

  const onEdit = async (params: GridRenderCellParams) => {
    if (!params.row.id) return;
  
    try {
      const userData = await getProfile(params.row.id); // Chama a função para buscar os dados do usuário com base no ID
      console.log("Dados do usuário carregados com sucesso:", userData);
  
      // Navegue para a página de edição e passe os dados do usuário como parâmetro
      navigate(`/users/${params.row.id}`, { state: { userData } });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };
  

  const onDelete = async (params: GridRenderCellParams) => {
    if (!params.row.id) return;
    try {
      const profileId = params.row.id; // Obtenha o ID real do perfil no Firestore
      // Chame a função para excluir o perfil do banco de dados usando o ID real
      await deleteProfile(profileId);
      // Atualize os dados locais após a exclusão
      setProfileData((prevData) =>
        prevData.filter((user) => user.id !== profileId)
      );
    } catch (error) {
      console.error("Erro ao excluir o perfil:", error);
      // Adicione um feedback de erro para o usuário, se necessário
    }
  };
  
  
  const columns: GridColDef<User>[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "firstName",
      headerName: "Nome",
      valueGetter: (params) =>
        `${params.row.fullName.split(" ")?.shift() || ""}`,
    },
    {
      field: "profilePicture",
      headerName: "Foto",
      width: 100,
      renderCell: (params) => (
        <Avatar
          alt="Foto de Perfil"
          src={params.value} // Suponha que params.value contenha a URL da foto do perfil
          sx={{ width: 32, height: 32 }} // Ajuste o tamanho conforme necessário
        />
      ),
    },
    {
      field: "position",
      headerName: "Cargo",
      valueGetter: (params) =>
        `${params.row.position.split(" ")?.pop() || ""}`,
    },
    { field: "department", headerName: "Setor", width: 150 },
    {
      field: "hiringDate", 
      headerName: "Idade",
      minWidth: 150
    },
    { field: "situacion", headerName: "Situação", minWidth: 100 },
    { field: "mobile", headerName: "Celular", minWidth: 180 },
    {
      field: "actions",
      headerName: "Ações",
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
          <IconButton
            color="success"
            size="small"
            onClick={() => onCall(params)}
          >
            <WhatsAppIcon fontSize="inherit" />
          </IconButton>
  
          <IconButton color="info" size="small" onClick={() => onEdit(params)}>
            <EditIcon fontSize="inherit" />
          </IconButton>
  
          <IconButton
            color="error"
            size="small"
            onClick={() => onDelete(params)}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
  
          
          <IconButton
          color="primary" // Cor do ícone pode ser ajustada conforme necessário
          size="small"
          onClick={() => onHistory(params.row.id)} // Passe o ID do usuário como parâmetro
        >
          <HistoryIcon fontSize="inherit" />
        </IconButton>
        </Stack>
      ),
    },
  ];
  const onHistory = (userId: string) => {
    // Navegue para a página de histórico do usuário com base no ID
    navigate(`/historico/${userId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProfiles();
        setProfileData(data);
      } catch (error) {
        console.error("Erro ao buscar dados dos perfis:", error);
        // Adicione um feedback de erro para o usuário, se necessário
      }
    };
  
    fetchData();
  }, []);
  
  

useEffect(() => {
  const fetchData = async () => {
    try {
      const userData = await getProfile(id); // Chama a função para buscar os dados do usuário com base no ID
      console.log("Dados do usuário carregados com sucesso:", userData);
      
      // Atualize o estado local com os dados do usuário
      setFormData(userData);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  fetchData();
}, [id]);

   
  return <DataTable columns={columns} rows={profileData} />
}
