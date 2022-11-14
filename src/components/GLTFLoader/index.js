import { AbstractObject, CONST } from "@garpix/gengien";
import { GLTFLoader } from "./GLTFLoader";
import {
  AnimationMixer,
  Vector3,
  BoxBufferGeometry,
  MeshLambertMaterial,
  Mesh
} from "three";
import { v4 } from "uuid";

class GLTF extends AbstractObject {
  constructor(props) {
    super(props);
    this.mixer = null;
    this.currentAnimation = null;
    this.clips = [];
    this.statusLoad = false;
  }

  createVisiblePivot = (pivot) => {
    let geometry = new BoxBufferGeometry(1, 1, 1);
    let material = new MeshLambertMaterial({
      wireframe: true,
      color: "#eb4034"
    });
    let mesh = new Mesh(geometry, material);
    mesh.position.setX(pivot.x);
    mesh.position.setY(pivot.y);
    mesh.position.setZ(pivot.z);
    mesh.name = "pivot";
    mesh.scale.set(1, 1, 1);
    this.obj.add(mesh);
  };

  getClipByName = (clipName) => {
    return this.clips.filter((el) => {
      return el.name === clipName;
    })[0];
  };

  setAnimation = (animation) => {
    if (!animation) return;
    const { clipName } = animation;
    if (!clipName) return;
    const clip = this.getClipByName(clipName);
    if (clip) {
      this.mixer.stopAllAction();
      this.mixer.clipAction(clip).play();
    }
  };

  componentWillUnmount() {
    this.unmountObjectComponent();
  }

  componentDidMount() {
    const {
      requiredPropertys,
      url = null, // required!!!
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      quaternion = false,
      scale = [1, 1, 1],
      pivot = false,
      visiblePivot = false,
      onLoadComplete = null,
      animation = null,
      visible = true,
      name = CONST.DATA_OBJECT_SCENE.GLTF.name,
      uuid = v4(),
      customAttribute = {},
      callback = [],
      parent,
      managerLoader = () => {},
      startLoadGLTF = () => {},
      progressLoadGLTF = (e) => {},
      errorLoadGLTF = (e) => {}
    } = this.props;
    if (!url) return;
    let {
      scene,
      addRenderCall = () => {
        console.log("Не передан addRenderCall");
      },
      enableShadows
    } = requiredPropertys;
    this.mixer = null;
    this.currentAnimation = null;
    this.clips = [];
    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data

    // Load a glTF resource
    loader.load(
      // resource URL
      url,
      // called when the resource is loaded
      (gltf) => {
        if (this.statusLoad) return;
        this.statusLoad = true;
        // gltf.scene.children.forEach((element) => {
        //   scene.add(element);
        // });
        scene.matrixWorldNeedUpdate = true;
        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object

        if (animation) {
          this.mixer = new AnimationMixer(gltf.scene);
          this.clips = gltf.animations;
          this.setAnimation(animation);
          addRenderCall(
            "animations",
            (deltaSeconds) => {
              this.mixer.update(deltaSeconds);
            },
            v4()
          );
        }
        scene.add(gltf.scene);
      },
      // called while loading is progressing
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      (error) => {
        console.log("An error happened", error);
      }
    );
    // this.loader = new GLTFLoader({
    //   itemStart: (e) => console.log(e),
    //   resolveURL: (e) => console.log(e),
    //   onLoad: (e) => console.log(e),
    //   onProgress: (e) => console.log(e),
    //   onError: (e) => console.log(e)
    // });
    // this.loader.crossOrigin = true;
    // // this.loader.manager.onLoad = () => {
    // //   //   this.readyComponent();
    // //   if (onLoadComplete) {
    // //     onLoadComplete(this.obj);
    // //     if (this.onPropsUpdate) this.onPropsUpdate({}, this.props);
    // //   }
    // // };
    // this.loader.manager.onError = errorLoadGLTF;
    // this.loader.manager.onStart = () => {
    //   startLoadGLTF();
    // };
    // debugger;
    // this.loader.load(url);
    // this.loader.load(
    //   url,
    //   (data) => {
    //     this.initComponent(name, uuid);
    //     this.obj = data.scene;
    //     this.obj.visible = visible;
    //     if (pivot) {
    //       let pivotGlobalPosition = new Vector3(pivot[0], pivot[1], pivot[2]);
    //       this.obj.pivot = pivotGlobalPosition;
    //       if (visiblePivot) {
    //         this.createVisiblePivot(this.obj.localToWorld(pivotGlobalPosition));
    //       }
    //     }
    //     this.setRotation(rotation);
    //     this.setQuaternion(quaternion);
    //     this.setPosition(position);
    //     this.setScale(scale);
    //     // addEventCustomListener(this.obj, callback);
    //     this.obj.name = name;
    //     if (enableShadows) {
    //       this.obj.traverse(function (node) {
    //         if (node.isMesh || node.isLight) {
    //           node.castShadow = true;
    //           node.receiveShadow = true;
    //         }
    //       });
    //     }
    //     this.addToScene(parent ? parent : scene);
    //     this.uuid = uuid;
    //     this.obj._customAttribute = customAttribute;
    //     this.obj.castShadow = enableShadows;
    //     this.obj.receiveShadow = enableShadows;
    //     if (animation) {
    //       this.mixer = new AnimationMixer(this.obj);
    //       this.clips = data.animations;
    //       this.setAnimation(animation);
    //       addRenderCall(
    //         "gltfAnimation",
    //         (deltaSeconds) => {
    //           this.mixer.update(deltaSeconds);
    //         },
    //         v4()
    //       );
    //     }
    //     this.readyComponent();
    //   }
    //   // (progress) => progressLoadGLTF(progress)
    // );
  }

  shouldComponentUpdate(nextProps) {
    const { animation } = this.props; //, selectedMaterial = null
    if (nextProps.animation && nextProps.animation.clipName) {
      if (!animation || animation.clipName !== nextProps.animation.clipName) {
        this.setAnimation({
          clipName: nextProps.animation.clipName
        });
      }
    }
    this.onPropsUpdate(this.props, nextProps);
    return true;
  }

  render() {
    return null;
  }
}

export default GLTF;
