# Bella & Sasha — Álbum 3D

Experiencia web interactiva que presenta una habitación en 3D protagonizada por Bella y Sasha. Explora la escena, enfoca a cada perrita y abre el álbum desde la televisión. Incluye música de fondo y controles adaptados a pantallas táctiles.

**Demo:** [3-d-room-gules.vercel.app](https://3-d-room-gules.vercel.app)

## Funcionalidades

- Escena 3D interactiva con modelos de Bella y Sasha.
- Cámara que permite explorar el espacio y enfocar a las perritas.
- Álbum que se abre al interactuar con la televisión.
- Reproductor de música integrado.
- Interacciones y mensajes de ayuda adaptados a dispositivos táctiles y de escritorio.

## Tecnologías

- **React 19** y **React DOM** para la interfaz.
- **Three.js** para gráficos 3D.
- **React Three Fiber** para integrar Three.js con React.
- **Drei** para utilidades y componentes de React Three Fiber.
- **Vite** para desarrollo local y compilación.
- **CSS** para estilos.
- **glTF Transform** como herramienta de desarrollo para optimizar modelos 3D.

## Requisitos

- Node.js y npm instalados.
- Git para clonar el repositorio.

## Instalación y ejecución

1. Clona el repositorio y entra en su directorio:

   ```bash
   git clone https://github.com/jandresvr92/3D-room.git
   cd 3D-room
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre en el navegador la URL local que indique Vite en la terminal.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de producción para revisarla. |
| `npm run optimize:models` | Ejecuta el proceso de optimización de modelos 3D definido en `package.json`. |

## Organización del proyecto

```text
.
├── index.html              # Documento HTML y punto de entrada de la aplicación
├── package.json            # Dependencias y comandos npm
├── vite.config.js           # Configuración de Vite y React
├── public/
│   ├── audio/              # Música utilizada por la aplicación
│   └── models/             # Modelos 3D en formato GLB
└── src/
    ├── App.jsx             # Composición principal, interfaz y estado de la aplicación
    ├── input.js            # Detección táctil y estado compartido de la vista
    ├── main.jsx            # Montaje de React
    ├── index.css            # Estilos globales y de la interfaz
    ├── assets/             # Recursos importados desde el código fuente
    ├── scene/              # Escena 3D y sus componentes
    └── ui/                 # Componentes de interfaz, como galería y reproductor
```

### Carpetas principales

- `src/scene/`: componentes y utilidades que construyen la habitación y sus elementos 3D.
- `src/ui/`: interfaz HTML superpuesta a la escena, incluida la galería y el reproductor.
- `public/models/`: modelos `.glb` cargados como recursos estáticos.
- `public/audio/`: archivo de audio de la experiencia.

## Controles

- **Escritorio:** haz clic en el suelo para que Sasha pasee; haz doble clic en una perrita para acercar la cámara; haz clic en la televisión para abrir el álbum.
- **Móvil o tablet:** toca el suelo para pasear a Sasha; toca la televisión para abrir el álbum; pellizca la pantalla para hacer zoom.
- Usa los botones de Bella y Sasha para enfocar a cada una. El botón de restablecer vuelve a la vista inicial.

## Compilación

Para crear la versión de producción:

```bash
npm run build
```

Los archivos listos para desplegar se generan en `dist/`. Para probar esa compilación localmente:

```bash
npm run preview
```

## Contribuciones

Las contribuciones son bienvenidas. Para proponer un cambio, abre un *issue* para conversar sobre la idea o envía un *pull request* con una descripción clara de los cambios y cómo los verificaste.

## Licencias y atribuciones

Antes de reutilizar o redistribuir los modelos 3D, la música, las imágenes u otros recursos, verifica sus licencias y añade aquí las atribuciones correspondientes. La licencia del código del repositorio debe indicarse explícitamente en el proyecto; no asumas que los recursos multimedia tienen la misma licencia que el código.
