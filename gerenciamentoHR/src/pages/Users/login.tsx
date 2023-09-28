import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../config/firebase";


const Login = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false); // Estado local para verificar autenticação
 


  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true); // Define o estado como autenticado se o usuário estiver autenticado
        navigate("/"); // Redirecionar para a página de perfil
      } else {
        setAuthenticated(false);
      }
    });

    // Certifique-se de cancelar a assinatura ao desmontar o componente
    return () => unsubscribe();
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Endereço de email inválido").required("Campo obrigatório"),
      password: Yup.string().required("Campo obrigatório"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        navigate("/dashboard"); // Redirecionar o usuário para a página /users
      } catch (error) {
        setFieldError("password", "Credenciais inválidas");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      navigate("/dashboard"); // Redirecionar para a página /users após o login com sucesso
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  };

  if (authenticated) {
    return null; // Renderize um componente vazio ou redirecione para outra página se o usuário já estiver autenticado
  }

  return (
    <Container maxWidth="xs">
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h4" align="center" gutterBottom>
          Login com Email e Senha
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
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting}
        >
          Login
        </Button>
        <Box mt={2}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleGoogleLogin}
          >
            Login com o Google
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={() => navigate("/signup")}
          >
            Registrar
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Login;
