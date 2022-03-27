float line(vec2 uv, float offset) {
  return smoothstep(
    0.0, 
    0.5 + offset * 0.5, 
    0.5 * abs((sin(uv.x * 30.0) + offset * 2.0))
  );
}

#pragma glslify: export(line)