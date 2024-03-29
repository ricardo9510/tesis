import axios from "../../axios";
import * as actionTypes from "./actionTypes";
import db from "../../firebase/firebaseConfig";
import { arrayUnion, collection, doc, onSnapshot, deleteDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { get } from "lodash";

export const fetchInfoClick = (selectedUser, tabIndex, avatarIndex) => {
  return {
    type: actionTypes.FETCH_INFO_CLICK,
    tabIndex: tabIndex && Math.abs(tabIndex) !== 1 ? -tabIndex : 2,
    isEdit: false,
    selectedUser: selectedUser,
    avatarIndex: avatarIndex,
  };
};

export const editUserClick = (selectedUser, tabIndex) => {
  return {
    type: actionTypes.EDIT_USER_CLICK,
    tabIndex: tabIndex && Math.abs(tabIndex) !== 2 ? -tabIndex : 1,
    isEdit: true,
    selectedUser: selectedUser,
  };
};

export const addUserClick = () => {
  return {
    type: actionTypes.ADD_USER_CLICK,
    tabIndex: -1,
    isEdit: false,
  };
};

export const fetchUsersStart = () => {
  return {
    type: actionTypes.FETCH_USERS_START,
  };
};

export const fetchUsersSuccess = (userList) => {
  return {
    type: actionTypes.FETCH_USERS_SUCCESS,
    userList: userList,
  };
};

export const fetchUsersFail = (error) => {
  return {
    type: actionTypes.FETCH_USERS_FAIL,
    error: error,
  };
};

export const listarUsuarios = () => {
  let result = [];
  onSnapshot(
    collection(db, 'usuarios'),
    (snapshot) => {
      const arregloUsuarios = snapshot.docs.map((documento) => {
        return { ...documento.data(), id: documento.id }
      })

      result = arregloUsuarios;
      console.log(result);
      return result
    }
  );
}

//const {data, id} = ListaUsuarios()
//fetchUserDataSuccess(data)

export const fetchUsers = (group) => {

  return (dispatch) => {
    //ListaUsuarios();
    dispatch(fetchUsersStart());

    //toca cambiar el get a get de firebase

    /*axios
      .get(`/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${group}`)
      .then((response) => {
        dispatch(fetchUsersSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchUsersFail(error));
      });*/
    onSnapshot(
      collection(db, 'usuarios')
      ,
      (snapshot) => {
        const arregloUsuarios = snapshot.docs.map((documento) => {
          return { ...documento.data(), id: documento.id }
        })

        if (arregloUsuarios.length === 0)
          dispatch(fetchUsersFail(new Error("No se encontró los usuarios")))
        dispatch(fetchUsersSuccess(arregloUsuarios));
      }
    );
  };
};

export const fetchCourseApprovalPendingStart = () => {
  return {
    type: actionTypes.FETCH_COURSE_APPROVAL_PENDING_START,
  };
};

export const fetchCourseApprovalPendingSuccess = (success, selectedUser) => {
  return {
    type: actionTypes.FETCH_COURSE_APPROVAL_PENDING_SUCCESS,
    success: success,
    selectedUser: selectedUser,
  };
};

export const fetchCourseApprovalPendingFail = (error) => {
  return {
    type: actionTypes.FETCH_COURSE_APPROVAL_PENDING_FAIL,
    error: error,
  };
};

export const fetchCourseApprovalPending = (selectedUser) => {
  return (dispatch) => {
    dispatch(fetchCourseApprovalPendingStart());
    let queryFirebase = query(collection(db, "cursos"));
    getDocs(queryFirebase)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id })
        });
        let resultFinal = result.filter(courseFilter =>
          get(courseFilter, "usersSuccess", []).includes(selectedUser.id)
        );
        dispatch(fetchCourseApprovalPendingSuccess(resultFinal, selectedUser));
      })
      .catch((error) => {
        dispatch(fetchCourseApprovalPendingFail(error.response.data));
      });
  };
};

export const deleteUserStart = () => {
  return {
    type: actionTypes.DELETE_USER_START,
  };
};

export const deleteUserSuccess = (success) => {
  return {
    type: actionTypes.DELETE_USER_SUCCESS,
    success: success,
  };
};

export const deleteUserFail = (error) => {
  return {
    type: actionTypes.DELETE_USER_FAIL,
    error: error,
  };
};

export const deleteUser = (selectedUser, group) => {
  return (dispatch) => {
    dispatch(deleteUserStart());
    // const user = JSON.parse(localStorage.getItem("user"));
    // const url = `/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${selectedUser.taiKhoan}`;
    // const headers = {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${user.accessToken}`,
    // };
    deleteDoc(doc(db, 'usuarios', selectedUser.id)).then(() => {
      console.log("Document successfully deleted!");
      dispatch(deleteUserSuccess(true));
      dispatch(fetchUsers(group));
    }).catch((error) => {
      console.error("Error removing document: ", error);
      dispatch(deleteUserFail(error));
    });
    /*axios({ method: "delete", url, headers })
      .then((response) => {
        dispatch(deleteUserSuccess(response.data));
        dispatch(fetchUsers(group));
      })
      .catch((error) => {
        dispatch(deleteUserFail(error.response.data));
      });*/
  };
};

export const addUserStart = () => {
  return {
    type: actionTypes.ADD_USER_START,
  };
};

export const addUserSuccess = (success) => {
  return {
    type: actionTypes.ADD_USER_SUCCESS,
    success: success,
  };
};

export const addUserFail = (error) => {
  return {
    type: actionTypes.ADD_USER_FAIL,
    error: error,
  };
};

export const addUser = (values, isEdit, tabIndex, group) => {
  return (dispatch) => {
    dispatch(addUserStart());
    const user = JSON.parse(localStorage.getItem("user"));

    let method = "post";
    let url = "/QuanLyNguoiDung/ThemNguoiDung";
    if (isEdit) {
      method = "put";
      url = "/QuanLyNguoiDung/CapNhatThongTinNguoiDung";
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.accessToken}`,
    };
    const data = {
      taiKhoan: values.username,
      matKhau: values.password,
      hoTen: values.name,
      soDT: values.phone,
      maNhom: values.group,
      email: values.email,
      maLoaiNguoiDung: values.accountType,
    };

    axios({ method, url, headers, data })
      .then((response) => {
        if (isEdit) {
          dispatch(
            addUserSuccess(
              `Cuenta actualizada ${response.data.taiKhoan} con exito!`
            )
          );
          dispatch(fetchUsers(group));
          // simulating Click to refresh edit page
          dispatch(editUserClick(response.data, tabIndex));
        } else {
          dispatch(
            addUserSuccess(
              `Cuenta agregada ${response.data.taiKhoan} con exito!`
            )
          );
          dispatch(fetchUsers(group));
        }
      })
      .catch((error) => {
        dispatch(addUserFail(error.response.data));
      });
  };
};

export const approveCoursePendingStart = () => {
  return {
    type: actionTypes.APPROVE_COURSE_PENDING_START,
  };
};

export const approveCoursePendingSuccess = (success) => {
  return {
    type: actionTypes.APPROVE_COURSE_PENDING_SUCCESS,
    success: success,
  };
};

export const approveCoursePendingFail = (error) => {
  return {
    type: actionTypes.APPROVE_COURSE_PENDING_FAIL,
    error: error,
  };
};

export const approveCoursePending = (courseId, selectedUser) => {
  return (dispatch) => {
    dispatch(approveCoursePendingStart());
    updateDoc(doc(db, 'cursos', courseId), { usersSuccess: arrayUnion(selectedUser.id) }).then((responseUpdate) => {
      dispatch(approveCoursePendingSuccess("Success"));
      dispatch(fetchCourseApprovalPending(selectedUser));
      dispatch(fetchCourseApproved(selectedUser));
      dispatch(fetchCourseNoneEnroll(selectedUser));
    })
      .catch((error) => {
        console.log(error.response.data);
        dispatch(approveCoursePendingFail(error.response.data));
      });
  };
};

export const fetchCourseApprovedStart = () => {
  return {
    type: actionTypes.FETCH_COURSE_APPROVED_START,
  };
};

export const fetchCourseApprovedSuccess = (success, selectedUser) => {
  return {
    type: actionTypes.FETCH_COURSE_APPROVED_SUCCESS,
    success: success,
    selectedUser: selectedUser,
  };
};

export const fetchCourseApprovedFail = (error) => {
  return {
    type: actionTypes.FETCH_COURSE_APPROVED_FAIL,
    error: error,
  };
};

export const fetchCourseApproved = (selectedUser) => {
  return (dispatch) => {
    dispatch(fetchCourseApprovedStart());
    let queryFirebase = query(collection(db, "cursos"));
    getDocs(queryFirebase)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id })
        });
        let resultFinal = result.filter(courseFilter =>
          get(courseFilter, "usersSuccess", []).includes(selectedUser.id)
        );
        dispatch(fetchCourseApprovedSuccess(resultFinal, selectedUser));
      })
      .catch((error) => {
        dispatch(fetchCourseApprovedFail(error.response.data));
      });
  };
};

export const disapproveCourseStart = () => {
  return {
    type: actionTypes.DISAPPROVE_COURSE_START,
  };
};

export const disapproveCourseSuccess = (success) => {
  return {
    type: actionTypes.DISAPPROVE_COURSE_SUCCESS,
    success: success,
  };
};

export const disapproveCourseFail = (error) => {
  return {
    type: actionTypes.DISAPPROVE_COURSE_FAIL,
    error: error,
  };
};

export const disapproveCourse = (courseId, selectedUser) => {
  return (dispatch) => {
    dispatch(disapproveCourseStart());
    const user = JSON.parse(localStorage.getItem("user"));
    const url = "/QuanLyKhoaHoc/HuyGhiDanh";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.accessToken}`,
    };
    const data = {
      maKhoaHoc: courseId,
      taiKhoan: selectedUser.taiKhoan,
    };
    axios({ method: "post", url, headers, data })
      .then((response) => {
        dispatch(disapproveCourseSuccess(response.data));
        dispatch(fetchCourseApproved(selectedUser));
        dispatch(fetchCourseApprovalPending(selectedUser));
      })
      .catch((error) => {
        dispatch(disapproveCourseFail(error.response.data));
      });
  };
};

export const fetchCourseNoneEnrollStart = () => {
  return {
    type: actionTypes.FETCH_COURSE_NONE_ENROLL_START,
  };
};

export const fetchCourseNoneEnrollSuccess = (success, selectedUser) => {
  return {
    type: actionTypes.FETCH_COURSE_NONE_ENROLL_SUCCESS,
    success: success,
    selectedUser: selectedUser,
  };
};

export const fetchCourseNoneEnrollFail = (error) => {
  return {
    type: actionTypes.FETCH_COURSE_NONE_ENROLL_FAIL,
    error: error,
  };
};

export const fetchCourseNoneEnroll = (selectedUser) => {
  return (dispatch) => {
    dispatch(fetchCourseNoneEnrollStart());
    let queryFirebase = query(collection(db, "cursos"));
    getDocs(queryFirebase)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id })
        });
        let resultFinal = result.filter(courseFilter =>
          !get(courseFilter, "usersSuccess", []).includes(selectedUser.id)
        );
        dispatch(fetchCourseNoneEnrollSuccess(resultFinal, selectedUser));
      })
      .catch((error) => {
        dispatch(fetchCourseNoneEnrollFail(error.response.data));
      });
  };
};

export const searchUserStart = () => {
  return {
    type: actionTypes.SEARCH_USER_START,
  };
};

export const searchUserSuccess = (userList) => {
  return {
    type: actionTypes.SEARCH_USER_SUCCESS,
    userList: userList,
  };
};

export const searchUserFail = (error) => {
  return {
    type: actionTypes.SEARCH_USER_FAIL,
    error: error,
  };
};

export const searchUser = (keyWord, group) => {
  return (dispatch) => {
    dispatch(searchUserStart());
    axios
      .get(
        `/QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=${group}&tuKhoa=${keyWord}`
      )
      .then((response) => {
        !keyWord
          ? dispatch(fetchUsers(group))
          : dispatch(searchUserSuccess(response.data));
      })
      .catch((error) => {
        dispatch(searchUserFail(error));
      });
  };
};
