import React, { Fragment, useState } from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import { useMediaQuery, Avatar } from "@material-ui/core";
import { GridList, GridListTile } from "@material-ui/core";
import { Grid, Button, Box, Typography, Paper } from "@material-ui/core";

import { LiveTv, AllInclusive, Bookmark } from "@material-ui/icons";

import Carousel from "react-material-ui-carousel";
import Image from "material-ui-image";
import CountUp from "react-countup";

import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";

import CourseList from "../../components/CourseList/CourseList";

import heroImage from "../../assets/images/home-hero.jpg";

import course1 from "../../assets/images/episodes/1.png";
import course2 from "../../assets/images/episodes/2.png";
import course3 from "../../assets/images/episodes/3.png";
import course4 from "../../assets/images/episodes/4.png";
import course5 from "../../assets/images/episodes/5.png";
import course6 from "../../assets/images/episodes/6.png";

import tileimage1 from "../../assets/images/blog/img-1.jpg";
import tileimage2 from "../../assets/images/blog/img-2.jpg";
import tileimage3 from "../../assets/images/blog/img-3.jpg";
import tileimage4 from "../../assets/images/blog/img-4.jpg";
import tileimage5 from "../../assets/images/blog/img-5.jpg";

const useStyles = makeStyles((theme) => ({
  heroText: {
    position: "absolute",
    margin: "0 10% 0 10%",
    color: "white",
  },
  header: {
    height: "60vh",
    backgroundSize: "cover",
    backgroundPosition: "65% 50%",
    backgroundAttachment: "fixed",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
  },
  avatar: {
    backgroundColor: "#e67e22",
  },
  feature: {
    color: "white",
    minHeight: "30vh",
    position: "relative",
    background: `linear-gradient(300deg, #009DD9, #17406D)`,
  },
  intro: {
    position: "relative",
    background: `linear-gradient(300deg, #009DD9, #17406D)`,
    animation: `5s ease 0s infinite normal none running Gradient`,
    color: "white",
  },
  topSwoop: {
    position: "absolute",
    top: "-2px",
  },
  bottomSwoop: {
    position: "absolute",
    bottom: "-2px",
    zIndex: 0,
  },
  gridListRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "wrap",
    transform: "translateZ(0)",
  },
  titleNumber: {
    lineHeight: "85%",
    "@media (max-width: 1274px)": {
      lineHeight: "100%",
    },
    "@media (max-width: 600px)": {
      fontSize: "4rem",
    },
  },
}));

const slideItems = [
  {
    media: course1,
    title: "Esta es una característica muy interesante.",
    subtitle: "Solo usar esto te dejará boquiabierto.",
  },
  {
    media: course2,
    title: "¿Alguna vez quisiste ser popular?",
    subtitle: "Bueno, solo mezcla dos colores y ¡ya estás listo!",
  },
  {
    media: course3,
    title: "Que la fuerza lo acompañe",
    subtitle:
      "La Fuerza es un poder metafísico y ubicuo en el universo ficticio de Star Wars.",
  },
  {
    media: course4,
    title: "Que la fuerza lo acompañe",
    subtitle:
      "La Fuerza es un poder metafísico y ubicuo en el universo ficticio de Star Wars.",
  },
  {
    media: course5,
    title: "Que la fuerza lo acompañe",
    subtitle:
      "La Fuerza es un poder metafísico y ubicuo en el universo ficticio de Star Wars.",
  },
  {
    media: course6,
    title: "Que la fuerza lo acompañe",
    subtitle:
      "La Fuerza es un poder metafísico y ubicuo en el universo ficticio de Star Wars.",
  },
];

const tileData = [
  {
    img: tileimage1,
    cols: 1,
  },
  {
    img: tileimage2,
    cols: 1,
  },
  {
    img: tileimage3,
    cols: 1,
  },
  {
    img: tileimage4,
    cols: 1,
  },
  {
    img: tileimage5,
    cols: 2,
  },
];

const featureList = [
  {
    icon: <LiveTv />,
    title: "cursos online",
    subtitle: "Disfruta de una variedad de temas nuevos.",
    count: <CountUp end={1000} duration={6} style={{ marginRight: 4 }} />,
  },
  {
    icon: <Bookmark />,
    title: "Instrucción experta",
    subtitle: "Encuentra el instructor adecuado para ti",
    count: null,
  },
  {
    icon: <AllInclusive />,
    title: "Acceso de por vida",
    subtitle: "Aprende en tu horario",
    count: null,
  },
];

const AutoRotatingCarouselModal = ({ handleOpen, setHandleOpen, isMobile }) => {
  return (
    <div>
      <AutoRotatingCarousel
        label="Empezar"
        open={handleOpen.open}
        onClose={() => setHandleOpen({ open: false })}
        onStart={() => setHandleOpen({ open: false })}
        autoplay={false}
        hideArrows={false}
        mobile={isMobile}
      >
        {slideItems.map((item) => (
          <Slide
            key={item.title}
            media={<img src={item.media} alt={item.title} />}
            title={item.title}
            subtitle={item.subtitle}
            mediaBackgroundStyle={{
              background: `linear-gradient(300deg, #009DD9, #17406D)`,
            }}
            style={{ background: `linear-gradient(300deg, #009DD9, #17406D)` }}
          />
        ))}
      </AutoRotatingCarousel>
    </div>
  );
};

function Dashboard({ darkTheme }) {
  const classes = useStyles();
  const matchSM = useMediaQuery("(min-width:600px)");
  const matchMD = useMediaQuery("(min-width:1000px)");
  const matchLG = useMediaQuery("(min-width:1400px)");
  const user = JSON.parse(localStorage.getItem("user"));
  const localTheme = JSON.parse(localStorage.getItem("darkTheme"));
  const [handleOpen, setHandleOpen] = useState({ open: false });

  let isTheme = darkTheme;
  if (!darkTheme) {
    isTheme = localTheme;
  }

  const handleClick = () => {
    setHandleOpen({ open: true });
  };

  const topSwoop = (//ondulaciones arriba
    <svg
      viewBox="0 0 1430 140"
      className={classes.topSwoop}
      fill={isTheme ? "#303030" : "#fafafa"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1440 0v59.969c-65.287-39.594-188.865-55.343-370.736-47.248C766 26.221 627.87 140 277 140 171.698 140 79.365 124.417 0 93.25V0h1440z"></path>
    </svg>
  );

  const bottomSwoop = (//ondulaciones abajo
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1430 140"
      fill={isTheme ? "#303030" : "#fafafa"}
      className={classes.bottomSwoop}
    >
      <path d="M0 140h1440V46.75C1360.635 15.583 1268.302 0 1163 0 812.13 0 674 113.78 370.736 127.279 188.866 135.374 65.286 119.625 0 80.03V140z"></path>
    </svg>
  );

  return (
    <Fragment>
      <Grid container alignItems="center" className={classes.header}>
        <Grid item className={classes.heroText}>
          <Typography variant="h4" gutterBottom>
            Aprende HTML , CSS , Web Apps & Mas
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Aprenda a crear sitios web & aplicaciones. Escriba un código o inicie un negocio
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Hacer un tour
          </Button>
          <AutoRotatingCarouselModal
            isMobile={matchSM}
            handleOpen={handleOpen}
            setHandleOpen={setHandleOpen}
          />
        </Grid>
      </Grid>

      {/* aqui deberia ir los auspiciantes */}

      <Box my={5} style={{ minHeight: 520 }}>
        <Box mx={6} py={3}>
          <Typography variant="h5" gutterBottom>
            <strong>Descubre el aprendizaje permanente</strong>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Elije los cursos que mas te gusten
          </Typography>
        </Box>
        <CourseList />
        {/* aqui hay que cambiar a espaniol */}
      </Box>

      <Box className={classes.intro}>
        {topSwoop}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          minHeight="70vh"
        >
          <Box mx={5} minWidth={315} alignSelf="center">
            <Box>
              <Typography variant="h4" color="inherit">
                Elije e inscribite en tus sus cursos favoritos
              </Typography>
            </Box>
            <Box mt={3}>
              <Typography>
                Simplemente regístrate en Preuniversitario MAYA para comenzar a estudiar y recibir certificados.
              </Typography>
            </Box>
            {user ? null : (
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={"/sign-up"}
                  style={{ width: 150 }}
                >
                  Inscribete
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to={"/sign-in"}
                  style={{ width: 150, marginLeft: 8, color: "inherit" }}
                >
                  Ingresar
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        {bottomSwoop}
      </Box>

      <Box my={5} display="flex" alignContent="center" justifyContent="center">
        <Box width="100vh">
          <Carousel
            animation={"slide"}
            timeout={250}
            indicators={false}
            className={classes.carousel}
          >
            {slideItems.map((item) => (
              <Paper key={item.title}>
                <Image src={item.media} aspectRatio={16 / 9} />
              </Paper>
            ))}
          </Carousel>
        </Box>
      </Box>

      <Box className={classes.intro}>
        {topSwoop}
        <Box
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          pt={matchLG ? 20 : matchMD ? 15 : 10}
          pb={5}
        >
          <Box alignSelf="flex-start" maxWidth={500} m={5}>
            <Box display="flex">
              <Box ml={1} display="flex" flexDirection="column">
                <Typography variant="h4">
                  Fácil de buscar el curso que desea aprender
                </Typography>
                <Typography style={{ marginTop: 16 }}>
                  Preuniversitario MAYA tiene muchos cursos a tu disposición. Las personas que ingresan
                  tienen acceso a toda la información y recursos de los cursos seleccionado.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box alignSelf="flex-end" maxWidth={500} m={5}>
            <Box display="flex">
              <Box ml={1} display="flex" flexDirection="column">
                <Typography variant="h4">
                  Profesores de excelencia
                </Typography>
                <Typography style={{ marginTop: 16 }}>
                  En Preuniversitario MAYA contamos con un equipo dinámico, responsable e innovador que son profesores y formadores 
                  de empresas y corporaciones experimentadas.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box alignSelf="flex-start" maxWidth={500} m={5}>
            <Box display="flex">
              <Box ml={1} display="flex" flexDirection="column">
                <Typography variant="h4">
                  Adquiere tus nuevas habilidades deseadas
                </Typography>
                <Typography style={{ marginTop: 16 }}>
                  El aplicativo web Preuniversitario MAYA está construido meticulosamente para mejorar la
                  interacción entre alumnos y profesores. Proporciona un experiencia auténtica y fácil de adquirir conocimientos.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        {bottomSwoop}
      </Box>

      <Box my={5} display="flex" alignContent="center" justifyContent="center">
        <Box width="100vh">
          <GridList cellHeight={160} className={classes.gridList} cols={3}>
            {tileData.map((tile) => (
              <GridListTile key={tile.img} cols={tile.cols || 1}>
                <img src={tile.img} alt={tile.title} />
              </GridListTile>
            ))}
          </GridList>
        </Box>
      </Box>

      <Box className={classes.intro}>
        {topSwoop}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          minHeight="50vh"
        >
          <Box mx={5} mt={20} minWidth={315} alignSelf="center">
            <Box>
              <Typography variant="h4" color="inherit">
                Un montón de temas te están esperando
              </Typography>
            </Box>
            <Box mt={3}>
              <Typography>¿Que estas esperando? ¡Únete a nosotros ahora!</Typography>
            </Box>
            {user ? null : (
              <Box mt={2}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  component={Link}
                  to={"/sign-up"}
                  style={{ width: 150 }}
                >
                  Inscribirse
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    darkTheme: state.ui.darkTheme,
  };
};

export default connect(mapStateToProps)(Dashboard);
