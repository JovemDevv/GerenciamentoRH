import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DataTable from "../../../users/components/DataTable";
import { User } from "../../../users/types/User";
import {
  getAllProfiles,
  deleteProfile,
  getProfile,
} from "../../../users/services/profile";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import HistoryIcon from "@mui/icons-material/History";

export default function Grid() {
  const [profileData, setProfileData] = useState<User[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [, setFormData] = useState<User>();

  const onCall = (params: GridRenderCellParams) => {
    if (!params.row.mobile) return;
    window.location.href = `https://wa.me/55${params.row.mobile.replace(
      /[^\d]+/g,
      "",
    )}`;
  };

  const onEdit = async (params: GridRenderCellParams) => {
    if (!params.row.id) return;

    try {
      const userData = await getProfile(params.row.id);
      console.log("Dados do usuário carregados com sucesso:", userData);

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
        prevData.filter((user) => user.id !== profileId),
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
          src={params.value}
          sx={{ width: 32, height: 32 }}
        />
      ),
    },
    {
      field: "position",
      headerName: "Cargo",
      valueGetter: (params) => `${params.row.position.split(" ")?.pop() || ""}`,
    },
    { field: "department", headerName: "Setor", width: 150 },
    {
      field: "hiringDate",
      headerName: "Data de admissão",
      minWidth: 150,
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
            color="primary"
            size="small"
            onClick={() => onHistory(params.row.id)}
          >
            <HistoryIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
  ];
  const onHistory = (userId: string) => {
    navigate(`/historico/${userId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProfiles();

        return setProfileData(data);
      } catch (error) {
        console.error("Erro ao buscar dados dos perfis:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id !== undefined) {
          const userData = await getProfile(id);
          const user = userData as User;
          console.log("Dados do usuário carregados com sucesso:", user);

          setFormData(user);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    if (id !== undefined) {
      fetchData();
    }
  }, [id]);

  return <DataTable columns={columns} rows={profileData} />;
}
