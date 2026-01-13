import { loadAudio } from "../libs/loader.js";
import { DRACOLoader } from "../libs/three.js-r132/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js";

const THREE = window.MINDAR.IMAGE.THREE;

// -----------------------------------------------------------------------------
// 1. DATA CONFIGURATION & LANGUAGE SETUP
// -----------------------------------------------------------------------------

const modelNames = ["Barreleye","Blobfish","Atolla Jellyfish","Dumbo Octopus","Gulper Eel",
  "Yeti Crab","Vampire Squid","Deep-sea Shark","Anglerfish","Sea Angel"];

const urlParams = new URLSearchParams(window.location.search);
const langParam = urlParams.get('lang'); 
// Force Language to English ('en')
let currentLanguage = 'en';

console.log("Current Language Mode:", currentLanguage);

// 2. UI Translation Dictionary
const uiLabels = {
    en: {
        audioBtn: "🎧 Audio Log",
        stopBtn: "⏹ Stop Log",
        backLink: "instructions-en.html",
        factBtn: "📘 SPECIES INFO ✨", 
        instructionTitle: "👆 INTERACTION",
        tap1: "Tap 1x:",
        tap1Action: "Light + Action + Talk",
        tap2: "Tap 2x:",
        tap2Action: "Interact",
        gestures: "🤏 Pinch to Zoom | 👆 Drag to Rotate"
    }
};

// 3. Narration Scripts (English)
const narrationText = {
  en: [
    `<b>SPECIES:</b> Barreleye Fish (<i>Macropinna microstoma</i>)<br><b>DEPTH:</b> 600 – 800m<br><br><i>“My head is see-through, and my eyes glow!”</i><br>Its transparent head is filled with jelly, and its glowing green eyes can rotate to see prey above.`,
    `<b>SPECIES:</b> Blobfish (<i>Psychrolutes marcidus</i>)<br><b>DEPTH:</b> 600 – 1,200m<br><br><i>“I’m not ugly — I’m just under pressure!”</i><br>It looks squishy on land, but in the deep ocean, it’s just right.`,
    `<b>SPECIES:</b> Atolla Jellyfish (<i>Atolla wyvillei</i>)<br><b>DEPTH:</b> 1,000 – 4,000m<br><br><i>“When I’m attacked, I light up!”</i><br>It flashes red and blue lights in the dark ocean to scare predators.`,
    `<b>SPECIES:</b> Dumbo Octopus (<i>Grimpoteuthis spp.</i>)<br><b>DEPTH:</b> 3,000 – 7,000m<br><br><i>“I flap my fins like ears and float like I’m flying!”</i><br>With its round head and big floppy fins, it looks like a cartoon.`,
    `<b>SPECIES:</b> Gulper Eel (<i>Eurypharynx pelecanoides</i>)<br><b>DEPTH:</b> 500 – 3,000m<br><br><i>“My mouth is bigger than my body!”</i><br>It has a long tail and a balloon-like mouth.`,
    `<b>SPECIES:</b> Yeti Crab (<i>Kiwa hirsuta</i>)<br><b>DEPTH:</b> ~2,200m<br><br><i>“I grow food on my claws!”</i><br>This crab waves its hairy arms to grow bacteria.`,
    `<b>SPECIES:</b> Vampire Squid (<i>Vampyroteuthis infernalis</i>)<br><b>DEPTH:</b> 600 – 900m<br><br><i>“I don’t bite — I just glow and go!”</i><br>It uses glowing lights and wraps itself in webbed arms.`,
    `<b>SPECIES:</b> Megamouth Shark (<i>Megachasma pelagios</i>)<br><b>DEPTH:</b> 120 – 1,500m<br><br><i>“I swim with my giant mouth wide open!”</i><br>This slow-swimming shark filters plankton with its huge, glowing lips.`,
    `<b>SPECIES:</b> Anglerfish (<i>Lophiiformes</i>)<br><b>DEPTH:</b> 300 – 1,600m<br><br><i>“I light up the dark to hunt!”</i><br>The anglerfish waves a glowing lure from her head.`,
    `<b>SPECIES:</b> Sea Angel (<i>Clione limacina</i>)<br><b>DEPTH:</b> 100 – 1,000m<br><br><i>“I’m tiny, glowing, and graceful — but I’m a hunter too!”</i><br>This small glowing creature floats like a fairy.`
  ]
};

// 4. Fact Data
const factData = [
  ["Barreleye has tubular eyes.", "Can rotate eyes for vision.", "Lives at 600–800m."],
  ["Blobfish It has no muscles! It lets the ocean do the work while it relaxes.", "Jelly-like body.", "Feeds on edible matter from sea floor."],
  ["Atolla Jellyfish Its blinking light trick is called the 'burglar alarm' strategy.", "Deep sea predator.", "Uses flashing lights to distract prey."],
  ["Dumbo Octopus It lives so deep that it doesn’t even need ink.", "Has ear-like fins.", "Feeds on small crustaceans."],
  ["Gulper Eel It can unhinge its jaw like a pelican.", "Has a glowing tip on its tail."],
  ["Yeti Crab lives at hydrothermal vents.", "Has hairy pincers.", "It has no eyes."],
  ["Vampire Squid Despite the name, it doesn’t drink blood.", "It eats drifting bits of ocean.", "Produces bioluminescent mucus."],
  ["Megamouth Shark It was only discovered in 1976.", "Fewer than 100 have ever been seen."],
  ["Anglerfish The male anglerfish is super tiny.", "Fuses to the female like a living attachment for life!.", "Uses bioluminescent lure."],
  ["Sea Angel It hunts sea butterflies.", "Has transparent body.", "Can outswim much bigger animals."],
];

// -----------------------------------------------------------------------------
// DIALOG DATA (English)
// -----------------------------------------------------------------------------
const dialogData = [
  ["My head is see-through, and my eyes glow!"],
  ["I’m not ugly — I’m just under pressure!"],
  ["When I’m attacked, I light up!"],
  ["I flap my fins like ears and float like I’m flying!"],
  ["My mouth is bigger than my body!"],
  ["I grow food on my claws!"],
  ["I don’t bite — I just glow and go!"],
  ["I swim with my giant mouth wide open!"],
  ["I light up the dark to hunt!"],
  ["I’m tiny, glowing, and graceful — but I’m a hunter too!"]
];

// -----------------------------------------------------------------------------
// 2. SETUP FUNCTIONS
// -----------------------------------------------------------------------------

const initializeMindAR = () => new window.MINDAR.IMAGE.MindARThree({
  container: document.body,
  imageTargetSrc: '../assets/targets/targets.mind',
});

const configureGLTFLoader = () => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('../libs/draco/');
  loader.setDRACOLoader(dracoLoader);
  return loader;
};

// AUTO-SCALING LOAD MODEL FUNCTION
const loadModel = async (path, index) => {
  const loader = configureGLTFLoader();
  const model = await loader.loadAsync(path);
  
  const box = new THREE.Box3().setFromObject(model.scene);
  const size = new THREE.Vector3();
  box.getSize(size);
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const targetSize = 1.3; 
  const scaleFactor = targetSize / maxDim;
  
  model.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
  
  const center = new THREE.Vector3();
  box.getCenter(center);
  model.scene.position.sub(center.multiplyScalar(scaleFactor)); 
  model.scene.position.y = 0; 

  const idleIntensity = 0.2; 

  model.userData.emissiveMeshes = [];
  model.userData.currentIntensity = idleIntensity; 
  model.userData.targetIntensity = idleIntensity;
  model.userData.idleIntensity = idleIntensity; 

  model.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        if (child.material.emissiveMap || (child.material.emissive && child.material.emissive.getHex() > 0)) {
            child.material.emissive = new THREE.Color(0xffffff); 
            child.material.emissiveIntensity = idleIntensity; 
            model.userData.emissiveMeshes.push(child);
        }
      }
    }
  });
  return model;
};

// SINGLE GLOBAL AUDIO LOADER
const loadGlobalAudio = async (path, camera) => {
  const audioLoader = new THREE.AudioLoader();
  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.Audio(listener); // Global audio
  await new Promise((resolve, reject) => {
    audioLoader.load(path, buffer => {
      sound.setBuffer(buffer);
      sound.setLoop(true); 
      sound.setVolume(0.5);
      resolve(sound);
    }, undefined, reject);
  });
  return sound;
};

// Positional Audio for Narrations/Effects
const loadAndConfigureAudio = async (path, camera) => {
  const audioLoader = new THREE.AudioLoader();
  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.PositionalAudio(listener);
  await new Promise((resolve, reject) => {
    audioLoader.load(path, buffer => {
      sound.setBuffer(buffer);
      sound.setRefDistance(1);
      resolve(sound);
    }, undefined, reject);
  });
  return sound;
};

// -----------------------------------------------------------------------------
// 3. UI HELPERS
// -----------------------------------------------------------------------------

// [GLOBAL] Track the currently open fact box to close it later
let activeFactBox = null;

let activeBubble = {
    element: null, model: null, offsetY: 0,
    typewriterTimer: null, timeoutTimer: null
};

// [MODIFIED] BUBBLE STYLE TO HANG BELOW MODEL
const getBubbleElement = () => {
    let bubble = document.getElementById("ar-bubble");
    if (!bubble) {
        bubble = document.createElement("div");
        bubble.id = "ar-bubble";
        Object.assign(bubble.style, {
            position: "absolute", width: "220px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "12px 18px", borderRadius: "15px",
            color: "#0f172a", fontFamily: "'Poppins', sans-serif",
            fontSize: "14px", fontWeight: "600", textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            opacity: "0", pointerEvents: "none",
            // [CHANGED] Anchor at top center (hangs down)
            transform: "translate(-50%, 0)", 
            transition: "opacity 0.2s ease-out",
            zIndex: "10000", border: "2px solid #0ea5e9",
            whiteSpace: "pre-wrap"
        });
        const tail = document.createElement("div");
        Object.assign(tail.style, {
            // [CHANGED] Tail moved to TOP, pointing UP
            position: "absolute", top: "-6px", left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "12px", height: "12px", backgroundColor: "white",
            // [CHANGED] Borders adjusted for upward point
            borderLeft: "2px solid #0ea5e9", borderTop: "2px solid #0ea5e9",
            borderRight: "none", borderBottom: "none"
        });
        bubble.appendChild(tail);
        const textSpan = document.createElement("span");
        textSpan.id = "ar-bubble-text";
        bubble.appendChild(textSpan);
        document.body.appendChild(bubble);
    }
    return bubble;
};

// [MODIFIED] DIALOG POSITION LOGIC
const showAdvancedDialog = (modelIndex, modelScene, clickSound) => {
    const bubble = getBubbleElement();
    const textSpan = document.getElementById("ar-bubble-text");
    const options = dialogData[modelIndex];
    const textToType = options[Math.floor(Math.random() * options.length)];

    if (activeBubble.typewriterTimer) clearInterval(activeBubble.typewriterTimer);
    if (activeBubble.timeoutTimer) clearTimeout(activeBubble.timeoutTimer);
    
    if (clickSound && !clickSound.isPlaying) {
        clickSound.setPlaybackRate(1.2); clickSound.play();
    }

    activeBubble.element = bubble;
    activeBubble.model = modelScene;
    
    // [CHANGED] Negative offset puts it BELOW the model
    activeBubble.offsetY = -1.5; 

    bubble.style.opacity = "1";
    textSpan.textContent = ""; 
    let i = 0;
    activeBubble.typewriterTimer = setInterval(() => {
        const char = textToType.charAt(i);
        textSpan.textContent += char;
        i++;
        if (i >= textToType.length) clearInterval(activeBubble.typewriterTimer);
    }, 30); 

    activeBubble.timeoutTimer = setTimeout(() => {
        bubble.style.opacity = "0"; activeBubble.model = null; 
    }, 4000);
};

const playSpecificAnimation = (modelData, type) => {
    const { mixer, actions, activeAction } = modelData.userData;
    const targetAction = actions[type];

    if (!targetAction) return;

    modelData.userData.targetIntensity = 4.0; 

    const idleAnim = actions.idle;
    if (activeAction === targetAction && targetAction.isRunning()) return;

    targetAction.reset();
    targetAction.setLoop(THREE.LoopOnce);
    targetAction.clampWhenFinished = true; 

    if (activeAction) activeAction.crossFadeTo(targetAction, 0.5, true);
    targetAction.play();
    modelData.userData.activeAction = targetAction;

    const onFinished = (e) => {
        if (e.action === targetAction) {
            mixer.removeEventListener('finished', onFinished);
            modelData.userData.targetIntensity = modelData.userData.baseIntensity; 

            if (idleAnim) {
                targetAction.crossFadeTo(idleAnim, 0.5, true);
                idleAnim.reset();
                idleAnim.play();
                modelData.userData.activeAction = idleAnim;
            }
        }
    };
    mixer.addEventListener('finished', onFinished);
};

const setupTapInteraction = (camera, models, clickSound, flashlight, ambientLight) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let tapTimer = null; let isPointerDown = false; let startX = 0; let startY = 0;

    const triggerInteraction = (clientX, clientY, interactionType) => {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        for (let i = 0; i < models.length; i++) {
            const modelGroup = models[i].scene;
            const modelData = models[i].userData;

            if (modelGroup.visible) {
                const intersects = raycaster.intersectObjects(modelGroup.children, true);
                if (intersects.length > 0) {
                    if (interactionType === 'single') {
                        showAdvancedDialog(i, modelGroup, clickSound);
                        flashlight.intensity = (flashlight.intensity > 0) ? 0 : 5.0;
                        if (i === 8) {
                            ambientLight.intensity = (flashlight.intensity > 0) ? 2.0 : 1.3;
                        }
                        modelData.currentIntensity = 8.0; 
                        modelData.targetIntensity = modelData.idleIntensity; 
                        playSpecificAnimation(models[i], 'action');
                    } else {
                        playSpecificAnimation(models[i], 'interact');
                    }
                    break; 
                }
            }
        }
    };

    const handleTap = (clientX, clientY) => {
        if (tapTimer === null) {
            tapTimer = setTimeout(() => {
                tapTimer = null; triggerInteraction(clientX, clientY, 'single');
            }, 300); 
        } else {
            clearTimeout(tapTimer); tapTimer = null; triggerInteraction(clientX, clientY, 'double');
        }
    };

    window.addEventListener('pointerdown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        isPointerDown = true; startX = e.clientX; startY = e.clientY;
    });
    window.addEventListener('pointerup', (e) => {
        if (!isPointerDown) return; isPointerDown = false;
        const diffX = Math.abs(e.clientX - startX); const diffY = Math.abs(e.clientY - startY);
        if (diffX < 5 && diffY < 5) handleTap(e.clientX, e.clientY);
    });
};

const enableZoomRotate = (camera, model) => {
  let isDragging = false; let prevPosition = { x: 0, y: 0 }; let initialPinchDistance = null; let initialScale = model.scene.scale.x; 
  const handleStart = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    if (e.touches && e.touches.length === 1) { isDragging = true; prevPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
    else if (e.touches && e.touches.length === 2) { isDragging = false; const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; initialPinchDistance = Math.sqrt(dx * dx + dy * dy); initialScale = model.scene.scale.x; }
    else if (e.type === "mousedown") { isDragging = true; prevPosition = { x: e.clientX, y: e.clientY }; }
  };
  const handleMove = (e) => {
    if (isDragging && (e.type === "mousemove" || (e.touches && e.touches.length === 1))) { const current = e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }; const delta = { x: current.x - prevPosition.x, y: current.y - prevPosition.y }; model.scene.rotation.y += delta.x * 0.01; model.scene.rotation.x += delta.y * 0.01; prevPosition = current; }
    else if (e.touches && e.touches.length === 2 && initialPinchDistance) { const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; const currentDistance = Math.sqrt(dx * dx + dy * dy); const scaleRatio = currentDistance / initialPinchDistance; let newScale = initialScale * scaleRatio; newScale = Math.min(Math.max(newScale, 0.05), 3.0); model.scene.scale.set(newScale, newScale, newScale); }
  };
  const handleEnd = () => { isDragging = false; initialPinchDistance = null; };
  window.addEventListener("mousedown", handleStart); window.addEventListener("mousemove", handleMove); window.addEventListener("mouseup", handleEnd); window.addEventListener("touchstart", handleStart, { passive: false }); window.addEventListener("touchmove", handleMove, { passive: false }); window.addEventListener("touchend", handleEnd);
  window.addEventListener("wheel", (e) => { let s = model.scene.scale.x; s += e.deltaY * -0.001; s = Math.min(Math.max(s, 0.05), 3.0); model.scene.scale.set(s, s, s); });
};

// Fact Button creates a box tracked by activeFactBox
const createFactButton = (anchorId, clickSound) => {
  const btn = document.createElement("button");
  btn.innerText = uiLabels[currentLanguage].factBtn;

  Object.assign(btn.style,{
    position:"absolute", bottom:"30px", left:"50%", transform:"translateX(-50%)",
    width: "70%", maxWidth: "350px", 
    padding:"14px 20px", fontSize:"16px", borderRadius:"30px", border:"none",
    background:"#0ea5e9", color:"#fff", fontWeight:"600", cursor:"pointer",
    display:"none", zIndex:"9999", boxShadow:"0 6px 18px rgba(0,0,0,0.3)",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" 
  });
  document.body.appendChild(btn);
  
  btn.addEventListener("click", ()=>{
    clickSound.setPlaybackRate(0.7); clickSound.play();
    
    // If THIS specific fact box is open, close it (toggle behavior)
    if(activeFactBox && activeFactBox.index === anchorId) {
        activeFactBox.element.remove();
        activeFactBox = null;
        return;
    }

    // If ANY OTHER fact box is open, close it first
    if(activeFactBox) {
        activeFactBox.element.remove();
        activeFactBox = null;
    }
    
    const factBox = document.createElement("div");
    Object.assign(factBox.style,{
      position:"absolute", bottom:"150px", left:"50%", transform:"translateX(-50%)",
      width:"88%", maxWidth:"420px", padding:"24px", borderRadius:"20px",
      background:"rgba(10,20,40,0.9)", color:"#e0f2fe", fontFamily:"Poppins, sans-serif",
      zIndex:"9998", boxShadow:"0 20px 50px rgba(0,0,0,0.6)",
      maxHeight: "50vh", overflowY: "auto"
    });

    // 1. Add Narration Text (Description)
    const desc = document.createElement("div");
    desc.innerHTML = narrationText[currentLanguage][anchorId];
    desc.style.marginBottom = "15px";
    desc.style.paddingBottom = "15px";
    desc.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
    factBox.appendChild(desc);

    // 2. Add Fact List
    const ul=document.createElement("ul");
    factData[anchorId].forEach(f=>{ 
        const li=document.createElement("li"); 
        li.innerText=f; 
        li.style.marginBottom="8px"; 
        ul.appendChild(li); 
    });
    factBox.appendChild(ul); 
    
    // Close on click outside (optional but good UX)
    factBox.addEventListener("click", () => { 
        factBox.remove(); 
        activeFactBox = null; 
    });

    document.body.appendChild(factBox);
    
    // REGISTER THIS BOX AS ACTIVE
    activeFactBox = { element: factBox, index: anchorId };
  });
  return btn;
};

const createDeepSeaParticles = (scene) => {
    const geometry = new THREE.BufferGeometry(); const count = 500; const positions = new Float32Array(count * 3);
    for(let i=0; i<count * 3; i++) positions[i] = (Math.random() - 0.5) * 15; 
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x44aaee, size: 0.03, transparent: true, opacity: 0.6, sizeAttenuation: true });
    const particles = new THREE.Points(geometry, material); scene.add(particles); return particles;
};

const createBubbles = (scene) => {
    const bubbles = []; const geometry = new THREE.SphereGeometry(0.08, 16, 16); 
    const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1, transmission: 0.9, transparent: true, opacity: 0.6 });
    for(let i = 0; i < 20; i++) {
        const bubble = new THREE.Mesh(geometry, material);
        bubble.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
        bubble.userData = { speed: 0.01 + Math.random() * 0.02, wobble: Math.random() * Math.PI * 2 };
        scene.add(bubble); bubbles.push(bubble);
    }
    return bubbles;
};

const createPersistentInstruction = () => {
  const instructionBox = document.createElement("div");
  Object.assign(instructionBox.style, {
    position: "absolute", top: "80px", right: "10px", width: "180px", padding: "12px", borderRadius: "12px",
    background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", fontFamily: "Poppins, sans-serif", fontSize: "12px",
    lineHeight: "1.4", zIndex: "9998", backdropFilter: "blur(4px)", border: "1px solid rgba(255, 255, 255, 0.2)", pointerEvents: "none" 
  });
  
  const txt = uiLabels[currentLanguage];
  
  instructionBox.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold; color: #0ea5e9;">${txt.instructionTitle}</div>
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;"><span>${txt.tap1}</span><span style="opacity:0.8">${txt.tap1Action}</span></div>
    <div style="display:flex; align-items:center; gap:8px;"><span>${txt.tap2}</span><span style="opacity:0.8">${txt.tap2Action}</span></div>
    <div style="display:flex; align-items:center; gap:8px; margin-top:4px; font-size:11px; opacity:0.7"><span>${txt.gestures}</span></div>
  `;
  document.body.appendChild(instructionBox);
};

// -----------------------------------------------------------------------------
// 6. MAIN EXECUTION
// -----------------------------------------------------------------------------

const applyFullScreenStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        html, body {
            margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; position: fixed;
        }
        canvas {
            width: 100% !important; height: 100% !important; display: block;
        }
        /* [NEW] Glassmorphism Back Button Style */
        .custom-back-btn {
            position: fixed;
            top: 24px;
            left: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(0, 255, 255, 0.5);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 12000;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        .custom-back-btn:hover {
            background: rgba(0, 255, 255, 0.2);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
};

document.addEventListener("DOMContentLoaded", async()=>{
  applyFullScreenStyles();

  const mindarThree = initializeMindAR();
  const {renderer, scene, camera}=mindarThree;
  
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2; 
  renderer.clock=new THREE.Clock();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0x406080, 1.3); 
  const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.0); 
  directionalLight.position.set(1,2,3);
  scene.add(ambientLight,directionalLight);

  const flashlight = new THREE.SpotLight(0xffffff, 0); 
  flashlight.position.set(0, 0, 0);
  flashlight.target.position.set(0, 0, -1);
  flashlight.angle = Math.PI / 6;
  flashlight.penumbra = 0.5;
  flashlight.castShadow = true;
  camera.add(flashlight);
  camera.add(flashlight.target);

  const particles = createDeepSeaParticles(scene);
  const bubbles = createBubbles(scene);

  const models = await Promise.all(modelNames.map((_,i)=>loadModel(`../assets/models/${i+1}.glb`, i)));

  const globalBGM = await loadGlobalAudio('../coding/bg-audio.mp3', camera);
  
  const audioFolder = 'english';
  const narrationPaths = modelNames.map((_,i)=>`../assets/audio/${audioFolder}/${i+1}.mp3`);

  const narrationAudios = await Promise.all(narrationPaths.map(p=>loadAndConfigureAudio(p,camera)));
  const clickSound = await loadAndConfigureAudio('../coding/button.mp3', camera);

  setupTapInteraction(camera, models, clickSound, flashlight, ambientLight); 

  let isGlobalMuted = false;

  const mixers = models.map((model,i)=>{
    const anchor=mindarThree.addAnchor(i);
    anchor.group.add(model.scene);
    model.scene.visible=false;

    const factBtn=createFactButton(i, clickSound);

    const narrationBtn = document.createElement("button");
    narrationBtn.innerText = uiLabels[currentLanguage].audioBtn;

    Object.assign(narrationBtn.style,{
      position:"absolute", bottom:"85px", left:"50%", transform:"translateX(-50%)", 
      width: "70%", maxWidth: "350px", 
      padding:"14px 20px", fontSize:"16px", borderRadius:"30px", border:"none",
      background:"#14b8a6", color:"#fff", fontWeight:"600", cursor:"pointer",
      display:"none", zIndex:"9999", boxShadow:"0 6px 18px rgba(0,0,0,0.3)",
      alignItems: "center", gap: "8px", justifyContent: "center"
    });
    document.body.appendChild(narrationBtn);

    narrationBtn.addEventListener("click", ()=>{
      clickSound.setPlaybackRate(0.7); clickSound.play();

      if(narrationAudios[i].isPlaying) {
          // PAUSE NARRATION
          narrationAudios[i].pause();
          narrationBtn.style.background = "#14b8a6"; 
          narrationBtn.innerText = uiLabels[currentLanguage].audioBtn; 
          
          if (!isGlobalMuted && !globalBGM.isPlaying) globalBGM.play();
      }
      else {
          // PLAY NARRATION
          narrationAudios.forEach(a => { if(a.isPlaying) a.stop(); });
          
          if (globalBGM.isPlaying) globalBGM.pause();

          narrationAudios[i].play();
          narrationBtn.style.background = "#ef4444"; 
          narrationBtn.innerText = uiLabels[currentLanguage].stopBtn;
      }
    });

    const mixer = new THREE.AnimationMixer(model.scene);
    model.userData.mixer = mixer;
    model.userData.actions = {};

    let idleClip = model.animations.find(c => c.name.match(/idle/i));
    let actionClip = model.animations.find(c => c.name.match(/action/i));
    let interactClip = model.animations.find(c => c.name.match(/interact/i));
    if (!idleClip && model.animations.length > 0) idleClip = model.animations[0];

    if (idleClip) {
        const action = mixer.clipAction(idleClip);
        action.play();
        model.userData.actions.idle = action;
        model.userData.activeAction = action; 
    }
    if (actionClip) model.userData.actions.action = mixer.clipAction(actionClip);
    if (interactClip) model.userData.actions.interact = mixer.clipAction(interactClip);

    anchor.onTargetFound=()=>{
      model.scene.visible=true;
      factBtn.style.display="block";
      narrationBtn.style.display="flex"; 
      
      if(!isGlobalMuted && !globalBGM.isPlaying && !narrationAudios[i].isPlaying) {
          globalBGM.play();
      }
    };
    anchor.onTargetLost=()=>{
      model.scene.visible=false;
      factBtn.style.display="none";
      narrationBtn.style.display="none";
      
      narrationBtn.innerText = uiLabels[currentLanguage].audioBtn;
      narrationBtn.style.background = "#14b8a6";
      
      // [FIX] CLOSE FACT BOX IF OPEN
      if(activeFactBox && activeFactBox.index === i) {
          activeFactBox.element.remove();
          activeFactBox = null;
      }

      flashlight.intensity = 0;
      ambientLight.intensity = 1.3; 

      if (activeBubble.model === model.scene) {
          activeBubble.element.style.opacity = "0";
          activeBubble.model = null;
      }
      
      if(narrationAudios[i].isPlaying) narrationAudios[i].pause();
    };

    enableZoomRotate(camera, model);
    return mixer;
  });

  const audioBtn=document.createElement("div");
  audioBtn.innerText='🔇';
  Object.assign(audioBtn.style,{ position:'absolute', top:'10px', right:'10px', fontSize:'40px', cursor:'pointer', zIndex:'9999' }); 
  document.body.appendChild(audioBtn);
  
  audioBtn.addEventListener("click",()=>{
    isGlobalMuted = !isGlobalMuted;
    
    if (isGlobalMuted) {
        if (globalBGM.isPlaying) globalBGM.pause();
        audioBtn.innerText = '🔇';
    } else {
        const anyNarrationPlaying = narrationAudios.some(a => a.isPlaying);
        if (!anyNarrationPlaying) globalBGM.play();
        audioBtn.innerText = '🔊';
    }
  });

  createPersistentInstruction();

  const backBtn = document.createElement("a");
  backBtn.className = "custom-back-btn"; // Uses the CSS class defined above
  backBtn.href = uiLabels[currentLanguage].backLink;
  backBtn.title = "Back";
  backBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  `;
  document.body.appendChild(backBtn);

  const tempVector = new THREE.Vector3();

  await mindarThree.start();
  renderer.setAnimationLoop(()=>{
    const delta=renderer.clock.getDelta();
    
    if(particles) { particles.rotation.y += delta * 0.05; particles.position.y += Math.sin(renderer.clock.elapsedTime) * 0.002; }
    if(bubbles) {
        bubbles.forEach(bubble => {
            bubble.position.y += bubble.userData.speed;
            bubble.position.x += Math.sin(renderer.clock.elapsedTime + bubble.userData.wobble) * 0.002;
            if(bubble.position.y > 4) { bubble.position.y = -3; bubble.position.x = (Math.random() - 0.5) * 5; }
        });
    }

    if (activeBubble.model && activeBubble.model.visible) {
        activeBubble.model.updateMatrixWorld();
        tempVector.setFromMatrixPosition(activeBubble.model.matrixWorld);
        tempVector.y += activeBubble.offsetY; 
        tempVector.project(camera);
        const x = (tempVector.x * .5 + .5) * window.innerWidth;
        const y = (-(tempVector.y * .5) + .5) * window.innerHeight;
        
        const bubbleWidthHalf = 110; 
        const margin = 10;
        const clampedX = Math.max(bubbleWidthHalf + margin, Math.min(window.innerWidth - bubbleWidthHalf - margin, x));

        activeBubble.element.style.left = `${clampedX}px`;
        activeBubble.element.style.top = `${y}px`;
    } else if (activeBubble.element && activeBubble.element.style.opacity === "1" && (!activeBubble.model || !activeBubble.model.visible)) {
        activeBubble.element.style.opacity = "0";
    }

    models.forEach((model, i) => {
        mixers[i].update(delta);
        
        if (model.userData.emissiveMeshes && model.userData.emissiveMeshes.length > 0) {
            const diff = model.userData.targetIntensity - model.userData.currentIntensity;
            if (Math.abs(diff) > 0.01) {
                model.userData.currentIntensity += diff * delta * 5.0; 
                model.userData.emissiveMeshes.forEach(mesh => {
                    mesh.material.emissiveIntensity = model.userData.currentIntensity;
                });
            }
        }
    });

    renderer.render(scene,camera);
  });
});