import React, { useState, Fragment } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { GmailTabs, GmailTabItem } from "@mui-treasury/components/tabs/gmail";
import { Box, Paper } from "@material-ui/core";
import { Inbox, LocalOffer, People, Info } from "@material-ui/icons";

import Overview from "./Overview";
import Curriculum from "./Curriculum";

const useStyles = makeStyles((theme) => ({
  gmailTabs: {
    backgroundColor: "inherit",
  },
  wrapper: {
    color: "darkgray !important",
  },
}));

function TabPanel({ children, tabNum, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={tabNum !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {tabNum === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const CourseTabs = () => {
  const classes = useStyles();
  const [tabNum, setTabNum] = useState(0);

  const handleChange = (_, newValue) => {
    setTabNum(newValue);
  };

  return (
    <Fragment>
      <GmailTabs
        value={tabNum}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="on"
        aria-label="scrollable force tabs"
        className={classes.gmailTabs}
      >
        <GmailTabItem
          icon={<Inbox />}
          label={"Resumen"}
          {...a11yProps(0)}
          classes={{ wrapper: classes.wrapper }}
        />
        <GmailTabItem
          icon={<People />}
          label={"Plan de estudios"}
          {...a11yProps(1)}
          classes={{ wrapper: classes.wrapper }}
        />
        <GmailTabItem
          icon={<LocalOffer />}
          label={"Preguntas"}
          {...a11yProps(2)}
          classes={{ wrapper: classes.wrapper }}
        />
        <GmailTabItem
          icon={<Info />}
          label={"Anuncio"}
          {...a11yProps(3)}
          classes={{ wrapper: classes.wrapper }}
        />
        <GmailTabItem
          icon={<Info />}
          label={"Reseñas"}
          {...a11yProps(4)}
          classes={{ wrapper: classes.wrapper }}
        />
      </GmailTabs>

      <Box ml={4}>
        <Paper elevation={0}>
          <TabPanel tabNum={tabNum} index={0}>
            <Overview />
          </TabPanel>

          <TabPanel tabNum={tabNum} index={1}>
            <Curriculum />
          </TabPanel>

          <TabPanel tabNum={tabNum} index={2}>
            Preguntas frecuentes
          </TabPanel>

          <TabPanel tabNum={tabNum} index={3}>
            Anuncio
          </TabPanel>

          <TabPanel tabNum={tabNum} index={4}>
            Reseñas
          </TabPanel>
        </Paper>
      </Box>
    </Fragment>
  );
};

export default CourseTabs;
