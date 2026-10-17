// Cola (FIFO): el primero en llegar es el primero en ser atendido.
export class Cola {
  constructor() {
    this.items = [];
  }
  encolar(elemento) {
    this.items.push(elemento);
  }
  desencolar() {
    return this.items.shift();
  }
  frente() {
    return this.items[0];
  }
  estaVacia() {
    return this.items.length === 0;
  }
  tamano() {
    return this.items.length;
  }
  toArray() {
    return [...this.items];
  }
}
