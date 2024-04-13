import { Paper, Stack } from "@mui/material";

import Breadcrumbs from "../../components/Breadcrumbs";
import PageTitle from "../../components/PageTitle";

import Form from "../../domains/users/components/Form";

export default function Create() {
  return (
    <>
      <Stack sx={{ marginBottom: 2 }}>
        <PageTitle title="Adicionar Funcionário" />
        <Breadcrumbs
          path={[{ label: "Funcionários", to: "/users/" }, { label: "Novo" }]}
        />
      </Stack>
      <Paper>
        <Form />
      </Paper>
    </>
  );
}
