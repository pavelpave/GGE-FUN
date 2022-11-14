import { ReactElement, useState } from "react";
import reactLogo from "./assets/react.svg";
import {
  CONST,
  BLACK_LIST_CONSTROLS,
  STATE_ACTION,
  AbstractObject,
  Canvas,
  Camera,
  OrbitControl,
  DragAndDropControl,
  Plane,
  Cylinder,
  Line,
  Sphere,
  Raycaster,
  OBJ,
  GenericGroupObject,
  Grid,
  Sky,
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  DevMode,
  MiscControlsPointerlock,
  PLC,
  MovePoint,
  Aim,
  Box as GBox,
  ProviderCanvas
} from "@garpix/gengien";
import { MeshStandardMaterial, Object3D, Scene } from "three";

import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

//@ts-ignore
import { GLTFLoader } from "./components/GLTFLoader/GLTFLoader.js";
//@ts-ignore
import GLTF from "./components/GLTFLoader";
import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Avatar from "@mui/material/Avatar";
import ButtonGroup from "@mui/material/ButtonGroup";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

import styles from "./styles/index.module.scss";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto"
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  pr: 5,
  pl: 5
};

interface IState {
  linkToSceneObject: Scene | null;
}

export default function BottomAppBar() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = useState<IState>({
    linkToSceneObject: null
  });
  const [isLoadedModel, setisLoadedModel] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getLinkScene = (scene: Scene) => {
    setState({
      linkToSceneObject: scene
    });
  };

  const loadGltf = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (readerEvent) => {
      const contents = readerEvent?.target?.result;
      const loader = new GLTFLoader();
      try {
        loader.parse(contents, "", (gltf: any) => {
          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          gltf.scene.position.set(0, 0, 5);
          if (state.linkToSceneObject) state.linkToSceneObject.add(gltf.scene);
          setOpen(false)
        });
      } catch (error) {
        console.log("error", error);
      }
    };
  };

  const loadOBJ = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (readerEvent) => {
      const contents = readerEvent?.target?.result;
      let objLoader2 = new OBJLoader2()
        .setModelName("name")
        .setUseIndices(true);
      // const callbackOnLoad = (object3d: Object3D) => {
      //   if (state.linkToSceneObject) state.linkToSceneObject.add(object3d);
      // };
      // const callbackProggress = (event: any) => {
      //   // console.log(event);
      // };

      // function onLoadMtl(mtlParseResult: any) {
      //   objLoader2.addMaterials(
      //     MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult),
      //     true
      //   );
      //   // objLoader2.load(
      //   //   url,
      //   //   callbackOnLoad,
      //   //   callbackProggress,
      //   //   undefined,
      //   //   undefined
      //   // );
      // }

      // let mtlLoader = new MTLLoader();
      const data = objLoader2.parse(contents as string | ArrayBuffer);

      data.position.set(0, 0, 5);
      if (state.linkToSceneObject) state.linkToSceneObject.add(data);
      setOpen(false)
    };
  };

  const loadGLB = (file: File) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (readerEvent) => {
      const contents = readerEvent?.target?.result;
      const loader = new GLTFLoader();
      try {
        loader.parse(contents, "", (gltf: any) => {
          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          gltf.scene.position.set(0, 0, 5);
          if (state.linkToSceneObject) state.linkToSceneObject.add(gltf.scene);
        });
      } catch (error) {
        console.log("error", error);
      }
    };
  };

  const handleUploadGLTF = (e: any) => {
    loadGltf(e.target.files[0]);
  };

  const handleUploadOBJ = (e: any) => {
    loadOBJ(e.target.files[0]);
  };

  const handleUploadGLB = (e: any) => {
    loadGLB(e.target.files[0]);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: purple[500]
      },
      secondary: {
        main: "#b3b3b3"
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          sx={{ ...style, width: "auto", borderRadius: 2 }}
          className={styles.modal__box}
        >
          <h2 id="child-modal-title">Выберите формат для загрузки</h2>
          <Box
            sx={{
              width: "100%",
              borderRadius: 2,
              paddingBottom: 2,
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "stretch",
              gap: "20px"
            }}
          >
            <Button
              onChange={handleUploadGLTF}
              variant="outlined"
              component="label"
            >
              upload GLTF
              <input hidden type="file" />
            </Button>
            <Button
              onChange={handleUploadOBJ}
              variant="outlined"
              component="label"
            >
              upload OBJ
              <input hidden type="file" />
            </Button>
            <Button
              onChange={handleUploadGLB}
              variant="outlined"
              component="label"
              disabled
            >
              upload GLB
              <input hidden type="file" />
            </Button>
          </Box>
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
          >
            <Button onClick={handleClose}>потом...</Button>

            {/* <Button color="secondary">Применить</Button> */}
          </ButtonGroup>
        </Box>
      </Modal>
      <CssBaseline />
      <Paper
        square
        sx={{
          pb: "50px",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0
        }}
      >
        <Canvas
          getScene={!state.linkToSceneObject ? getLinkScene : null}
          fullscreen={true}
          enableShadows={true}
        >
          <Camera
            position={[0, 7, 5]}
            rotation={[0, Math.PI / 2, 0]}
            zoom={1.2}
          >
            <OrbitControl maxDistance={100} enablePan={false} />
          </Camera>
          <GLTF
            url={`http://${window.location.host}/models/you_are_now/scene.gltf`}
            animation={{
              clipName: "The Twilight Zone"
            }}
          />
          <GBox
            scale={[100, 100, 100]}
            color="black"
            material={new MeshStandardMaterial({ side: 1, color: "black" })}
          />
          <AmbientLight  />
        </Canvas>
      </Paper>
      <AppBar
        position="fixed"
        color="secondary"
        sx={{ top: "auto", bottom: 0 }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          <StyledFab onClick={handleOpen} color="secondary" aria-label="add">
            <AddIcon />
          </StyledFab>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
