// Capa lógica: reglas de negocio y algoritmos del sistema.
// Cada función recibe los datos actuales y devuelve { ok, mensaje, data? }.
import { Cola } from '../structures/Cola.js';
import { Pila } from '../structures/Pila.js';

export const hoy = () => new Date().toISOString().slice(0, 10);

// Algoritmo 7.2: validar disponibilidad de horario (O(n))
export function horarioDisponible(turnos, barbero, fecha, hora) {
  return !turnos.some(
    (t) =>
      t.barbero === barbero &&
      t.fecha === fecha &&
      t.hora === hora &&
      t.estado === 'registrada'
  );
}

// Algoritmo 7.1: registrar turno
export function registrarTurno(data, { cliente, servicio, barbero, fecha, hora }) {
  const campos = [cliente, servicio, barbero, fecha, hora];
  if (!campos.every((c) => c && c.trim())) {
    return { ok: false, mensaje: 'Error: datos incompletos' };
  }
  if (!horarioDisponible(data.turnos, barbero, fecha, hora)) {
    return { ok: false, mensaje: 'Error: el horario no está disponible' };
  }
  const id = data.turnos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const turno = { id, cliente: cliente.trim(), servicio, barbero, fecha, hora, estado: 'registrada' };
  return {
    ok: true,
    mensaje: 'Turno registrado correctamente',
    data: { ...data, turnos: [...data.turnos, turno] },
  };
}

// Cola de atención del día: se encola en orden de registro (FIFO)
export function construirCola(turnos, fecha) {
  const cola = new Cola();
  turnos
    .filter((t) => t.estado === 'registrada' && t.fecha === fecha)
    .forEach((t) => cola.encolar(t));
  return cola;
}

// Algoritmo 7.3: atender al siguiente cliente
export function atenderSiguiente(data, fecha) {
  const cola = construirCola(data.turnos, fecha);
  if (cola.estaVacia()) return { ok: false, mensaje: 'No hay clientes en espera' };
  const siguiente = cola.desencolar();
  const turnos = data.turnos.map((t) =>
    t.id === siguiente.id ? { ...t, estado: 'atendida', atendidaEn: Date.now() } : t
  );
  return { ok: true, mensaje: `Atención registrada: ${siguiente.cliente}`, data: { ...data, turnos } };
}

// Algoritmo 7.4: cancelar turno (búsqueda directa con Map)
export function cancelarTurno(data, id) {
  const turnosPorId = new Map(data.turnos.map((t) => [t.id, t]));
  const turno = turnosPorId.get(id);
  if (!turno) return { ok: false, mensaje: 'Error: turno no encontrado' };
  if (turno.estado === 'atendida') {
    return { ok: false, mensaje: 'Error: no se puede cancelar un turno ya atendido' };
  }
  const turnos = data.turnos.map((t) => (t.id === id ? { ...t, estado: 'cancelada' } : t));
  return { ok: true, mensaje: 'Turno cancelado correctamente', data: { ...data, turnos } };
}

// Algoritmo 7.5: historial con pila (la atención más reciente sale primero)
export function construirHistorial(turnos, cliente) {
  const pila = new Pila();
  turnos
    .filter(
      (t) =>
        t.estado === 'atendida' &&
        t.cliente.toLowerCase().includes(cliente.trim().toLowerCase())
    )
    .sort((a, b) => a.atendidaEn - b.atendidaEn)
    .forEach((t) => pila.apilar(t));
  return pila.toArray();
}

// Administración de servicios (CRUD)
export function agregarServicio(data, nombre, precio) {
  const valor = Number(precio);
  if (!nombre.trim()) return { ok: false, mensaje: 'Error: ingresa el nombre del servicio' };
  if (!(valor > 0)) return { ok: false, mensaje: 'Error: el precio debe ser un número positivo' };
  const id = data.servicios.reduce((max, s) => Math.max(max, s.id), 0) + 1;
  const servicios = [...data.servicios, { id, nombre: nombre.trim(), precio: valor }];
  return { ok: true, mensaje: 'Servicio agregado', data: { ...data, servicios } };
}

export function eliminarServicio(data, id) {
  const servicios = data.servicios.filter((s) => s.id !== id);
  return { ok: true, mensaje: 'Servicio eliminado', data: { ...data, servicios } };
}
