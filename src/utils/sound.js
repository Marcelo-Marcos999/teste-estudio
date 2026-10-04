// Efeitos sonoros sintetizados com a Web Audio API (sem arquivos externos).
// O contexto é criado sob demanda, na primeira interação do usuário, para
// respeitar as políticas de autoplay dos navegadores.

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  try {
    if (!audioCtx) {
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (error) {
    return null;
  }
}

function playTone({ freq = 440, duration = 0.12, type = 'sine', gain = 0.08, delay = 0, sweepTo = null }) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (sweepTo) {
    osc.frequency.exponentialRampToValueAtTime(sweepTo, start + duration);
  }

  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(amp);
  amp.connect(ctx.destination);

  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playMove() {
  playTone({ freq: 520, sweepTo: 760, duration: 0.1, type: 'triangle', gain: 0.06 });
}

export function playWin() {
  playTone({ freq: 523.25, duration: 0.16, type: 'square', gain: 0.05 });
  playTone({ freq: 659.25, duration: 0.16, type: 'square', gain: 0.05, delay: 0.12 });
  playTone({ freq: 783.99, duration: 0.28, type: 'square', gain: 0.05, delay: 0.24 });
}

export function playDraw() {
  playTone({ freq: 392, sweepTo: 261.63, duration: 0.32, type: 'sawtooth', gain: 0.045 });
}

export default { playMove, playWin, playDraw };
