import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form, Field, useField } from "formik";
import { TextField, Select } from "formik-material-ui";

import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";

import { useSoftRiseShadowStyles } from "@mui-treasury/styles/shadow/softRise";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import db from "../../firebase/firebaseConfig";
import { doc, collection, addDoc, updateDoc } from "firebase/firestore";

import {
  Box,
  Button,
  FormControl,
  Typography,
  Input,
  FormHelperText,
} from "@material-ui/core";

import * as Yup from "yup";
import * as actions from "../../store/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 304,
    margin: "auto",
  },
  content: {
    padding: 24,
  },
  button: {
    marginTop: "2rem",
    display: "block",
    width: "100%",
    height: "3rem",
    border: "none",
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
}));


const FormikField = ({ label, name, type = "text", disabled }) => {
  return (
    <Box my={1}>
      <Field
        fullWidth
        component={TextField}
        label={label}
        name={name}
        type={type}
        disabled={disabled}
      />
    </Box>
  );
};

const FormikPassword = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl fullWidth error={meta.touched && meta.error ? true : false}>
      <InputLabel>{label}</InputLabel>
      <Input
        {...field}
        {...props}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              style={{ padding: 0 }}
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(event) => event.preventDefault()}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      {meta.touched && meta.error ? (
        <FormHelperText>{meta.error}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

const FormikSelect = ({ label, name, items, disabled }) => {
  return (
    <Box my={1} textAlign="left">
      <FormControl disabled={disabled} fullWidth>
        <InputLabel>{label}</InputLabel>
        <Field component={Select} name={name} disabled={disabled}>
          {items.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Field>
      </FormControl>
    </Box>
  );
};

const userTypeItems = [
  { label: "Estudiante", value: "HV" },
  { label: "Profesor", value: "GV" },
];

const userItems = [
  { label: "Inicial", value: "GP01" },
  { label: "Basica", value: "GP02" },
  { label: "Bachillerato", value: "GP03" },
  { label: "Preuniversitario", value: "GP04" },
  { label: "Universtario", value: "GP05" },
  { label: "Profesional", value: "GP06" },
];

export const AddUsers = (props) => {
  const classes = useStyles();
  const {
    preview,
    group,
    isEdit,
    tabIndex,
    selectedUser,
    success,
    error,
  } = props;
  const { onAddUser } = props;

  const { enqueueSnackbar } = useSnackbar();

  const cardStyles = useStyles();
  const shadowStyles = useSoftRiseShadowStyles();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } else if (success) {
      enqueueSnackbar(success, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  }, [error, success, enqueueSnackbar]);

  let initialValues = {
    id: "",
    username: "",
    password: "",
    email: "",
    accountType: "",
    name: "",
    phone: "",
    group: "",
  };

  if ((isEdit && selectedUser) || (preview && selectedUser)) {
    initialValues = {
      id: selectedUser.id,
      username: selectedUser.username,
      password: "",
      email: selectedUser.correo,
      accountType: selectedUser.tipoCuenta,
      name: selectedUser.nombre,
      phone: selectedUser.celular,
      group: selectedUser.grupo,
    };
  }

  let validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(15, "El nombre de usuario debe tener 15 caracteres o menos")
      .required("Debe ingresar nombre de usuario"),
    password: Yup.string()
      .min(3, "La contraseña debe tener al menos 3 caracteres")
      .required("Debe ingresar contraseña"),
    name: Yup.string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(15, "El nombre debe tener 15 caracteres o menos")
      .required("Debe ingresar nombre"),
    accountType: Yup.string().required("Tipo de cuenta es requeido"),
    group: Yup.string().required("Group is required"),
    phone: Yup.number()
      .min(10, "El número de teléfono debe tener al menos 10 caracteres")
      .required("Debe ingresar un número de teléfono"),
    email: Yup.string()
      .email("Debe ser una dirección de correo electrónico válida")
      .required("Debe ingresar correo electrónico"),
  });

  const onSubmit1 = async (values, { setSubmitting, resetForm }) => {
    //values.preventDefault();

    onAddUser(values, isEdit, tabIndex, group);

    if(isEdit) {
      await updateDoc(doc(db, 'usuarios', values.id), {
        password: values.password,
        tipoCuenta: values.accountType,
        correo: values.email,
        nombre: values.name,
        celular: values.phone,
        grupo: values.group
      })
    } else {
      try {
        await addDoc(collection(db, 'usuarios'), {
          username: values.username,
          correo: values.email,
          password: values.password,
          tipoCuenta: values.accountType,
          nombre: values.name,
          celular: values.phone,
          grupo: values.group
        });
      } catch (error) {
        console.log('Hubo un error al crear el usuario');
        console.log(error);
      }
    }
  
    //cambiarNombre('');//borrar imput
    //cambiarCorreo('');//borrar imput
    resetForm();
    setSubmitting(false);
  }

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    onAddUser(values, isEdit, tabIndex, group);
    resetForm();
    setSubmitting(false);
  };

  return (
    <Card className={cx(cardStyles.root, shadowStyles.root)}>
      <CardContent className={classes.content}>
        {preview ? null : (
          <Typography variant="h4" align="center">
            {isEdit ? "Editar Usurio" : "Agregar Usuario"}
          </Typography>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit1}
        >
          {({ submitForm, dirty, isValid, ...props }) => (
            <Form>
              <FormikField
                label="Usuario"
                name="username"
                disabled={isEdit || preview}
              />

              <FormikField
                label="Email"
                name="email"
                type="email"
                disabled={preview}
              />

              {preview ? null : (
                <FormikPassword label="Password" name="password" />
              )}

              <FormikSelect
                label="Tipo Cuenta"
                name="accountType"
                items={userTypeItems}
                disabled={preview}
              />
              <FormikField label="Nombre" name="name" disabled={preview} />
              <FormikField label="Celular" name="phone" disabled={preview} />

              {preview ? null : (
                <FormikSelect
                  label="Nivel Educativo"
                  name="group"
                  items={userItems}
                />
              )}

              {preview ? null : (
                <Box align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!dirty || !isValid}
                    onClick={submitForm}
                    className={classes.button}
                  >
                    Enviar
                  </Button>
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    group: state.auth.group,
    error: state.usersManager.error,
    success: state.usersManager.success,
    isEdit: state.usersManager.isEdit,
    tabIndex: state.usersManager.tabIndex,
    selectedUser: state.usersManager.selectedUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddUser: (values, isEdit, tabIndex, group) =>
      dispatch(actions.addUser(values, isEdit, tabIndex, group)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUsers);
