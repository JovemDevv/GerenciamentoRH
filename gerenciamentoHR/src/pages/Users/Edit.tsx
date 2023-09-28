import { Paper, Stack } from "@mui/material"

import Breadcrumbs from "../../components/Breadcrumbs"
import PageTitle from "../../components/PageTitle"

import Form from "./components/Form"


export default function Edit() {
  return (
    <>
      <Stack sx={{ marginBottom: 2 }}>
        <PageTitle title="Atualizar dados do funcionário" />
        <Breadcrumbs
          path={[{ label: "Funcionários", to: "/users/" }, { label: "Editar" }]}
        />
      </Stack>
      <Paper>
        <Form />
      </Paper>
    </>
  )
}
