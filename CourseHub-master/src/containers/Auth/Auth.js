import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Formik, Form, Field, useField } from "formik";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, CssBaseline, FormGroup } from "@material-ui/core";
import { NativeSelect } from "@material-ui/core";

import { useSnackbar } from "notistack";

import * as Yup from "yup";
import * as actions from "../../store/actions";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    background: "linear-gradient(300deg, #009DD9, #17406D)",
  },

  loginForm: {
    width: "20rem",
    background: "#f1f1f1",
    minHeight: "35rem",
    padding: "0 2rem",
    borderRadius: "1rem",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },

  formItem: {
    width: "100%",
    position: "relative",
    height: "3rem",
    margin: "0.2rem 0",
    overflow: "hidden",

    "& input": {
      width: "100%",
      height: "100%",
      color: "#333",
      outline: "none",
      border: "none",
      background: "none",
      padding: "2rem 0",

      "&:focus+label span, &:valid+label span": {
        transform: "translateY(-90%)",
        color: "#adadad",
        fontSize: "0.9rem",
      },

      "&:focus+label::after, &:valid+label::after": {
        transform: "translateX(0)",
      },
    },

    "& label": {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      borderBottom: "1px solid #adadad",

      "&:after": {
        content: '""',
        position: "absolute",
        left: 0,
        bottom: "-0.15rem",
        width: "100%",
        height: "100%",
        borderBottom: "3px solid #2980b9",
        borderImage: "linear-gradient(120deg, #2980b9, #8e44ad) 1 round",
        transform: "translateX(-100%)",
        transition: "transform 0.6s ease",
      },

      "& span": {
        position: "absolute",
        bottom: "0.3rem",
        left: 0,
        color: "#adadad",
        transition: "all 0.3s ease",
      },
    },
  },

  logbtn: {
    marginTop: "2rem",
    display: "block",
    width: "100%",
    height: "3rem",
    border: "none",
    borderRadius: "3px",
    background: "linear-gradient(120deg, #17406D, #009DD9, #17406D)",
    backgroundSize: "200%",
    color: "#fff",
    outline: "none",
    transition: "0.5s",
    cursor: "pointer",

    "&:hover": {
      backgroundPosition: "right",
    },
  },

  bottomText: {
    textAlign: "center",
    fontSize: "0.9rem",
  },

  link: {
    textDecoration: "none",
  },
}));

const CustomInput = ({ label, ...props }) => {
  const classes = useStyles();
  const [field, meta] = useField(props);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (meta.touched && meta.error) {
      enqueueSnackbar(meta.error, {
        preventDuplicate: true,
        variant: "info",
      });
    }
  }, [meta, enqueueSnackbar]);

  return (
    <Fragment>
      <Box className={classes.formItem}>
        <Typography component={Field} required {...field} {...props} />
        <Typography component="label" htmlFor={props.id || props.name}>
          <span>{label}</span>
        </Typography>
      </Box>
    </Fragment>
  );
};

//Función del login
export const Auth = (props) => {
  const classes = useStyles();
  const { error, success } = props;
  const { onAuth, onMessageReset, history, match } = props;
  const isSignUp = match && match.url === "/sign-up";

  const { enqueueSnackbar } = useSnackbar();

  let initialValues = { username: "", password: "" };
  let validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "El nombre debe tener al menos 3 caracteres ")
      .max(15, "El nombre debe tener 15 caracteres o menos")
      .required("Must enter a name"),
    password: Yup.string()
      .min(3, "La contraseña debe tener al menos 3 caracteres")
      .required("Se requiere contraseña"),
  });
  //Aquí queman un grupo, el GP08
  if (isSignUp) {
    initialValues = {
      username: "",
      password: "",
      confirmPassword: "",
      nombre: "",
      celular: "",
      grupo: "GP04",
      correo: "",
    };
    validationSchema = Yup.object().shape({
      username: Yup.string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(15, "El nombre de usuario debe tener 15 caracteres o menos")
        .required("Debe ingresar un nombre de usuario"),
      password: Yup.string()
        .min(3, "La contraseña debe tener al menos 3 caracteres")
        .required("Se requiere contraseña"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
        .required("Se requiere confirmar contraseña"),
      nombre: Yup.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(15, "El nombre debe tener 15 caracteres o menos")
        .required("Debe ingresar un nombre"),
      grupo: Yup.string().required("Se requiere grupo"),
      celular: Yup.number()
        .min(10, "El número de teléfono debe tener al menos 10 caracteres")
        .required("Debe ingresar un número de teléfono"),
      correo: Yup.string()
        .email("Debe ser una dirección de correo electrónico válida")
        .required("Debe ingresar un correo electrónico"),
    });
  }

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
    } else if (success) {
      enqueueSnackbar(success, { variant: "success" });
    }
    onMessageReset();
  }, [error, success, enqueueSnackbar, onMessageReset]);

  //Función del submit para iniciar sesión, es la función onAuth()
  const onSubmit = (values, { setSubmitting }) => {
    onAuth(values, history, isSignUp);
    setSubmitting(false);
  };

  return (
    <Box className={classes.container}>
      <CssBaseline />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form className={classes.loginForm}>
            <Box mt={isSignUp ? 5 : 10} mb={isSignUp ? 3 : 5}>
              <Typography variant="h3" align="center">
                {isSignUp ? "Inscribirse" : "Logear"}
              </Typography>
            </Box>
            <FormGroup>
              <CustomInput label="Username" name="username" type="text" />
              <CustomInput label="Contraseña" name="password" type="password" />
            </FormGroup>
            {isSignUp ? (
              <FormGroup>
                <CustomInput
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                />
                <CustomInput label="Nombre" name="nombre" type="text" />
                <CustomInput label="Celular" name="celular" type="text" />
                <CustomInput label="Email" name="correo" type="email" />
                <NativeSelect
                  value={props.values.group}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  name="grupo"
                  style={{ marginTop: 16 }}
                >
                  <option value={"GP01"}>Inicial</option>
                  <option value={"GP02"}>Basica</option>
                  <option value={"GP03"}>Bachillerato</option>
                  <option value={"GP04"}>Preuniversitario</option>
                  <option value={"GP05"}>Universtario</option>
                  <option value={"GP06"}>Profesional</option>
                </NativeSelect>
              </FormGroup>
            ) : null}

            <Typography
              component="button"
              type="submit"
              className={classes.logbtn}
            >
              {props.isSubmitting
                ? "Loading..."
                : isSignUp
                ? "Sign Up"
                : "Login"}
            </Typography>

            <Box
              mt={isSignUp ? 5 : 10}
              mb={isSignUp ? 5 : 0}
              className={classes.bottomText}
            >
              <Typography component="p">
                {isSignUp
                  ? "Ya tienes una cuenta?"
                  : "Aun no tienes una cuenta?"}{" "}
                {isSignUp ? (
                  <Link to="/sign-in" className={classes.link}>
                    Iniciar sesión
                  </Link>
                ) : (
                  <Link to="/sign-up" className={classes.link}>
                    Inscribirse
                  </Link>
                )}
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    success: state.auth.success,
    // loading: state.auth.loading,
    // isAuthenticated: state.auth.token !== null,
    // authRedirectPath: state.auth.authRedirectPath,
  };
};

// Aquí usa redux, aquí es donde manda a loguearse a los actions
const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (values, history, isSignUp) =>
      dispatch(actions.auth(values, history, isSignUp)),
    onMessageReset: () => dispatch(actions.authStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
