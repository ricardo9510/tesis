import * as actionTypes from "./actionTypes";
import axios from "../../axios";
import { query, collection, where, getDocs } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { get } from "lodash";

// ----------------- Course Index ------------------ //
export const fetchCourseIndexStart = () => {
  return {
    type: actionTypes.FETCH_COURSE_INDEX_START,
  };
};

export const fetchCourseIndexSuccess = (courseIndex) => {
  return {
    type: actionTypes.FETCH_COURSE_INDEX_SUCCESS,
    courseIndex: courseIndex,
  };
};

export const fetchCourseIndexFail = (error) => {
  return {
    type: actionTypes.FETCH_COURSE_INDEX_FAIL,
    error: error,
  };
};

export const fetchCourseIndex = (init) => {
  return (dispatch) => {
    dispatch(fetchCourseIndexStart());
    axios
      .get("/QuanLyKhoaHoc/LayDanhMucKhoaHoc")
      .then((response) => {
        const mapCursos = [{maDanhMuc: 'BackEnd', tenDanhMuc: 'Preuniversitario'},
         {maDanhMuc: 'Design', tenDanhMuc: 'Programación'},
         {maDanhMuc: 'DiDong', tenDanhMuc: 'Educación Secundaria'},
         {maDanhMuc: 'FrontEnd', tenDanhMuc: 'Educación Infantil'},  
         {maDanhMuc: 'FullStack', tenDanhMuc: 'Idiomas'},
         {maDanhMuc: 'TuDuy', tenDanhMuc: 'Diseño Gráfico'}];
        dispatch(fetchCourseIndexSuccess(mapCursos));
        if (init) {
          dispatch(fetchCourses(mapCursos[0].maDanhMuc));
        }
      })
      .catch((error) => {
        dispatch(fetchCourseIndexFail(error));
      });
  };
};

// ----------------- Courses List ------------------ //
export const fetchCoursesStart = () => {
  return {
    type: actionTypes.FETCH_COURSES_START,
  };
};

export const fetchCoursesSuccess = (courseList) => {
  return {
    type: actionTypes.FETCH_COURSES_SUCCESS,
    courseList: courseList,
  };
};

export const fetchCoursesFail = (error) => {
  return {
    type: actionTypes.FETCH_COURSES_FAIL,
    error: error,
  };
};

export const fetchCourses = (courseType, group, keyWord) => {
  return (dispatch) => {
    dispatch(fetchCoursesStart());
    if (group === undefined) {
      group = "GP08";
    }
    let queryCourses = query(collection(db,"cursos") ,  where("courseType", "==", courseType), where("group", "==", group));
    if (courseType === "all") {
      queryCourses = query(collection(db,"cursos") , where("group", "==", group));
    }
    if (keyWord) {
      queryCourses = query(collection(db,"cursos") ,  where("courseName", "==", keyWord), where("group", "==", group));
    }

    getDocs(queryCourses)
      .then((response) => {
        // console.log("Courses List: ", response.data);
        let result = [];
        response.forEach((doc) => {
          result.push({...doc.data(), id:doc.id})
        });
        dispatch(fetchCoursesSuccess(result));
      })
      .catch((error) => {
        dispatch(fetchCoursesFail(error));
      });
  };
};

// ----------------- Course Detail ------------------ //
export const fetchCourseDetailStart = () => {
  return {
    type: actionTypes.FETCH_COURSE_DETAIL_START,
  };
};

export const fetchCourseDetailSuccess = (courseDetail) => {
  return {
    type: actionTypes.FETCH_COURSE_DETAIL_SUCCESS,
    courseDetail: courseDetail,
  };
};

export const fetchCourseDetailFail = (error) => {
  return {
    type: actionTypes.FETCH_COURSE_DETAIL_FAIL,
    error: error,
  };
};

export const fetchCourseDetail = (courseId) => {
  return (dispatch) => {
    const queryCourseDetail = query(collection(db,"cursos") ,  where("courseId", "==", courseId));
    dispatch(fetchCourseDetailStart());
    getDocs(queryCourseDetail)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({...doc.data(), id:doc.id})
        });
        dispatch(fetchCourseDetailSuccess(result[0]));
      })
      .catch((error) => {
        dispatch(fetchCourseDetailFail(error));
      });
  };
};

// ----------------- User Detail ------------------ //
export const fetchUserDetailStart = () => {
  return {
    type: actionTypes.FETCH_USER_DETAIL_FAIL,
  };
};

export const fetchUserDetailSuccess = (userDetail) => {
  return {
    type: actionTypes.FETCH_USER_DETAIL_SUCCESS,
    userDetail: userDetail,
  };
};

export const fetchUserDetailFail = (error) => {
  return {
    type: actionTypes.FETCH_USER_DETAIL_FAIL,
    error: error,
  };
};

export const fetchUserDetail = () => {
  return (dispatch) => {
    dispatch(fetchUserDetailStart());
    let queryFirebase = query(collection(db, "cursos"));
    const user = JSON.parse(localStorage.getItem("user"));

    getDocs(queryFirebase)
      .then((response) => {
        let result = [];
        response.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id })
        });
        let resultFinal = result.filter(courseFilter =>
          get(courseFilter, "usersSuccess", []).includes(user.id)
        );
        dispatch(fetchUserDetailSuccess(resultFinal));
      })
      .catch((error) => {
        dispatch(fetchUserDetailFail(error));
      });
  };
};
