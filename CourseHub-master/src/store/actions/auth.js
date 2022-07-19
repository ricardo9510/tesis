import * as actionTypes from "./actionTypes";
import {addDoc, collection,getDocs, query,where} from "firebase/firestore";
import db from "../../firebase/firebaseConfig";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (authData, message) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    authData: authData,
    message: message,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

//Función que realiza un axios para loguearse
export const auth = (values, history, isSignUp) => {
  return (dispatch) => {
    const queryAuth = query(collection(db,"usuarios") ,  where("username", "==",  values.username), where("password", "==", values.password));
    dispatch(authStart());
    if (isSignUp) {
      const authData = {
        username: values.username,
        password: values.password,
        nombre: values.nombre,
        celular: values.celular,
        grupo: values.grupo,
        correo: values.correo,
      };

      addDoc(collection(db, 'usuarios'), authData)
      .then((response) => {
        dispatch(authSuccess("Success", "¡Cuenta creada con éxito!"));
        history.push("/sign-in");
      })
      .catch((error) => {
        dispatch(authFail("Error"));
      });
    }else{
      getDocs(queryAuth)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({...doc.data(), id:doc.id})
        });
        dispatch(authSuccess(result[0], "¡ingreso realizado con éxito!"));
        localStorage.setItem("user", JSON.stringify(result[0]));
        history.push("/");
      })
      .catch((error) => {
        dispatch(authFail("Error al ingresar los datos del usuario"));
      });
    }
  };
};

export const logout = () => {
  localStorage.removeItem("user");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

// export const setAuthRedirectPath = (path) => {
//   return {
//     type: actionTypes.SET_AUTH_REDIRECT_PATH,
//     path: path,
//   };
// };

export const authCheckState = () => {
  return (dispatch) => {
    const user = localStorage.getItem("user");
    if (!user) {
      dispatch(logout());
    } else {
      dispatch(authSuccess("user"));
    }
  };
};

export const chooseGroup = (group) => {
  return {
    type: actionTypes.CHOOSE_GROUP,
    group: group,
  };
};
