import { yupResolver } from '@hookform/resolvers/yup';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {  useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useLocation, useNavigate, useParams } from "react-router-dom";
import "./../../../style/App.css";
import FormTitle from "../../../components/FormTitle";
import { findBrazilianZipCode } from "../../../services/api";
import {
  adicionarUsuarioAoFirestore,
  atualizarUsuarioNoFirestore,
  uploadProfilePicture,
} from "../../../services/profile";
import { UserSchema } from "../schemas/UserSchema";
import { User } from "../types/User";


export default function Form() {
  const [users, setUsers] = useState<User[]>([])
  const { id } = useParams();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading] = useState(false);
  const location = useLocation()
  const {userData} = location.state ? location.state : { userData: {} }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
  } = useForm<User>({
    resolver: yupResolver(UserSchema),
  }) 

  const [zipCodeFounded, setZipCodeFounded] = useState<boolean>();


  useEffect(() => {
    // if (!id) return;

    // const user = users.find((user) => user.id === id);

    // if (!user) return;
    if(userData.fullName){
    setValue("fullName", userData.fullName);
    setValue("document", userData.document);
    setValue("birthDate", new Date(userData.birthDate))
    setValue("email", userData.email);
    setValue("emailVerified", userData.emailVerified);
    setValue("mobile", userData.mobile);
    setValue("zipCode", userData.zipCode);
    setValue("addressName", userData.addressName);
    setValue("number", userData.number);
    setValue("complement", userData.complement);
    setValue("position", userData.position);
    setValue("hiringDate", new Date(userData.hiringDate));
    setValue("department", userData.department);
    setValue("salary", userData.salary);
    setValue("neighborhood", userData.neighborhood);
    setValue("city", userData.city);
    setValue("state", userData.state);
    setValue("profilePicture", userData.profilePicture);
    setValue("situacion", userData.situacion);
  }
  }, [id, setValue, userData ]);

  const onSubmit = async (data: User) => {
    try {
      if (profilePicture) {
        // Faça o upload da foto de perfil e obtenha a URL
        const profilePictureUrl = await uploadProfilePicture(
          profilePicture,
          id || ""
        ); // Use o ID se disponível
  
        // Defina a URL da foto de perfil no objeto de dados
        data.profilePicture = profilePictureUrl || ""; // Substitua pelo caminho real da imagem ou vazio se não houver imagem
      } else {
        data.profilePicture = ""; // Se não houver imagem de perfil
      }
  
      if (!id) {
        // Adicione um novo usuário
        await adicionarUsuarioAoFirestore(data); // Remova o segundo argumento (id) se não for necessário
      } else {
        // Atualize um usuário existente
        const newUsers = [...users];
        const userIndex = newUsers.findIndex((user) => user.id === id);
        newUsers[userIndex] = { ...data, id };
        setUsers(newUsers);
        await atualizarUsuarioNoFirestore(data, id); // Mantenha o ID aqui se for necessário para a atualização
      }
  
      // Navegue para a página "/users" após o envio bem-sucedido
      navigate("/users");
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  };
  
     
  

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProfilePicture(files[0]);
    }
  };
  useEffect(() => {
    if (!id) return;
  
    const user = users.find((user) => user.id === id);
  
    if (!user) return;
  
    setValue("fullName", user.fullName);
    setValue("document", user.document);
    // ... Continue para os outros campos
  
    // Não é necessário definir os campos aqui
  }, [id, setValue, users]);
  

  const formatCPF = (value: string) => {
    // Remova todos os caracteres não numéricos
    value = value.replace(/\D/g, '');
  
    // Limite o tamanho máximo do CPF a 11 caracteres
    if (value.length > 11) {
      value = value.substr(0, 11);
    }
  
    // Aplicar formatação
    if (value.length > 3) {
      value = value.substr(0, 3) + '.' + value.substr(3);
    }
    if (value.length > 7) {
      value = value.substr(0, 7) + '.' + value.substr(7);
    }
    if (value.length > 11) {
      value = value.substr(0, 11) + '-' + value.substr(11);
    }
  
    return value;
  };
  

  const formatCelular = (value: string) => {
  // Remova todos os caracteres não numéricos
  value = value.replace(/\D/g, '');

  // Limite o tamanho máximo do número de celular a 11 caracteres
  if (value.length > 11) {
    value = value.substr(0, 11);
  }

  // Aplicar formatação
  if (value.length === 11) {
    value = `(${value.substr(0, 2)}) ${value.substr(2, 5)}-${value.substr(7)}`;
  }
  return value;
};


  const onZipCodeBlur = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    const { value } = event.target;

    if (!value) return;

    const address = await findBrazilianZipCode(value);

    if (!address || !address?.addressName) {
      setZipCodeFounded(false);

      setValue("addressName", "");
      setValue("neighborhood", "");
      setValue("city", "");
      setValue("state", "");

      setFocus("addressName");

      return;
    }

    setZipCodeFounded(true);

    setValue("addressName", address.addressName);
    setValue("neighborhood", address.neighborhood);
    setValue("city", address.city);
    setValue("state", address.state);

    setFocus("number");
  }

  return (
    <Box
      className="Box"
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ p: 2 }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ marginBottom: 2 }}
      >
        <Stack alignItems={"center"}>
          {profilePicture ? (
            <Avatar
              alt="Foto de Perfil"
              src={URL.createObjectURL(profilePicture)}
              sx={{ width: 200, height: 200 }}
            />
          ) : (
            <TextField
              type="file"
              name="photo"
              id="photo"
              onChange={handleProfilePictureChange}
            />
          )}
        </Stack>

        <Controller
  control={control}
  name="fullName" // Substitua "fullName" pelo nome do campo correspondente
  render={({ field }) => (
    <TextField
      label="Nome Completo"
      fullWidth={true}
      error={!!errors.fullName}
      helperText={errors.fullName?.message}
      {...field}
    />
  )}
/>

      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ marginBottom: 2 }}
      >
        <Controller
          control={control}
          name="document"
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth={true}>
              <TextField
                label="CPF"
                fullWidth={true}
                error={!!errors.document}
                helperText={errors.document?.message}
                onChange={(e) => {
                  field.onChange(formatCPF(e.target.value));
                }}
                value={field.value}
              />
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { ...field } }) => (
            <FormControl fullWidth={true}>
              <DatePicker label="Data de Nascimento" {...field} />
            </FormControl>
          )}
        />
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ marginBottom: 2 }}
      >
        <TextField
          label="E-mail"
          fullWidth={true}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />

        <Controller
          control={control}
          name="mobile"
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth={true}>
              <TextField
                label="Celular"
                fullWidth={true}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                onChange={(e) => {
                  field.onChange(formatCelular(e.target.value));
                }}
                value={field.value}
              />
            </FormControl>
          )}
        />
      </Stack>
      <FormTitle title="Endereço" />

<Stack
  direction="row"
  alignItems="center"
  spacing={1}
  sx={{ marginBottom: 2, width: 250 }}
>
  <Controller
    control={control}
    name="zipCode"
    defaultValue=""
    render={({ field }) => (
      <FormControl fullWidth={true}>
      <TextField
            label="CEP"
            fullWidth={true}
            ref={field.ref}
          value={field.value}
                error={!!errors.zipCode}
                helperText={
                  errors.zipCode?.message ||
              (zipCodeFounded === false && "Não encontrado, favor preencher.")
            }
                onChange={field.onChange}
          onBlur={(e) => {
            onZipCodeBlur(e);
            field.onBlur();
          }}
          />
       
      </FormControl>
    )}
  />
  {zipCodeFounded === true && <CheckCircleIcon color="success" />}
</Stack>

<Controller
  control={control}
  name="addressName"
  defaultValue=""
  render={({ field }) => (
    <FormControl fullWidth={true} sx={{ marginBottom: 2 }}>
      <TextField
        label="Endereço"
        error={!!errors.addressName}
        helperText={errors.addressName?.message}
        disabled={!!zipCodeFounded}
        {...field}
      />
    </FormControl>
  )}
/>

<Stack
  direction={{ xs: "column", sm: "row" }}
  sx={{ marginBottom: 2 }}
  spacing={2}
>
  <TextField
    label="Número"
    fullWidth={true}
    error={!!errors.number}
    helperText={errors.number?.message}
    {...register("number")}
  />
  <TextField
    label="Complemento"
    fullWidth={true}
    error={!!errors.complement}
    helperText={errors.complement?.message}
    {...register("complement")}
  />
</Stack>

<Stack
  direction={{ xs: "column", sm: "row" }}
  sx={{ marginBottom: 2 }}
  spacing={2}
>
  <Controller
    control={control}
    name="neighborhood"
    defaultValue=""
    render={({ field }) => (
      <FormControl fullWidth={true}>
        <TextField
          label="Bairro"
          fullWidth={true}
          error={!!errors.neighborhood}
          helperText={errors.neighborhood?.message}
          disabled={!!zipCodeFounded}
          {...field}
        />
      </FormControl>
    )}
  />

  <Controller
    control={control}
    name="city"
    defaultValue=""
    render={({ field }) => (
      <FormControl fullWidth={true}>
        <TextField
          label="Cidade"
          fullWidth={true}
          error={!!errors.city}
          helperText={errors.city?.message}
          disabled={!!zipCodeFounded}
          {...field}
        />
      </FormControl>
    )}
  />
</Stack>

<Controller
  control={control}
  name="state"
  defaultValue=""
  render={({ field }) => (
    <FormControl fullWidth={true} sx={{ marginBottom: 2 }}>
      <InputLabel id="state">Estado</InputLabel>
      <Select
        label="Estado"
        labelId="state"
        ref={field.ref}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={!!zipCodeFounded}
      >
        <MenuItem value={""}></MenuItem>
        <MenuItem value={"AC"}>Acre</MenuItem>
        <MenuItem value={"AL"}>Alagoas</MenuItem>
        <MenuItem value={"AP"}>Amapá</MenuItem>
        <MenuItem value={"AM"}>Amazonas</MenuItem>
        <MenuItem value={"BA"}>Bahia</MenuItem>
        <MenuItem value={"CE"}>Ceará</MenuItem>
        <MenuItem value={"ES"}>Espírito Santo</MenuItem>
        <MenuItem value={"DF"}>Distrito Federal</MenuItem>
        <MenuItem value={"GO"}>Goiás</MenuItem>
        <MenuItem value={"MA"}>Maranhão</MenuItem>
        <MenuItem value={"MT"}>Mato Grosso</MenuItem>
        <MenuItem value={"MS"}>Mato Grosso do Sul</MenuItem>
        <MenuItem value={"MG"}>Minas Gerais</MenuItem>
        <MenuItem value={"PA"}>Pará</MenuItem>
        <MenuItem value={"PB"}>Paraíba</MenuItem>
        <MenuItem value={"PR"}>Paraná</MenuItem>
        <MenuItem value={"PE"}>Pernambuco</MenuItem>
        <MenuItem value={"PI"}>Piauí</MenuItem>
        <MenuItem value={"RJ"}>Rio de Janeiro</MenuItem>
        <MenuItem value={"RN"}>Rio Grande do Norte</MenuItem>
        <MenuItem value={"RS"}>Rio Grande do Sul</MenuItem>
        <MenuItem value={"RO"}>Rondônia</MenuItem>
        <MenuItem value={"RR"}>Roraima</MenuItem>
        <MenuItem value={"SC"}>Santa Catarina</MenuItem>
        <MenuItem value={"SP"}>São Paulo</MenuItem>
        <MenuItem value={"SE"}>Sergipe</MenuItem>
        <MenuItem value={"TO"}>Tocantins</MenuItem>
      </Select>
    </FormControl>
  )}
/>

<Controller
  control={control}
  name="emailVerified"
  defaultValue={false}
  render={({ field: { onChange, value, ...field } }) => (
    <>
      <FormControlLabel
        control={
          <Switch checked={value} onChange={onChange} {...field} />
        }
        label="Email Pré-verificado"
        sx={{ marginBottom: 2 }}
      />
      <Tooltip title="Cadastrar o usuário sem precisar confirmar seu e-mail.">
        <InfoIcon color="disabled" />
      </Tooltip>
    </>
  )}
/>
<FormTitle title="Informações empregadícias" />
<Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ marginBottom: 2 }}
        >
        <TextField
          label="Cargo"
          fullWidth={true}
          error={!!errors.position}
          helperText={errors.position?.message}
          {...register("position")}
        />

    <Controller
            control={control}
            name="hiringDate"
            render={({ field: { ...field } }) => (
              <FormControl fullWidth={true}>
                <DatePicker label="Data de Admissão" {...field} />
              </FormControl>
            )}
          />
          </Stack>
    <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ marginBottom: 2 }}
        >
          <TextField
            label="Departamento"
            fullWidth={true}
            error={!!errors.department}
            helperText={errors.department?.message}
            {...register("department")}
          />

<Controller
          control={control}
          name="salary"
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth={true}>
              <TextField
                label="Salário"
                fullWidth={true}
                error={!!errors.salary}
                helperText={errors.salary?.message}
                onChange={(e) => {
                  field.onChange(formatCelular(e.target.value));
                }}
                value={field.value}
              />
            </FormControl>
          )}
        />
  
  <Controller
  control={control}
  name="situacion"
  defaultValue=""
  render={({ field }) => (
    <FormControl fullWidth={true}>
      <InputLabel>Status de Emprego</InputLabel>
      <Select {...field}>
        <MenuItem value="trabalhando">Trabalhando</MenuItem>
        <MenuItem value="demitido">Demitido</MenuItem>
            
          
      </Select>
    </FormControl>
  )}
/>

        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </Button>
        <Button component={RouterLink} to="/users/">
          Cancelar
        </Button>
      </Stack>
    </Box>
  );
}
