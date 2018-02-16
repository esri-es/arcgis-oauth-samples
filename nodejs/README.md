# Obtener y renovar un token de ArcGIS con NodeJS

Para entender el proceso que sigue esta aplicación puedes ver esta explicación de 5 minutos:

[![Pantallazo de: "How to" autenticar en ArcGIS usando la API de JavaScript & oAuth](https://i.ytimg.com/vi/3lWwWg_PYS4/hqdefault.jpg)](https://www.youtube.com/watch?v=3lWwWg_PYS4)

## How to

> **Requisitos previos:**
> Para poder seguir estos pasos necesitarás tener instalado: [git](https://git-scm.com/downloads) y [nodejs](https://nodejs.org/en/download/).

**Paso 1:** Abre tu terminal<sup>[1](#1)</sup> y escribe:

`git clone git@github.com:esri-es/arcgis-oauth-samples.git && cd arcgis-oauth-samples/nodejs && npm install`

**Paso 2:** Renombra el fichero [config_sample.json](https://github.com/esri-es/arcgis-oauth-samples/blob/master/config_sample.json) del directorio raíz a `config.json`.

**Paso 3:** Identifícate en [developers.arcgis.com](https://developers.arcgis.com/sign-in/) (o [créate una cuenta gratuita](https://developers.arcgis.com/sign-up) si no tienes una)

**Paso 4:** Accede a [developers.arcgis.com/applications/new/](https://developers.arcgis.com/applications/new/) y crea una aplicación

**Paso 5:** A la derecha podrás ver los valores de las variables `Client ID` y `Client Secret`, cópialos en tu nuevo fichero `config.json`

**Paso 6:** Haz clic en la pestaña `Authentication`, haz scroll y en la sección `Redirect URIs` añade: `http://localhost:3000/` (y recuerda pulsar el botón añadir)

**Paso 7:** Vuelve a la terminar y escribe: `node app.js`

**Paso 8:** Abre tu navegador y escribe: `http://localhost:3000/`, y ya estarás listo para probar la aplicación



<a id="1">Nota 1</a>: [Git Bash](https://www.youtube.com/watch?v=rWboGsc6CqI) (Windows), [Terminal](https://www.youtube.com/watch?v=zw7Nd67_aFw) (Mac), [Terminal](https://www.youtube.com/watch?v=7Kvgbu61jFg) (Linux)

## Dudas

Si tienes alguna duda no dudes en [abrir un issue](https://github.com/esri-es/arcgis-oauth-samples/issues/new) en el repositorio y preguntarla.
