import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

const SignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Endereço de email inválido").required("Campo obrigatório"),
      password: Yup.string().required("Campo obrigatório"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "As senhas não coincidem")
        .required("Campo obrigatório"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        navigate("/"); 
      } catch (error) {
        console.error("Erro ao criar conta:", error);
        setFieldError("email", "Erro ao criar conta. Tente novamente mais tarde.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h4" align="center" gutterBottom>
          Registrar uma nova conta
        </Typography>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          variant="outlined"
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Senha"
          type="password"
          variant="outlined"
          margin="normal"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar Senha"
          type="password"
          variant="outlined"
          margin="normal"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting}
        >
          Registrar
        </Button>
        <Button
          fullWidth
          variant="text"
          color="primary"
          onClick={() => navigate("/")}
        >
          Já tem uma conta? Faça login
        </Button>
      </form>
    </Container>
  );
};

export default SignUp;
