/* eslint-disable no-multi-str */
/**
 * Tips: Set the sky box to be flowing using different shaders
 * Author: AnastasiaWangyx
 */
 import React, { useEffect, useRef } from 'react';
 import ReactDOM from 'react-dom';
 import * as THREE from 'three';
 import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
 import Stats from 'three/examples/jsm/libs/stats.module.js';
 import { vertexShader } from './vertexShader';
 import { fragmentShader } from './fragmentShader';
 
 function Demo() {
     const containerRef = useRef(null);
     const context = useRef(null);
 
     const init = () => {
         const container = containerRef.current;
 
         // 获取长和高
         const width = container.clientWidth;
         const height = container.clientHeight;
 
         console.log('width', width);
         console.log('height', height);
 
         const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
         renderer.shadowMap.enabled = true;
         renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
         renderer.setSize(width, height);
         container.appendChild(renderer.domElement);
 
         const scene = new THREE.Scene();
         scene.background = new THREE.Color().setHSL(0.6, 0, 1);
         //scene.fog = new THREE.Fog(scene.background, 1, 10000);
         const axesHelper = new THREE.AxesHelper(1000);
         scene.add(axesHelper);
         const camera = new THREE.PerspectiveCamera(
             50,
             window.innerWidth / window.innerHeight,
             1,
             50000
         );
         camera.position.set(50, 10, 50);
 
         // LIGHTS
 
         const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
         scene.add(ambientLight);
         const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
         hemiLight.color.setHSL(0.6, 1, 0.6);
 
         // GROUND
 
         const floorMaterial = new THREE.MeshPhongMaterial({ color: '#252a34' });
         const floor = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 8, 8), floorMaterial);
         floor.rotation.x = -Math.PI / 2;
         scene.add(floor);
 
         // SKYMODE
         let uniforms = {
             iTime: { value: 1.0 },
             iResolution: { value: new THREE.Vector2(width * 1.0, height * 1.0) },
             iMouse: { value: new THREE.Vector3(0.0, 0.0, 1.0) },
             iChannel0: { value: new THREE.TextureLoader().load('/models/iChannel0.png') },
         };
         uniforms.iChannel0.value.wrapS = uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
         const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
         const skyMat = new THREE.ShaderMaterial({
             uniforms: uniforms,
             vertexShader: vertexShader.flowing_sky_vertex_shader,
             fragmentShader: fragmentShader.flowing_sky_fragment_shader,
             side: THREE.BackSide,
         });
 
         const sky = new THREE.Mesh(skyGeo, skyMat);
         console.log('sky', sky);
         scene.add(sky);
 
         
         // stats
         const stats = new Stats();
         stats.dom.style.position = 'absolute';
         container.appendChild(stats.dom);
         const controls = new OrbitControls(camera, renderer.domElement);
         let clock = new THREE.Clock();
         // 设置上下文
         context.current = {
             clock,
             uniforms,
             controls,
             stats,
             scene,
             camera,
             renderer,
         };
     };
 
     const animate = () => {
         requestAnimationFrame(animate);
         const { clock, uniforms, controls, stats, renderer, camera, scene } = context.current;
         var delta = clock.getDelta()*2;
         uniforms.iTime.value += delta;
         stats.begin();
         controls.update();
         renderer.render(scene, camera);
         stats.end();
     };
 
     useEffect(() => {
         init();
         animate();
         return () => {};
     }, []);
 
     return (
         <>
             <div
                 ref={containerRef}
                 style={{ width: '800px', height: '800px', position: 'relative' }}
             ></div>
         </>
     );
 }
 
 ReactDOM.render(<Demo />, document.getElementById('root'));
 