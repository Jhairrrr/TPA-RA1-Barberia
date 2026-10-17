// Capa de presentación: pantallas y formularios (React).
import { useState } from 'react';
import { cargarDatos, guardarDatos } from './data/repositorio.js';
import {
  hoy,
  registrarTurno,
  cancelarTurno,
  atenderSiguiente,
  construirCola,
  construirHistorial,
  agregarServicio,
  eliminarServicio,
} from './services/turnoService.js';

const ROLES = ['Cliente', 'Barbero', 'Administrador'];

export default function App() {
  const [data, setData] = useState(cargarDatos);
  const [rol, setRol] = useState('Cliente');
  const [aviso, setAviso] = useState(null);

  // Ejecuta una operación de la capa lógica y guarda el resultado.
  function ejecutar(resultado) {
    setAviso({ ok: resultado.ok, texto: resultado.mensaje });
    if (resultado.ok) {
      setData(resultado.data);
      guardarDatos(resultado.data);
    }
    return resultado.ok;
  }

  return (
    <div className="app">
      <header className="cabecera">
        <h1>Barbería</h1>
        <p>Reserva tu turno y sigue la cola de atención del día.</p>
        <nav className="roles" aria-label="Rol de usuario">
          {ROLES.map((r) => (
            <button
              key={r}
              className={r === rol ? 'activo' : ''}
              onClick={() => {
                setRol(r);
                setAviso(null);
              }}
            >
              {r}
            </button>
          ))}
        </nav>
      </header>
      <div className="poste" aria-hidden="true" />

      <main>
        {aviso && (
          <p className={`aviso ${aviso.ok ? 'ok' : 'error'}`} role="status">
            {aviso.texto}
          </p>
        )}
        {rol === 'Cliente' && <VistaCliente data={data} ejecutar={ejecutar} />}
        {rol === 'Barbero' && <VistaBarbero data={data} ejecutar={ejecutar} />}
        {rol === 'Administrador' && <VistaAdmin data={data} ejecutar={ejecutar} />}
      </main>
    </div>
  );
}

function VistaCliente({ data, ejecutar }) {
  const vacio = { cliente: '', servicio: '', barbero: '', fecha: hoy(), hora: '' };
  const [form, setForm] = useState(vacio);
  const [consulta, setConsulta] = useState('');
  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = () => {
    if (ejecutar(registrarTurno(data, form))) {
      setConsulta(form.cliente);
      setForm({ ...vacio, cliente: form.cliente });
    }
  };
  const misTurnos = consulta.trim()
    ? data.turnos.filter((t) => t.cliente.toLowerCase().includes(consulta.trim().toLowerCase()))
    : [];
  const cola = construirCola(data.turnos, hoy()).toArray();

  return (
    <div className="columnas">
      <section>
        <h2>Reservar turno</h2>
        <div className="formulario">
          <label>Nombre
            <input name="cliente" value={form.cliente} onChange={cambiar} placeholder="Tu nombre" />
          </label>
          <label>Servicio
            <select name="servicio" value={form.servicio} onChange={cambiar}>
              <option value="">Elige un servicio</option>
              {data.servicios.map((s) => (
                <option key={s.id} value={s.nombre}>{s.nombre} (S/ {s.precio})</option>
              ))}
            </select>
          </label>
          <label>Barbero
            <select name="barbero" value={form.barbero} onChange={cambiar}>
              <option value="">Elige un barbero</option>
              {data.barberos.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <div className="fila">
            <label>Fecha
              <input type="date" name="fecha" min={hoy()} value={form.fecha} onChange={cambiar} />
            </label>
            <label>Hora
              <input type="time" name="hora" value={form.hora} onChange={cambiar} />
            </label>
          </div>
          <button className="primario" onClick={guardar}>
            Reservar turno
          </button>
        </div>
      </section>

      <section>
        <h2>Mis turnos</h2>
        <label>Buscar por nombre
          <input value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="Escribe tu nombre" />
        </label>
        {consulta.trim() && misTurnos.length === 0 && <p className="vacio">No hay turnos con ese nombre.</p>}
        <ul className="lista">
          {misTurnos.map((t) => {
            const pos = cola.findIndex((c) => c.id === t.id);
            return (
              <li key={t.id}>
                <div>
                  <strong>{t.servicio}</strong> con {t.barbero}
                  <br />
                  <small>
                    {t.fecha} · {t.hora} · {t.estado}
                    {pos >= 0 && ` · posición ${pos + 1} en la cola de hoy`}
                  </small>
                </div>
                {t.estado === 'registrada' && (
                  <button onClick={() => window.confirm('¿Cancelar este turno?') && ejecutar(cancelarTurno(data, t.id))}>
                    Cancelar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function VistaBarbero({ data, ejecutar }) {
  const [cliente, setCliente] = useState('');
  const cola = construirCola(data.turnos, hoy()).toArray();
  const historial = cliente.trim() ? construirHistorial(data.turnos, cliente) : [];

  return (
    <div className="columnas">
      <section>
        <h2>Cola de hoy</h2>
        {cola.length === 0 ? (
          <p className="vacio">No hay clientes en espera.</p>
        ) : (
          <ol className="lista cola">
            {cola.map((t, i) => (
              <li key={t.id} className={i === 0 ? 'siguiente' : ''}>
                <div>
                  <strong>{t.cliente}</strong>{i === 0 && ' (siguiente)'}
                  <br />
                  <small>{t.servicio} · {t.barbero} · {t.hora}</small>
                </div>
              </li>
            ))}
          </ol>
        )}
        <button className="primario" disabled={cola.length === 0} onClick={() => ejecutar(atenderSiguiente(data, hoy()))}>
          Atender al siguiente
        </button>
      </section>

      <section>
        <h2>Historial de un cliente</h2>
        <label>Buscar por nombre
          <input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nombre del cliente" />
        </label>
        {cliente.trim() && historial.length === 0 && <p className="vacio">Sin atenciones previas.</p>}
        <ul className="lista">
          {historial.map((t) => (
            <li key={t.id}>
              <div>
                <strong>{t.servicio}</strong> con {t.barbero}
                <br />
                <small>{t.fecha} · {t.hora}</small>
              </div>
            </li>
          ))}
        </ul>
        <p className="nota">La atención más reciente aparece primero (pila).</p>
      </section>
    </div>
  );
}

function VistaAdmin({ data, ejecutar }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  return (
    <section>
      <h2>Servicios y precios</h2>
      <div className="fila">
        <label>Servicio
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Afeitado clásico" />
        </label>
        <label>Precio (S/)
          <input type="number" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        </label>
      </div>
      <button className="primario" onClick={() => ejecutar(agregarServicio(data, nombre, precio)) && (setNombre(''), setPrecio(''))}>
        Agregar servicio
      </button>
      <ul className="lista">
        {data.servicios.map((s) => (
          <li key={s.id}>
            <div><strong>{s.nombre}</strong> · S/ {s.precio}</div>
            <button onClick={() => ejecutar(eliminarServicio(data, s.id))}>Eliminar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
