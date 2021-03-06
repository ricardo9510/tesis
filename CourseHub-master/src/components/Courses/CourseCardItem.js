import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as actions from "../../store/actions";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  IconButton,
  Typography,
  Button,
  Tooltip,
} from "@material-ui/core";

import { Edit, Delete } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 155,
  },
  title: {
    height: 42,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  edit: {
    marginLeft: "auto",
  },
}));

const CourseCard = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { course, tabIndex, group, courseType, error, success } = props;
  const {
    onFetchUsersClick,
    onEditCourseClick,
    onFetchUserListOfCourse,
    onFetchUserPendingListOfCourse,
    onFetchUserRefuseListOfCourse,
    onFetchCourseIndex,
    onDeleteCourse,
  } = props;

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
  }, [enqueueSnackbar, error, success]);

  const handCourseInfo = (course) => {
    onFetchUsersClick(course, tabIndex);
    onFetchUserListOfCourse(course);
    onFetchUserPendingListOfCourse(course);
    onFetchUserRefuseListOfCourse(course);
  };

  const handCourseEdit = (course) => {
    onFetchCourseIndex();
    onFetchUsersClick(course);
    onEditCourseClick(course, tabIndex);
  };

  const handleDeleteConfirm = (course) => {
    enqueueSnackbar(`Desea eliminar el curso ${course.courseName}?`, {
      variant: "info",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
      action: (
        <Button
          size="small"
          variant="contained"
          onClick={() => onDeleteCourse(course, null, group, courseType)}
          startIcon={<Delete />}
        >
          Borrar
        </Button>
      ),
    });
  };

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => handCourseInfo(course)}>
        <CardMedia
          className={classes.media}
          image={course.imageUrl}
          title={course.courseName}
        />
        <CardContent>
          <Typography
            className={classes.title}
            variant="subtitle2"
            component="h5"
            // noWrap
          >
            {course.courseName}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions disableSpacing>
        <IconButton
          aria-label="delete"
          onClick={() => handleDeleteConfirm(course)}
        >
          <Tooltip title="Delete" placement="right">
            <Delete />
          </Tooltip>
        </IconButton>

        <IconButton
          aria-label="edit"
          className={classes.edit}
          onClick={() => handCourseEdit(course)}
        >
          <Tooltip title="Edit" placement="left">
            <Edit />
          </Tooltip>
        </IconButton>
      </CardActions>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    group: state.auth.group,
    courseType: state.coursesManager.courseType,
    courseList: state.coursesManager.courseList,
    tabIndex: state.coursesManager.tabIndex,
    error: state.coursesManager.error,
    success: state.coursesManager.success,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCourseIndex: () => dispatch(actions.fetchCourseIndex()),
    onFetchUsersClick: (selectedCourse, tabIndex) =>
      dispatch(actions.fetchUsersClick(selectedCourse, tabIndex)),
    onEditCourseClick: (selectedCourse, tabIndex) =>
      dispatch(actions.editCourseClick(selectedCourse, tabIndex)),
    onFetchUserListOfCourse: (selectedCourse) =>
      dispatch(actions.fetchUserListOfCourse(selectedCourse)),
    onFetchUserPendingListOfCourse: (selectedCourse) =>
      dispatch(actions.fetchUserPendingListOfCourse(selectedCourse)),
    onFetchUserRefuseListOfCourse: (selectedCourse) =>
      dispatch(actions.fetchUserRefuseListOfCourse(selectedCourse)),
    onDeleteCourse: (selectedCourse, keyWord, group, courseType) =>
      dispatch(
        actions.deleteCourse(selectedCourse, keyWord, group, courseType)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseCard);
