import { Paper, Stack } from "@mui/material";

import Breadcrumbs from "../../users/components/Breadcrumbs";
import PageTitle from "../../users/components/PageTitle";

import Form from "./components/Form";

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
