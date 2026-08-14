import { useEffect, useRef } from "react";

/**
 * "Nova grain" background — a dark→electric-blue banded gradient that rises
 * to the right like an equalizer, with heavy film grain. Plain WebGL1, no
 * libraries: a fullscreen triangle. RAF pauses when the tab is hidden; DPR
 * capped at 2; reduced-motion renders a single static frame.
 */

const VERT = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_res;
uniform float u_time;
uniform float u_grain;

// Even white noise (Dave Hoskins hash12) for grain.
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;   // 0..1, y up

  // Vertical bands rising to the right (staircase equalizer).
  float bands = 6.0;
  float idx = floor(uv.x * bands);
  float bandT = idx / (bands - 1.0);              // 0 (left) .. 1 (right)
  float h = mix(0.14, 0.98, bandT);               // fill height per band
  h += 0.045 * sin(u_time * 0.5 + idx * 1.7);     // slow breathing

  // Blue fills from the bottom up to h with a soft top edge.
  float fill = 1.0 - smoothstep(h - 0.38, h, uv.y);
  // Overall brightening toward the bottom-right.
  float glow = clamp(fill * mix(0.30, 1.18, uv.x), 0.0, 1.3);

  // Palette: black -> deep blue -> electric blue -> bright.
  vec3 deep = vec3(0.02, 0.03, 0.16);
  vec3 blue = vec3(0.035, 0.125, 0.957);          // #0920F4
  vec3 bright = vec3(0.32, 0.42, 1.0);
  vec3 col = vec3(0.0);
  col = mix(col, deep, smoothstep(0.0, 0.4, glow));
  col = mix(col, blue, smoothstep(0.28, 0.92, glow));
  col = mix(col, bright, smoothstep(0.92, 1.28, glow));

  // Faint dot grid.
  vec2 g = fract(gl_FragCoord.xy / 26.0) - 0.5;
  col += smoothstep(0.08, 0.0, length(g)) * 0.035;

  // Heavy film grain (animated).
  float n = hash12(gl_FragCoord.xy + mod(u_time * 60.0, 512.0));
  col += (n - 0.5) * u_grain;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

interface Props {
  className?: string;
}

const NovaGrain = ({ className = "" }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", { antialias: false, alpha: false, depth: false }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const locRes = gl.getUniformLocation(prog, "u_res");
    const locTime = gl.getUniformLocation(prog, "u_time");
    const locGrain = gl.getUniformLocation(prog, "u_grain");
    gl.uniform1f(locGrain, 0.16);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      resize();
      gl.uniform2f(locRes, w, h);
      gl.uniform1f(locTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };
    const drawOnce = () => {
      resize();
      gl.uniform2f(locRes, w, h);
      gl.uniform1f(locTime, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduce && raf === 0) {
        raf = requestAnimationFrame(draw);
      }
    };

    if (reduce) {
      drawOnce();
    } else {
      raf = requestAnimationFrame(draw);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
};

export default NovaGrain;
