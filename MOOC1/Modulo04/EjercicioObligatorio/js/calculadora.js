"use strict";

var invertirCadena = x => x.split("").reverse().join("");

var introducirNumero = (pantalla, estado) => function() {
  pantalla.innerHTML += this.innerHTML;
  estado.innerHTML = "";
};

var limpiarPantalla = (pantalla, estado) => function() {
  pantalla.innerHTML = "";
  estado.innerHTML = "";
};

var introducirOperador = (pantalla, estado) => function() {
  let operacion = pantalla.innerHTML.trim();
  let operador = this.innerHTML.trim();
  if (/^$|[^01]/.test(operacion.slice( operacion.length-1)) && 
      (/[*//]/.test(operador) || /^[+-]$|[-+*//]{2}/.test(operacion.slice(operacion.length-2)))) {
    estado.innerHTML = "Introducción errónea de operador.";
  } else {
    pantalla.innerHTML += operador;
    estado.innerHTML = "";
  }
};

var realizarOperacion = (pantalla, estado) => function() {
  let operacion = pantalla.innerHTML.trim();
  if (operacion.length == 0) return;

  if (/[^01]/.test(operacion.slice( operacion.length-1))) {
    estado.innerHTML = "Formato de operación errónea.";
    return;
  }

  // Se obtienen los números y los operadores.
  let operacionInv = invertirCadena(operacion);
  var numeros = operacionInv.split(/[+*-//](?=[10])/).reverse().map(x => parseInt(invertirCadena(x), 2));
  if (numeros.findIndex(x => isNaN(x)) != -1) {
    estado.innerHTML = "Formato de operación errónea.";
    return;
  }
  var operadores = operacionInv.split(/[+-]$|[01]|[+-](?=[+*-//])/).filter(x => x !== "").reverse();

  for (let operador of [/[*//]/, /[+-]/]) {
    for (let i = 0; i < operadores.length; ++i) {
      if (!operador.test(operadores[i])) continue;
      numeros[i + 1] = eval(numeros[i] + operadores[i] + numeros[i + 1]);
      delete operadores[i];
      delete numeros[i];
    }
    numeros = numeros.filter(x => x !== void 0);
    operadores = operadores.filter(x => x !== void 0);
  }

  pantalla.innerHTML = numeros[0].toString( 2);
  estado.innerHTML = "Operación realizada correctamente";
};

var pantalla = document.getElementById("res");
var estado = document.getElementById("estado");
[].forEach.call(document.getElementsByClassName("numero"),
  x => x.onclick = introducirNumero(pantalla, estado));
[].forEach.call(document.getElementsByClassName("operador"),
  x => x.onclick = introducirOperador(pantalla, estado));
document.getElementById("btnClr").onclick = limpiarPantalla(pantalla, estado);
document.getElementById("btnEql").onclick = realizarOperacion(pantalla, estado);