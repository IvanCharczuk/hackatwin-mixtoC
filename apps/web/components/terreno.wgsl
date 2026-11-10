// Cordillera en 3D: un terreno de ruido fractal recorrido con raymarching desde una cámara baja.
// El sol está detrás de la cordillera: las laderas quedan a contraluz, las crestas se encienden y la
// distancia se pierde en la bruma del amanecer. Es caro, por eso se dibuja una sola vez en un target
// (y otra vez sólo si cambia el tamaño); el sol y los rayos se suman después, en paisaje.wgsl.
// ponytail: copia en apps/landing/src/terreno.wgsl; si cambia una, cambia la otra.

struct Terreno {
  aspect: f32,  // ancho / alto
  alto: f32,    // hasta dónde llegan las cumbres, en fracción del alto (medido desde abajo)
  horiz: f32,   // altura de la línea del horizonte en pantalla, misma medida
  escala: f32,  // escala vertical del terreno, para que las cumbres lleguen a `alto`
  solX: f32,    // posición del sol en pantalla: x en uv, y desde abajo
  solY: f32,
}
@group(0) @binding(0) var<uniform> params: Terreno;

const K: f32 = 0.9; // campo visual: cuánto se abre el rayo por unidad de pantalla

// Hash sin seno (el de sin() pierde precisión en la GPU y deja estrías).
fn hash2(p: vec2f) -> f32 {
  let q = 50.0 * fract(p * 0.3183099 + vec2f(0.71, 0.113));
  return fract(q.x * q.y * (q.x + q.y));
}

fn ruido2(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  // Interpolación quíntica: sin pliegues en la grilla del ruido (si no, las laderas salen con estrías).
  let u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  let a = hash2(i);
  let b = hash2(i + vec2f(1.0, 0.0));
  let c = hash2(i + vec2f(0.0, 1.0));
  let d = hash2(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn rayo(uvx: f32, s: f32) -> vec3f {
  // En pantallas angostas (celular) se abre el campo horizontal, como un lente anamórfico, para que entre
  // la cordillera entera en vez de un pedazo del valle.
  return normalize(vec3f((uvx - 0.5) * max(params.aspect, 1.3) * K, (s - params.horiz) * K, 1.0));
}

// Alto del terreno en (x, z). `oct` octavas: pocas para avanzar el rayo, más para la normal.
fn terreno(p: vec2f, oct: i32, sol: vec3f) -> f32 {
  var s = 0.0;
  var a = 0.5;
  var q = p * 0.075;
  let rot = mat2x2f(1.6, 1.2, -1.2, 1.6);
  for (var o = 0; o < oct; o++) {
    // Ruido "ridged": crestas en punta, como aristas de roca.
    let n = 1.0 - abs(ruido2(q) * 2.0 - 1.0);
    s += a * n * n;
    q = rot * q;
    a *= 0.47;
  }
  // La cordillera se levanta con la distancia: lomas cerca, los Andes al fondo.
  let rango = smoothstep(6.0, 38.0, p.y);
  // Un valle en la dirección del sol, para que asome entre las cumbres.
  let dirSol = p.x / max(p.y, 1.0) - sol.x / sol.z;
  let ancho = 0.11;
  let valle = 1.0 - 0.5 * rango * exp(-dirSol * dirSol / (ancho * ancho));
  return (0.3 + s * (0.9 + 8.5 * rango) * valle) * params.escala;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let s = 1.0 - uv.y;
  // Todo lo que está arriba de las cumbres es cielo: se corta acá, sin recorrer el rayo.
  if (s > params.alto * 1.4) {
    return vec4f(0.0);
  }

  let ro = vec3f(0.0, 1.5 * params.escala, 0.0);
  let rd = rayo(uv.x, s);
  let sol = rayo(params.solX, params.solY);

  // Raymarching con paso proporcional a la distancia al suelo.
  var t = 0.5;
  var antes = t;
  var toco = false;
  // Muchos pasos chicos: corre una sola vez (el resultado queda en un target), así que alcanza.
  for (var i = 0; i < 320; i++) {
    let p = ro + rd * t;
    let d = p.y - terreno(p.xz, 4, sol);
    if (d < 0.0006 * t) {
      toco = true;
      break;
    }
    antes = t;
    t += max(0.22 * d, 0.004 * t + 0.01);
    if (t > 160.0) {
      break;
    }
  }
  if (!toco) {
    // Un rayo que va hacia abajo y no tocó nada se perdió en la distancia: es bruma, no cielo.
    if (rd.y < 0.0) {
      return vec4f(mix(vec3f(0.56, 0.56, 0.76), vec3f(1.0, 0.8, 0.58), pow(max(dot(rd, sol), 0.0), 40.0)), 1.0);
    }
    return vec4f(0.0);
  }
  // Bisección entre el último paso afuera y el primero adentro: sin esto las crestas finas salen en peine.
  for (var j = 0; j < 5; j++) {
    let medio = 0.5 * (antes + t);
    let pm = ro + rd * medio;
    if (pm.y - terreno(pm.xz, 4, sol) < 0.0) {
      t = medio;
    } else {
      antes = medio;
    }
  }

  let p = ro + rd * t;
  // Normal con más detalle que el avance del rayo, pero sin pasar del tamaño de un pixel.
  let e = 0.006 * t + 0.02;
  let hx = terreno(p.xz - vec2f(e, 0.0), 6, sol) - terreno(p.xz + vec2f(e, 0.0), 6, sol);
  let hz = terreno(p.xz - vec2f(0.0, e), 6, sol) - terreno(p.xz + vec2f(0.0, e), 6, sol);
  let n = normalize(vec3f(hx, 2.0 * e, hz));

  // Luz: el sol bajo y detrás, el cielo azul de relleno, y un rebote frío desde el lado opuesto.
  let dif = clamp(dot(n, sol), 0.0, 1.0);
  let cielo = 0.5 + 0.5 * n.y;
  let rebote = clamp(dot(n, normalize(vec3f(-sol.x, 0.0, -sol.z))), 0.0, 1.0);

  // Roca azulada y nieve donde la pendiente es suave y hay altura, con borde irregular.
  let roca = mix(vec3f(0.18, 0.2, 0.33), vec3f(0.27, 0.27, 0.38), ruido2(p.xz * 0.9));
  let lineaNieve = (4.2 + 2.2 * ruido2(p.xz * 0.25)) * params.escala;
  let nieve = smoothstep(0.35, 0.65, n.y) * smoothstep(lineaNieve, lineaNieve + 0.8 * params.escala, p.y);
  let albedo = mix(roca, vec3f(0.9, 0.92, 1.0), nieve);

  var color = albedo * (vec3f(1.0, 0.78, 0.56) * dif * 0.55 + vec3f(0.34, 0.4, 0.7) * cielo * 0.95 + vec3f(0.2, 0.2, 0.32) * rebote * 0.3);

  // Contraluz: las aristas que se recortan contra el sol se encienden.
  // El campo visual es angosto: el coseno hacia el sol ronda 0.9 en toda la pantalla, por eso los exponentes altos.
  let haciaSol = max(dot(rd, sol), 0.0);
  let fresnel = pow(clamp(1.0 + dot(rd, n), 0.0, 1.0), 3.0);
  color += vec3f(1.0, 0.72, 0.38) * fresnel * pow(haciaSol, 60.0) * 1.8;

  // Perspectiva aérea: lejos todo se funde en la bruma, durazno hacia el sol y lavanda al costado.
  // Más bruma abajo que en las cumbres, como el aire real.
  let bruma = (1.0 - exp(-t * 0.024)) * mix(1.0, 0.75, clamp(p.y / (8.0 * params.escala), 0.0, 1.0));
  let colorBruma = mix(vec3f(0.56, 0.56, 0.76), vec3f(1.0, 0.8, 0.58), pow(haciaSol, 40.0));
  color = mix(color, colorBruma, bruma);

  return vec4f(color, 1.0);
}
