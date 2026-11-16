# Bella & Sasha — Álbum 3D

Una experiencia web inmersiva inspirada en una habitación interactiva donde Bella y Sasha cobran vida en 3D. La aplicación combina navegación espacial, música ambiental, un álbum virtual y una interfaz hecha para escritorio y dispositivos táctiles.

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-87.7%25-F7DF1E?style=for-the-badge&logo=javascript" alt="JavaScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-3D-111827?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
</p>

## 🌐 Demo

- Proyecto en producción: https://3-d-room-gules.vercel.app
- Repositorio: https://github.com/jandresvr92/3D-room

## ✨ Descripción

Este proyecto recrea una escena doméstica con elementos decorativos, una televisión, una música de fondo y dos perritas como protagonistas. La experiencia permite:

- explorar una habitación en 3D
- acercar la cámara a Bella o Sasha
- interactuar con el espacio para cambiar la vista
- abrir un álbum virtual al activar la televisión
- disfrutar de un entorno con audio y narrativa visual

## 🧩 Funcionalidades principales

- Escena 3D interactiva con modelos GLB
- Cámara dinámica y navegación libre
- Enfoque selectivo en Bella y Sasha
- Álbum/galería que se activa desde la televisión
- Música de fondo con reproductor integrado
- Interfaz responsive para móvil y escritorio
- Optimización de activos 3D para mejor rendimiento

## 🛠️ Stack tecnológico

- React 19
- React DOM
- Three.js
- @react-three/fiber
- @react-three/drei
- Vite
- CSS
- glTF Transform

## 📁 Estructura del proyecto

```text
3D-room/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/
│   ├── audio/
│   │   └── lofi.mp3
│   └── models/
│       ├── bella.glb
│       └── sasha.glb
├── src/
│   ├── App.jsx
│   ├── input.js
│   ├── main.jsx
│   ├── index.css
│   ├── assets/
│   ├── scene/
│   │   ├── Bella.jsx
│   │   ├── Sasha.jsx
│   │   ├── Scene.jsx
│   │   ├── Tv.jsx
│   │   ├── Floor.jsx
│   │   ├── Sofa.jsx
│   │   ├── Walls.jsx
│   │   ├── layout.js
│   │   ├── nav.js
│   │   └── clay.js
│   └── ui/
│       ├── Gallery.jsx
│       └── MusicPlayer.jsx
└── .gitignore
```

### División por capas

- `src/scene/`: lógica y componentes 3D de la habitación y personajes.
- `src/ui/`: elementos visuales y de interfaz sobre la escena, como el álbum y el reproductor.
- `public/models/`: activos 3D para Bella y Sasha.
- `public/audio/`: recursos de audio.
- `src/input.js`: estado compartido para controles de cámara y detección táctil.

## ▶️ Requisitos

- Node.js 18 o superior
- npm o pnpm
- Git

## 🚀 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/jandresvr92/3D-room.git
cd 3D-room
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:

```bash
npm run dev
```

4. Abre la URL local mostrada por Vite en tu navegador.

## 🧪 Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run optimize:models
```

### Descripción de scripts

- `npm run dev`: levanta el servidor de desarrollo.
- `npm run build`: genera una compilación de producción.
- `npm run preview`: sirve la build localmente para revisión.
- `npm run optimize:models`: optimiza los modelos GLB para mejorar rendimiento y peso.

## 🎮 Controles

### Escritorio

- Haz clic sobre el suelo para explorar la escena.
- Haz doble clic sobre una perrita para acercar la cámara.
- Haz clic en la televisión para abrir el álbum.
- Usa los botones de Bella y Sasha para enfocar el personaje.

### Móvil / tablet

- Toca la pantalla para interactuar.
- Usa pellizco para hacer zoom.
- Toca la televisión para abrir la galería.

## 📦 Compilación para producción

```bash
npm run build
```

La salida se generará en la carpeta `dist/`, lista para despliegue.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar:

1. Haz un fork del proyecto.
2. Crea una rama para tu cambio.
3. Realiza tus modificaciones con mensajes de commit claros.
4. Abre un Pull Request describiendo el problema y la solución.

## 📝 Notas importantes

- El proyecto usa modelos 3D localizados en `public/models/`.
- La música y los recursos multimedia deben revisarse según sus licencias antes de reutilizarse o redistribuirse.
- Aún no aparece una licencia clara en el repositorio; si el proyecto va a compartirse públicamente, es recomendable definir una licencia de código abierta.

## 📌 Estado del proyecto

Este repositorio está orientado a una experiencia visual y artística interactiva, con enfoque en demostración y presentación web. Es ideal para aprendizaje, prototipos creativos y showcase de diseño 3D con React y Three.js.

---

Si quieres, puedo dejarte una última versión más elegante con badges, imagen destacada y un estilo aún más “GitHub-ready” para publicar el repositorio como proyecto profesional.
