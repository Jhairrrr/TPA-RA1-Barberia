// Pila (LIFO): la última atención realizada es la primera que se ve.
export class Pila {
  constructor() {
    this.items = [];
  }
  apilar(elemento) {
    this.items.push(elemento);
  }
  desapilar() {
    return this.items.pop();
  }
  cima() {
    return this.items[this.items.length - 1];
  }
  estaVacia() {
    return this.items.length === 0;
  }
  // Devuelve los elementos de la cima hacia abajo (más reciente primero).
  toArray() {
    return [...this.items].reverse();
  }
}
