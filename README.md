# TOPSET-SW

Landing page de un estudio de software, construida con React y Vite. Presenta una bienvenida interactiva con un botón de despegue, seguida de un portafolio de seis proyectos, información del equipo y enlaces de contacto.

El proyecto explora transiciones CSS, tipografía adaptable y composición de interfaces. Es una aplicación frontend: Node.js ejecuta las herramientas de desarrollo y compilación; no hay servidor de negocio ni base de datos.

## Demo local

Después de iniciar el servidor, abrí [la demo local](http://127.0.0.1:5173). Si ese puerto está ocupado, usá la dirección que indique Vite.

1. Pasá el cursor sobre **Take off**, o enfocá el botón con Tab.
2. Hacé clic, tocá el botón o activalo con el teclado para entrar.
3. Recorré Proyectos, Sobre nosotros y Contacto.
4. Al refrescar vuelve a aparecer la bienvenida. Si la URL contiene un hash, su sección se abre después del despegue.

No hay una demo pública ni capturas incluidas actualmente.

## Tecnologías

- React 19 y JavaScript con JSX.
- Vite 7 para desarrollo, carga diferida y compilación.
- Tailwind CSS 3 y CSS propio para composición, estilos y animaciones.
- Vitest, Testing Library y jsdom para pruebas de comportamiento.
- ESLint y Prettier para análisis estático y formato.

## Instalación

Requisitos: Node.js 22.13 o posterior de la rama 22, o Node.js 24 o superior, con npm incluido. ESLint determina este mínimo de desarrollo.

Desde la carpeta del proyecto:

```sh
npm ci
npm run dev
```

`npm ci` instala las versiones registradas en `package-lock.json`. No se necesitan bases de datos, credenciales ni servicios locales adicionales.

En PowerShell, si la política impide ejecutar `npm.ps1`, usá `npm.cmd`:

```powershell
npm.cmd ci
npm.cmd run dev
```

También podés ejecutar `./dev.cmd` en Windows después de instalar las dependencias. Este acceso directo usa el npm instalado en el sistema. Si acabás de instalar Node, cerrá y reabrí el editor para actualizar el PATH.

## Comandos

| Comando                | Propósito                                             |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con actualización automática.  |
| `npm run build`        | Genera la versión estática en `dist/`.                |
| `npm run preview`      | Sirve el build para una comprobación local.           |
| `npm test`             | Ejecuta las pruebas una vez.                          |
| `npm run test:watch`   | Ejecuta las pruebas en modo observación.              |
| `npm run lint`         | Analiza JavaScript, JSX y reglas de hooks.            |
| `npm run format:check` | Comprueba formato sin modificar archivos.             |
| `npm run format`       | Aplica Prettier.                                      |
| `npm run check`        | Ejecuta lint, comprobación de formato, tests y build. |

Para previsualizar la versión compilada:

```sh
npm run build
npm run preview
```

El contenido de `dist/` puede servirse como archivos estáticos. La configuración actual utiliza rutas de assets desde la raíz del dominio; publicar en un subdirectorio requiere revisar esas rutas y la opción `base` de Vite.

## Organización

```text
public/images/projects/      Fotografías WebP y créditos
src/
  main.jsx                   Entrada de React y estilos iniciales
  App.jsx                    Composición de bienvenida y home
  components/
    layout/                  Encabezado y pie de página
    ui/                      Botones reutilizables y sus estilos
    projects/                Tarjetas destacadas, demos y estilos
  pages/                     Welcome y Home
  sections/                  Hero, proyectos, nosotros y contacto
  hooks/                     Coordinación de la transición de entrada
  utils/                     Carga compartida de módulos con reintento
  data/                      Catálogo de proyectos y navegación
  styles/                    Estilos globales y de páginas
```

Los tests viven junto al módulo que verifican. Los componentes usan PascalCase; funciones, hooks y archivos de datos usan camelCase. Las configuraciones de Vite, Tailwind, PostCSS, ESLint y Prettier permanecen en la raíz.

## Decisiones técnicas

- **Carga bajo demanda:** el home se importa al mostrar intención de entrar o al activar el botón. La precarga y el clic comparten la misma promesa; una carga fallida libera la referencia para permitir otro intento.
- **Entrada coordinada:** el home aparece cuando terminan la carga y la animación. Con movimiento reducido no se espera el final de una animación deshabilitada.
- **Navegación por anclas:** una landing de una sola página no necesita un router. El hash se conserva durante la bienvenida y se resuelve al montar el home.
- **Separación de responsabilidades:** los datos del catálogo están separados de las tarjetas y la lógica de entrada está separada de la presentación.
- **CSS conservado:** los estilos se organizan por responsabilidad y mantienen los valores visuales existentes. Los estilos del home se cargan con su módulo.
- **Recursos visuales:** las tres fotografías de proyectos son WebP locales con dimensiones declaradas y carga diferida. Las fuentes, los símbolos y dos imágenes del sitio siguen usando servicios externos.
- **Sin estado global ni capa de API:** el alcance actual no justifica esas dependencias.

FlyingButton es una implementación propia compatible con la API usada por esta landing. DepthButton conserva la atribución del diseño de ZacharyCrespin en Uiverse.io dentro de su CSS.

## Variables de entorno

Actualmente no se requiere ninguna. `.env.example` documenta esta decisión y no contiene credenciales.

Los textos y enlaces públicos viven en componentes o archivos de datos; no son secretos. Si se agrega una integración en el futuro, las variables `VITE_*` se incorporan al código público del navegador y no deben contener claves privadas.

## Pruebas y límites

Las pruebas cubren la bienvenida al recargar, entrada después de la animación, movimiento reducido, foco, destinos por hash, seis tarjetas, bloqueo de clics durante el despegue, filtrado de eventos de animación y carga compartida con reintento.

jsdom no dibuja la página: estas pruebas no sustituyen una revisión visual en escritorio y móvil, ni miden fluidez, tiempos de red o Core Web Vitals.

Pendientes conservados durante la refactorización:

- Los enlaces de casos destacados usan `#`; los enlaces sociales son genéricos.
- La navegación marca Proyectos como activo de forma fija.
- Hay utilidades heredadas como `p-4.5` y `hover:scale-102` sin definición en la configuración actual.
- Las variantes de marca, textos comerciales, métricas y copyright necesitan validación editorial antes de publicar.
- Falta incorporar una demo pública o capturas reales.

## Recursos y derechos

Las fotografías son ilustrativas, no evidencia de entregas a clientes. Sus fuentes figuran en [los créditos de imágenes](public/images/projects/CREDITS.md). Las cuatro tarjetas conceptuales se identifican como DEMO.

El código se mantiene sin licencia de reutilización por decisión del propietario (`UNLICENSED` en `package.json`). No se incluye una licencia abierta. Los recursos y dependencias de terceros conservan sus propias condiciones.
