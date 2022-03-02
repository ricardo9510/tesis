import * as actionTypes from "./actionTypes";
import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { defaultTo, get, set } from "lodash";
import { isEmptyArray } from "formik";

export const fetchUsersClick = (selectedCourse, tabIndex) => {
  return {
    type: actionTypes.FETCH_USERS_CLICK,
    tabIndex: tabIndex && Math.abs(tabIndex) !== 1 ? -tabIndex : 2,
    selectedCourse: selectedCourse,
  };
};

export const editCourseClick = (selectedCourse, tabIndex) => {
  return {
    type: actionTypes.EDIT_COURSE_CLICK,
    tabIndex: tabIndex && Math.abs(tabIndex) !== 2 ? -tabIndex : 1,
    isEdit: true,
    selectedCourse: selectedCourse,
  };
};

export const addCourseClick = () => {
  return {
    type: actionTypes.ADD_COURSE_CLICK,
    tabIndex: -1,
    isEdit: false,
  };
};

export const chooseCourseType = (courseType) => {
  return {
    type: actionTypes.CHOOSE_COURSE_TYPE,
    courseType: courseType,
  };
};

export const fetchCoursesListStart = () => {
  return {
    type: actionTypes.FETCH_COURSES_LIST_START,
  };
};

export const fetchCoursesListSuccess = (courseList) => {
  return {
    type: actionTypes.FETCH_COURSES_LIST_SUCCESS,
    courseList: courseList,
  };
};

export const fetchCoursesListFail = (error) => {
  return {
    type: actionTypes.FETCH_COURSES_LIST_FAIL,
    error: error,
  };
};

export const fetchCoursesList = (keyWord, group, courseType) => {
  // console.log(courseType);

  return (dispatch) => {
    let queryFirebase = query(collection(db,"cursos") , where("group", "==", group));
    //let url = `/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=${group}`;
    if (courseType !== "all") {
     queryFirebase = query(collection(db,"cursos") ,  where("courseType", "==", courseType), where("group", "==", group));
      //url = `/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${courseType}&MaNhom=${group}`;
    }
    if (keyWord) {
      queryFirebase = query(collection(db,"cursos") ,  where("courseName", "==", keyWord), where("group", "==", group));
      //url = `/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${keyWord}&MaNhom=${group}`;
    }

    dispatch(fetchCoursesListStart());
    getDocs(queryFirebase)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({...doc.data(), id:doc.id})
        });
        dispatch(fetchCoursesListSuccess(result));
      })
      .catch((error) => {
        // console.log(error.response.data);
        dispatch(fetchCoursesListFail(error));
      });
  };
};

export const addCourseStart = () => {
  return {
    type: actionTypes.ADD_COURSE_START,
  };
};

export const addCourseSuccess = (courseResponse, success) => {
  return {
    type: actionTypes.ADD_COURSE_SUCCESS,
    success: success,
  };
};

export const addCourseFail = (error) => {
  return {
    type: actionTypes.ADD_COURSE_FAIL,
    error: error,
  };
};

export const addCourse = (
  values,
  selectedImage,
  isEdit,
  group,
  courseType,
  tabIndex,
  selectedDate
) => {
  return (dispatch) => {
    dispatch(addCourseStart());
    //const user = JSON.parse(localStorage.getItem("user"));
    const date = new Date(selectedDate);
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
    ] = dateTimeFormat.formatToParts(date);
    const dateString = `${day}/${month}/${year}`;

    // let method = "post";
    // let url = "/QuanLyKhoaHoc/ThemKhoaHoc";
    if (isEdit) {
      // method = "put";
      // url = "/QuanLyKhoaHoc/CapNhatKhoaHoc";
    }
    // const headers = {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${user.accessToken}`,
    // };

    const data = {
      courseId: values.courseId.trim(),
      courseDescription: values.courseName.trim().replace(/\s+/g, "-").toLowerCase(),
      courseName: values.courseName.trim(),
      description: values.detail.trim(),
      views: values.views,
      rate: values.rate,
      extensionImage: ".jpg",
      imageUrl: values.imageUrl,
      group: values.group,
      date: dateString,
      courseType: values.courseType,
      creator: values.creator.trim(),
    };

    if (isEdit) {
      updateDoc(doc(db, 'cursos', values.id), data)
          .then((response) => {
            let message = `Creación del nuevo curso ${data.courseName} con exito`;
            if (isEdit) {
              message = `Actualización del curso ${data.courseName} con exito`;
            }

            if (selectedImage) {
              dispatch(
                  uploadImage(
                      selectedImage,
                      data.courseName,
                      data.group,
                      values.id
                  )
              );
            }

            dispatch(addCourseSuccess("Success", message));
            dispatch(fetchCoursesList(null, group, courseType));
            // The reason of error if activate the action below is:
            // --> this response.data has different selectedCourse structure

            // dispatch(editCourseClick(response.data, tabIndex));
          })
          .catch((error) => {
            // console.log(error.response.data);
            dispatch(addCourseFail(error.response));
          });
    }else{
      addDoc(collection(db, 'cursos'), data)
          .then((response) => {
            let message = `Creación del nuevo curso ${data.courseName} con exito`;
            if (isEdit) {
              message = `Actualización del curso ${data.courseName} con exito`;
            }

            if (selectedImage) {
              dispatch(
                  uploadImage(
                      selectedImage,
                      data.courseName,
                      data.group,
                      response.id
                  )
              );
            }

            dispatch(addCourseSuccess("Success", message));
            dispatch(fetchCoursesList(null, group, courseType));
            // The reason of error if activate the action below is:
            // --> this response.data has different selectedCourse structure

            // dispatch(editCourseClick(response.data, tabIndex));
          })
          .catch((error) => {
            // console.log(error.response.data);
            dispatch(addCourseFail(error.response));
          });
    }
  };
};

export const fetchUserListOfCourseStart = () => {
  return {
    type: actionTypes.FETCH_USER_LIST_OF_COURSE_START,
  };
};

export const fetchUserListOfCourseSuccess = (userApprovedList) => {
  return {
    type: actionTypes.FETCH_USER_LIST_OF_COURSE_SUCCESS,
    userApprovedList: userApprovedList,
  };
};

export const fetchUserListOfCourseFail = (error) => {
  return {
    type: actionTypes.FETCH_USER_LIST_OF_COURSE_FAIL,
    error: error,
  };
};

export const fetchUserListOfCourse = (course) => {
  return (dispatch) => {
    dispatch(fetchUserListOfCourseStart());
    if (isEmptyArray(defaultTo(course.usersSuccess, []))) {
      dispatch(fetchUserListOfCourseSuccess([]));
    }else{
      let queryUsers = query(collection(db,"usuarios") , where("__name__", "in", defaultTo(course.usersSuccess, [])));

    getDocs(queryUsers)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({...doc.data(), id:doc.id})
        });
        dispatch(fetchUserListOfCourseSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchUserListOfCourseFail(error.response.data));
      });
    }
  };
};

export const fetchUserPendingListOfCourseStart = () => {
  return {
    type: actionTypes.FETCH_USER_PENDING_LIST_OF_COURSE_START,
  };
};

export const fetchUserPendingListOfCourseSuccess = (userPendingList) => {
  return {
    type: actionTypes.FETCH_USER_PENDING_LIST_OF_COURSE_SUCCESS,
    userPendingList: userPendingList,
  };
};

export const fetchUserPendingListOfCourseFail = (error) => {
  return {
    type: actionTypes.FETCH_USER_PENDING_LIST_OF_COURSE_FAIL,
    error: error,
  };
};

export const fetchUserPendingListOfCourse = (course) => {
  return (dispatch) => {
    dispatch(fetchUserPendingListOfCourseStart());
    if (isEmptyArray(defaultTo(course.usersPending, []))) {
      dispatch(fetchUserListOfCourseSuccess([]));
    }else{
      let queryUsersPending = query(collection(db,"usuarios") , where("__name__", "in", defaultTo(course.usersPending, [])));

      getDocs(queryUsersPending)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({...doc.data(), id:doc.id})
        });
        dispatch(fetchUserPendingListOfCourseSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchUserPendingListOfCourseFail(error));
      });
    } 
  };
};

export const fetchUserRefuseListOfCourseStart = () => {
  return {
    type: actionTypes.FETCH_USER_REFUSE_LIST_OF_COURSE_START,
  };
};

export const fetchUserRefuseListOfCourseSuccess = (userRefuseList) => {
  return {
    type: actionTypes.FETCH_USER_REFUSE_LIST_OF_COURSE_SUCCESS,
    userRefuseList: userRefuseList,
  };
};

export const fetchUserRefuseListOfCourseFail = (error) => {
  return {
    type: actionTypes.FETCH_USER_REFUSE_LIST_OF_COURSE_FAIL,
    error: error,
  };
};

export const fetchUserRefuseListOfCourse = (course) => {
  return (dispatch) => {
    dispatch(fetchUserRefuseListOfCourseStart());
    if (isEmptyArray(defaultTo(course.usersRefuse, []))) {
      dispatch(fetchUserListOfCourseSuccess([]));
    }else {
      let queryUsersRefuse = query(collection(db,"usuarios") , where("__name__", "in", defaultTo(course.usersRefuse, [])));

    getDocs(queryUsersRefuse)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({...doc.data(), id:doc.id})
        });
        dispatch(fetchUserRefuseListOfCourseSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchUserRefuseListOfCourseFail(error));
      });
    }
  };
};

export const approveUserPendingStart = () => {
  return {
    type: actionTypes.APPROVE_USER_PENDING_START,
  };
};

export const approveUserPendingSuccess = (success) => {
  return {
    type: actionTypes.APPROVE_USER_PENDING_SUCCESS,
    success: success,
  };
};

export const approveUserPendingFail = (error) => {
  return {
    type: actionTypes.APPROVE_USER_PENDING_FAIL,
    error: error,
  };
};

export const approveUserPending = (selectedCourse, selectedUser) => {
  return (dispatch) => {
    dispatch(approveUserPendingStart());
    let path = "usersRefuse";
    if(selectedCourse.usersPending.includes(selectedUser.id))
      path = "usersPending";
    const usersPendOrRefuseRequest = get(selectedCourse, path, []).filter((course)=> course !== selectedUser.id);
    const usersSuccessRequest = selectedCourse.usersSuccess;
    usersSuccessRequest.push(selectedUser.id);
    selectedCourse = {...selectedCourse, usersSuccess: usersSuccessRequest};
    set(selectedCourse, path, usersPendOrRefuseRequest);
    let updateObject = {};
    set(updateObject, path, usersPendOrRefuseRequest);
    set(updateObject, "usersSuccess", usersSuccessRequest);

    updateDoc(doc(db, 'cursos', selectedCourse.id), updateObject)
      .then((response) => {
        // console.log(response.data);
        dispatch(approveUserPendingSuccess("Success"));
        if (selectedCourse) {
          dispatch(fetchUserPendingListOfCourse(selectedCourse));
          dispatch(fetchUserListOfCourse(selectedCourse));
          dispatch(fetchUserRefuseListOfCourse(selectedCourse));
        }
      })
      .catch((error) => {
        // console.log(error);
        dispatch(approveUserPendingFail(error.response.data));
      });
  };
};

export const disapproveUserStart = () => {
  return {
    type: actionTypes.DISAPPROVE_USER_START,
  };
};

export const disapproveUserSuccess = (success) => {
  return {
    type: actionTypes.DISAPPROVE_USER_SUCCESS,
    success: success,
  };
};

export const disapproveUserFail = (error) => {
  return {
    type: actionTypes.DISAPPROVE_USER_FAIL,
    error: error,
  };
};

export const disapproveUser = (selectedCourse, selectedUser) => {
  return (dispatch) => {
    dispatch(disapproveUserStart());
    let path = "usersSuccess";
    if(selectedCourse.usersPending.includes(selectedUser.id))
      path = "usersPending";
    const usersPendOrSuccRequest = get(selectedCourse, path, []).filter((course)=> course !== selectedUser.id);
    const usersRefuseRequest = selectedCourse.usersRefuse;
    usersRefuseRequest.push(selectedUser.id);
    selectedCourse = {...selectedCourse, usersRefuse: usersRefuseRequest};
    set(selectedCourse, path, usersPendOrSuccRequest);
    let updateObject = {};
    set(updateObject, path, usersPendOrSuccRequest);
    set(updateObject, "usersRefuse", usersRefuseRequest);

    updateDoc(doc(db, 'cursos', selectedCourse.id), updateObject)
      .then((response) => {
        // console.log("Banned message: ", response.data);
        dispatch(disapproveUserSuccess("Success"));
        dispatch(fetchUserListOfCourse(selectedCourse));
        dispatch(fetchUserPendingListOfCourse(selectedCourse));
        dispatch(fetchUserRefuseListOfCourse(selectedCourse));
      })
      .catch((error) => {
        dispatch(disapproveUserFail(error.response.data));
      });
  };
};

export const uploadImageStart = () => {
  return {
    type: actionTypes.UPLOAD_IMAGE_START,
  };
};

export const uploadImageSuccess = (success) => {
  return {
    type: actionTypes.UPLOAD_IMAGE_SUCCESS,
    success: success,
  };
};

export const uploadImageFail = (error) => {
  return {
    type: actionTypes.UPLOAD_IMAGE_FAIL,
    error: error,
  };
};

export const uploadImage = (selectedImage, courseName, group, courseId) => {
  return (dispatch) => {
    dispatch(uploadImageStart());
    // const url = "/QuanLyKhoaHoc/UploadHinhAnhKhoaHoc";
    // const formData = {
    //   file: selectedImage.name,
    //   courseName: courseName,
    //   group: group
    // };

    const storage = getStorage();
    const mountainImagesRef = ref(storage, selectedImage.name);

    // 'file' comes from the Blob or File API
    uploadBytes(mountainImagesRef, selectedImage).then((response) => {
      getDownloadURL(ref(storage, selectedImage.name)).then((url) => {
        updateDoc(doc(db, 'cursos', courseId), {imageUrl: url }).then((responseUpdate) => {
          dispatch(uploadImageSuccess("Success"));
        })
      })
    })
    .catch((error) => {
      console.log("uploadImage:", error);
      dispatch(uploadImageFail(error.response));
    });
  };
};

export const deleteCourseStart = () => {
  return {
    type: actionTypes.DELETE_COURSE_START,
  };
};

export const deleteCourseSuccess = (success) => {
  return {
    type: actionTypes.DELETE_COURSE_SUCCESS,
    success: success,
  };
};

export const deleteCourseFail = (error) => {
  return {
    type: actionTypes.DELETE_COURSE_FAIL,
    error: error,
  };
};

export const deleteCourse = (selectedCourse, keyWord, group, courseType) => {
  return (dispatch) => {
    dispatch(deleteCourseStart());
    // const user = JSON.parse(localStorage.getItem("user"));
    // const url = `/QuanLyKhoaHoc/XoaKhoaHoc?MaKhoaHoc=${selectedCourse.maKhoaHoc}`;
    // const headers = {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${user.accessToken}`,
    // };
    deleteDoc(doc(db, 'cursos', selectedCourse.id))
      .then((response) => {
        // console.log(response.data);
        dispatch(deleteCourseSuccess("Success"));
        dispatch(fetchCoursesList(keyWord, group, courseType));
      })
      .catch((error) => {
        dispatch(deleteCourseFail(error));
      });
  };
};
