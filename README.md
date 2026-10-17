# Barbería: gestión de turnos (RA1)

Aplicación web responsiva hecha con React y Vite. Implementa lo diseñado en el informe RA1:
arquitectura en capas, cola (FIFO) para la atención del día y pila (LIFO) para el historial.

## Cómo ejecutarla en Visual Studio Code

1. Instala Node.js (versión 18 o superior) desde https://nodejs.org
2. Abre esta carpeta en VS Code: Archivo > Abrir carpeta.
3. Abre la terminal (Ctrl + ñ) y ejecuta:

```bash
npm install
npm run dev
```

4. Abre en el navegador la dirección que aparece (normalmente http://localhost:5173).

## Estructura (capas del informe)

```
src/
  App.jsx                    Capa de presentación: pantallas y formularios
  App.css                    Estilos
  services/turnoService.js   Capa lógica: reglas y algoritmos (7.1 a 7.5)
  structures/Cola.js         Cola (FIFO)
  structures/Pila.js         Pila (LIFO)
  data/repositorio.js        Capa de datos (localStorage)
```

## Qué hace cada rol

- **Cliente:** reserva turnos, busca y cancela los suyos y ve su posición en la cola de hoy.
- **Barbero:** ve la cola del día, atiende al siguiente y consulta el historial de un cliente.
- **Administrador:** agrega y elimina servicios y precios.

## Notas

- Los datos se guardan en el navegador (localStorage), sin servidor.
  Para conectar Node.js + MySQL solo hay que reemplazar `cargarDatos` y `guardarDatos` en `data/repositorio.js`.
- Los roles se eligen desde los botones de arriba; no hay inicio de sesión real todavía (RF01 y RF02 quedan como mejora).
- Para subirlo a GitHub: `git init`, `git add .`, `git commit -m "Primera versión"` y luego conecta tu repositorio.
