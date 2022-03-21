import React, { useEffect, Fragment } from "react";

import { connect } from "react-redux";
import * as actions from "../../store/actions";

import { makeStyles } from "@material-ui/core/styles";

import { List, ListItem, Tooltip } from "@material-ui/core";
import { Fab, Box, TextField, Grid } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import Spinner from "../UI/Spinner/Spinner";
import CourseCardItem from "./CourseCardItem";
import ChooseGroup from "./InputCustom/ChooseGroup";
import DataLength from "../DataDisplay/DataLength";
import UserCardItem from "./UserCardItem";

const useStyles = makeStyles((theme) => ({
  courseItems: {
    zIndex: 10,
    width: "100%",
    minWidth: 350,
    backgroundColor: theme.palette.background.paper,
  },
  courseList: {
    flexGrow: 1,
    height: "75vh",
    overflowY: "auto",
    "@media (max-width: 836px)": {
      height: "250px",
    },
  },
  childMargin: {
    "& > *": {
      margin: theme.spacing(0),
    },
  },
}));

function CourseListNew(props) {
  const classes = useStyles();

  const { courseList, courseType, group, loading } = props;
  const { onFetchCourseList, onFetchCourseIndex } = props;

  useEffect(() => {
    onFetchCourseIndex();
  }, [onFetchCourseIndex]);

  useEffect(() => {
    onFetchCourseList(null, group, courseType);
  }, [onFetchCourseList, group, courseType]);

  let courseListRender = <Spinner />;

  if (courseList && courseList.length > 0) {
    courseListRender = courseList.map((course, index) => (
      <Grid item key={index}>
        <UserCardItem course={course} />
      </Grid>
    ));
  }

  return (
    <Fragment>
      <List dense className={classes.courseItems}>
        <ListItem>
          <Grid container justify="space-between" alignItems="center">

            {courseList && courseList.length ? (
              <DataLength items={courseList.length} type={"courses"} />
            ) : null}

            <ChooseGroup />
          </Grid>
        </ListItem>

        <ListItem>
          <Box mb={1} mr={1} width={"100%"}>
            <TextField
              id="filled-search"
              label="Buscar Curso..."
              type="search"
              fullWidth
              onChange={(event) =>
                onFetchCourseList(event.target.value, group, courseType)
              }
            />
          </Box>
        </ListItem>
      </List>

      <Box mx={2}>
        <Grid
          container
          spacing={2}
          justify={"center"}
          className={classes.courseList}
        >
          {courseListRender}
        </Grid>
      </Box>
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    group: state.auth.group,
    courseList: state.coursesManager.courseList,
    courseType: state.coursesManager.courseType,
    error: state.coursesManager.error,
    success: state.coursesManager.success,
    loading: state.coursesManager.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCourseIndex: () => dispatch(actions.fetchCourseIndex()),
    onFetchCourseList: (keyWord, group, courseType) =>
      dispatch(actions.fetchCoursesList(keyWord, group, courseType)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseListNew);
