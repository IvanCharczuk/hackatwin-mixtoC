// Composición del amanecer: toma la cordillera ya dibujada (terreno.wgsl, en un target) y le suma el sol
// con su corona y rayos lentos. Es barata: es lo único que corre en cada cuadro.
// El cielo queda transparente (lo pone el CSS de la página). Salida premultiplicada.
// ponytail: copia en apps/landing/src/paisaje.wgsl; si cambia una, cambia la otra.

struct Params {
  time: f32,
  aspect: f32,  // ancho / alto
  scroll: f32,  // 0..1, cuánto se scrolleó la sección (paralaje)
  solX: f32,    // centro del sol: x en uv, y en fracción del alto desde abajo
  solY: f32,
  solR: f32,    // radio del disco, en fracción del alto
}
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var src: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // Paralaje: al scrollear, la cordillera baja un poco más rápido que la página.
  let cordillera = textureSampleLevel(src, samp, vec2f(uv.x, uv.y - params.scroll * 0.12), 0.0);

  let x = uv.x * params.aspect;
  let y = 1.0 - uv.y;
  let haciaSol = vec2f(params.solX * params.aspect, params.solY) - vec2f(x, y);
  let d = length(haciaSol) / params.solR;

  let fuera = max(d - 1.0, 0.0);
  let halo = exp(-fuera * 2.4) * 0.85 + exp(-fuera * 0.5) * 0.22;
  let ang = atan2(haciaSol.y, haciaSol.x);
  let haz = pow(0.5 + 0.5 * sin(ang * 11.0 + params.time * 0.09), 3.0) * (0.55 + 0.45 * sin(ang * 27.0 - params.time * 0.13));
  let rayos = max(haz, 0.0) * exp(-fuera * 0.9) * smoothstep(0.95, 1.35, d) * 0.5;
  let disco = 1.0 - smoothstep(0.92, 1.0, d);
  let centro = 1.0 - smoothstep(0.0, 1.0, d);

  let blanco = vec3f(1.0, 0.953, 0.839);
  let dorado = vec3f(1.0, 0.851, 0.541);
  let ambar = vec3f(0.949, 0.682, 0.18);
  let colorSol = mix(mix(ambar, dorado, clamp(halo, 0.0, 1.0)), mix(dorado, blanco, centro), disco);
  let alphaSol = clamp(max(disco, halo * 0.9 + rayos), 0.0, 1.0);

  // La luz del sol también baña la cordillera cercana a él (sobre la bruma).
  let cerro = cordillera.rgb + dorado * halo * 0.12 * cordillera.a;
  // El sol va detrás de la cordillera: sólo se ve donde ella no tapa.
  let rgb = cerro + colorSol * alphaSol * (1.0 - cordillera.a);
  let a = cordillera.a + alphaSol * (1.0 - cordillera.a);
  return vec4f(rgb, a);
}
