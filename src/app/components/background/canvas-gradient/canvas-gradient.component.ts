// import { Component, ElementRef, OnInit, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
// import { ThemeService } from '../../../services/theme.service';
// import * as THREE from 'three'; // Import Three.js
// import { isPlatformBrowser } from '@angular/common'; // Import this at the top

// @Component({
//   selector: 'app-canvas-gradient',
//   template: `
//     <div class="canvas-wrapper">
//       <canvas #canvasRef id="renderCanvas"></canvas>
//     </div>
//   `,
//   styleUrls: ['./canvas-gradient.component.scss'] // Add your styles here
// })
// export class CanvasGradientComponent implements OnInit, OnDestroy {
//   @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
//   private scene!: THREE.Scene;
//   private camera!: THREE.Camera;
//   private renderer!: THREE.WebGLRenderer;
//   private gradientMesh!: THREE.Mesh;

//   gradientType: string | null = null; // 'linear' or 'conic'
//   conicCenterX: number | null = null;
//   conicCenterY: number | null = null;
//   conicRotation: number | null = null;

//   colorTopHex: string = '#ffffff';
//   colorBottomHex: string = '#333333';
//   midPoint: number = 33;
//   activeGradientType: string = 'linear';
//   conicCenter: [number, number] = [0.5, 0.5];
//   activeConicRotation: number = 134;
//   currentTheme: any; // Define a proper type for currentTheme

//   constructor(
//     private themeService: ThemeService,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//   ngOnInit() {
//     this.currentTheme = this.themeService.getThemeData();

//     // Check if theme and theme.data are defined
//     if (this.currentTheme) {
//         this.colorTopHex = this.currentTheme.gradStart || '#ffffff';
//         this.colorBottomHex = this.currentTheme.gradStop  || '#333333';
//         this.midPoint = 0.5;
//         this.activeGradientType = this.currentTheme.gradientType  || 'linear';
//         this.conicCenter = [
//             0.5,
//              0.5
//         ];
//         this.activeConicRotation = 7.5; // Set default or theme value
//     } else {
//         console.error('Theme data is not defined or does not have the expected structure:',this.currentTheme);
//         // Set default values or handle the error as needed
//         this.colorTopHex = '#ffffff';
//         this.colorBottomHex = '#333333';
//         this.midPoint = 0.5;
//         this.activeGradientType = 'linear';
//         this.conicCenter = [0.5, 0.5];
//         this.activeConicRotation = 7.5; // Default value
//     }

//     this.initializeThreeJS(); // Initialize Three.js
//     this.draw(); // Initial draw
//   }

//   ngOnDestroy() {
//     // Cleanup if necessary
//     this.renderer.dispose();
//   }

//   private initializeThreeJS() {
//     if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
//         const canvas = this.canvasRef.nativeElement;
//         this.scene = new THREE.Scene();
//         this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
//         this.camera.position.z = 1;

//         this.renderer = new THREE.WebGLRenderer({ canvas });
//         this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//         window.addEventListener('resize', () => this.resizeCanvas());
//     } else {
//         console.warn('WebGL is not available in this environment.');
//     }
//   }

//   private resizeCanvas() {
//     const canvas = this.canvasRef.nativeElement;
//     const displayWidth = canvas.clientWidth;
//     const displayHeight = canvas.clientHeight;
//     if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
//       canvas.width = displayWidth;
//       canvas.height = displayHeight;
//       this.renderer.setSize(canvas.width, canvas.height);
//     }
//   }

//   private draw() {
//     if (!this.scene) {
//       console.error('Scene is not initialized. Cannot draw.');
//       return; // Exit if the scene is not initialized
//     }
    
//     this.createAndAddGradientMesh(); // Separate method for creating and adding the gradient mesh
//     this.renderer.render(this.scene, this.camera);
//   }

//   private createAndAddGradientMesh() {
//     // Create gradient material
//     const gradientTexture = this.createGradientTexture();
//     const geometry = new THREE.PlaneGeometry(2, 2);
//     this.gradientMesh = new THREE.Mesh(geometry, gradientTexture);
//     this.scene.add(this.gradientMesh);
//   }

//   private createGradientTexture(): THREE.ShaderMaterial {
//     const colors = [this.hexToRgb(this.colorTopHex), this.hexToRgb(this.colorBottomHex)];
//     const uniforms = {
//       colorTop: { value: new THREE.Color(...colors[0]) },
//       colorBottom: { value: new THREE.Color(...colors[1]) },
//       midPoint: { value: this.midPoint },
//     };

//     const material = new THREE.ShaderMaterial({
//       uniforms,
//       vertexShader: `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         uniform vec3 colorTop;
//         uniform vec3 colorBottom;
//         uniform float midPoint;
//         varying vec2 vUv;
//         void main() {
//           vec3 color = mix(colorBottom, colorTop, smoothstep(0.0, 1.0, vUv.y * 2.0 - midPoint));
//           gl_FragColor = vec4(color, 1.0);
//         }
//       `,
//     });

//     return material;
//   }

//   private hexToRgb(hex: string): [number, number, number] {
//     hex = hex.replace(/^#/, '');
//     const bigint = parseInt(hex, 16);
//     const r = (bigint >> 16) & 255;
//     const g = (bigint >> 8) & 255;
//     const b = bigint & 255;
//     return [r / 255, g / 255, b / 255]; // Normalize to [0, 1]
//   }
// }
