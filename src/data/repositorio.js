// Capa de datos: repositorio sobre localStorage.
// Para pasar a backend (Node + MySQL) solo se reemplazan estas dos funciones.
const CLAVE = 'barberia-turnos-v1';

const datosIniciales = {
  turnos: [],
  servicios: [
    { id: 1, nombre: 'Corte clásico', precio: 15 },
    { id: 2, nombre: 'Perfilado de barba', precio: 10 },
    { id: 3, nombre: 'Corte + barba', precio: 22 },
  ],
  barberos: ['Luis Torres', 'Marco Díaz'],
};

export function cargarDatos() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : structuredClone(datosIniciales);
  } catch {
    return structuredClone(datosIniciales);
  }
}

export function guardarDatos(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch {
    // Si el almacenamiento falla, la app sigue funcionando en memoria.
  }
}
