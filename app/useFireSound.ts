'use client';
import {useCallback, useEffect, useRef, useState} from 'react';

type FireSound = {sources: AudioBufferSourceNode[]; gain: GainNode};
type AudioSessionNavigator = Navigator & {audioSession?: {type: string}};

/** A tiny silent WAV. Playing it through an <audio> element during the tap moves iOS into the
 *  "playback" audio session, so Web Audio is heard even when the ringer/silent switch is on. */
function silentWavUrl() {
  const sr = 8000, samples = 800; // 0.1s, 8-bit mono
  const buf = new ArrayBuffer(44 + samples);
  const v = new DataView(buf);
  const str = (o: number, t: string) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + samples, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  str(36, 'data'); v.setUint32(40, samples, true);
  for (let i = 0; i < samples; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buf], {type: 'audio/wav'}));
}

/** Builds two looping buffers: a warm low "breathing" bed and a layer of crackles and pops. */
function buildFireBuffers(context: AudioContext) {
  const sr = context.sampleRate;

  // Layer 1: a soft, warm bed (quiet brown noise with slow swells).
  const bedLen = Math.floor(sr * 17);
  const bed = context.createBuffer(2, bedLen, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = bed.getChannelData(ch);
    let b = 0;
    for (let i = 0; i < bedLen; i++) {
      b = (b + (Math.random() * 2 - 1) * 0.02) * 0.996;
      d[i] = b;
    }
    const fade = Math.floor(sr * 0.5);
    for (let i = 0; i < fade; i++) {
      const t = i / fade;
      d[i] = d[i] * t + d[bedLen - fade + i] * (1 - t); // seamless loop
    }
    for (let i = 0; i < bedLen; i++) {
      const tt = i / sr;
      d[i] *= 0.75 + 0.25 * Math.sin((tt * 2 * Math.PI * 3) / 17 + ch) * Math.sin((tt * 2 * Math.PI * 2) / 17);
    }
  }

  // Layer 2: crisp crackles in little clusters, plus occasional woody pops.
  const crLen = Math.floor(sr * 23);
  const cr = context.createBuffer(2, crLen, sr);
  const L = cr.getChannelData(0);
  const R = cr.getChannelData(1);
  const add = (at: number, v: number, pan: number) => {
    if (at < 0 || at >= crLen) return;
    L[at] += v * (1 - pan);
    R[at] += v * pan;
  };
  const click = (at: number, amp: number, pan: number) => {
    const tau = sr * (0.00008 + Math.random() * 0.0004);
    const n = Math.floor(tau * 6);
    for (let j = 0; j < n; j++) add(at + j, (Math.random() * 2 - 1) * amp * Math.exp(-j / tau), pan);
  };
  const pop = (at: number, amp: number, pan: number) => {
    click(at, amp, pan);
    const f = 140 + Math.random() * 260;
    const tau = sr * (0.006 + Math.random() * 0.012);
    const n = Math.floor(tau * 6);
    for (let j = 0; j < n; j++) add(at + j, Math.sin((2 * Math.PI * f * j) / sr) * amp * 0.55 * Math.exp(-j / tau), pan);
    for (let k = 0; k < 3 + Math.random() * 6; k++) {
      click(at + Math.floor(sr * (0.004 + Math.random() * 0.05)), amp * (0.15 + Math.random() * 0.3), pan);
    }
  };
  const margin = Math.floor(sr * 0.4);
  for (let t = margin; t < crLen - margin; t += Math.floor(sr * (0.06 + Math.random() * Math.random() * 0.9))) {
    const pan = 0.15 + Math.random() * 0.7;
    const count = 1 + Math.floor(Math.random() * Math.random() * 9);
    let c = t;
    for (let k = 0; k < count; k++) {
      click(c, 0.12 + Math.pow(Math.random(), 2.5) * 0.7, pan);
      c += Math.floor(sr * (0.008 + Math.random() * 0.09));
    }
  }
  for (let p = margin + Math.floor(sr * Math.random() * 2); p < crLen - margin; p += Math.floor(sr * (1.6 + Math.random() * 3.2))) {
    pop(p, 0.55 + Math.random() * 0.4, 0.2 + Math.random() * 0.6);
  }
  for (let i = 0; i < crLen * 0.0009; i++) {
    click(margin + Math.floor(Math.random() * (crLen - 2 * margin)), 0.03 + Math.random() * 0.05, Math.random()); // faint sizzle
  }
  return {bed, cr};
}

/** Opt-in fireplace ambience generated with the Web Audio API. Never autoplays. */
export function useFireSound() {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const contextRef = useRef<AudioContext | null>(null);
  const soundRef = useRef<FireSound | null>(null);
  const unlockRef = useRef<HTMLAudioElement | null>(null);

  const stopNow = useCallback((s: FireSound | null = soundRef.current) => {
    if (!s) return;
    s.sources.forEach(src => {
      try { src.stop(); } catch {}
      src.disconnect();
    });
    s.gain.disconnect();
    if (soundRef.current === s) soundRef.current = null;
  }, []);

  useEffect(() => {
    const w = window as typeof window & {webkitAudioContext?: typeof AudioContext};
    setSupported(Boolean(w.AudioContext || w.webkitAudioContext));
    // Mobile browsers suspend audio when the tab is hidden or a call comes in; resume on return.
    const wake = () => {
      const ctx = contextRef.current;
      if (document.visibilityState === 'visible' && soundRef.current && ctx && ctx.state !== 'running') {
        void ctx.resume().catch(() => {});
        void unlockRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', wake);
    window.addEventListener('pageshow', wake);
    return () => {
      document.removeEventListener('visibilitychange', wake);
      window.removeEventListener('pageshow', wake);
      stopNow();
      unlockRef.current?.pause();
      void contextRef.current?.close();
    };
  }, [stopNow]);

  const toggle = useCallback(async () => {
    if (playing) {
      const s = soundRef.current;
      const ctx = contextRef.current;
      if (s && ctx) {
        s.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
        soundRef.current = null;
        setTimeout(() => stopNow(s), 600);
      }
      unlockRef.current?.pause();
      setPlaying(false);
      return;
    }
    try {
      const w = window as typeof window & {webkitAudioContext?: typeof AudioContext};
      const Ctor = w.AudioContext || w.webkitAudioContext;
      if (!Ctor) { setSupported(false); return; }

      // Everything up to resume() must happen synchronously inside the tap, or mobile Safari
      // keeps the audio locked.
      const nav = navigator as AudioSessionNavigator;
      if (nav.audioSession) {
        try { nav.audioSession.type = 'playback'; } catch {}
      }
      if (!unlockRef.current) {
        const el = new Audio(silentWavUrl());
        el.loop = true;
        el.setAttribute('playsinline', '');
        unlockRef.current = el;
      }
      const unlocked = unlockRef.current.play().catch(() => {});
      const context = contextRef.current ?? new Ctor();
      contextRef.current = context;
      const resumed = context.resume();

      // Prime the output with a one-sample silent buffer (unlocks older iOS WebKit).
      const prime = context.createBufferSource();
      prime.buffer = context.createBuffer(1, 1, context.sampleRate);
      prime.connect(context.destination);
      prime.start(0);

      await Promise.all([resumed, unlocked]);
      stopNow();
      const {bed, cr} = buildFireBuffers(context);

      const bedSrc = context.createBufferSource();
      bedSrc.buffer = bed;
      bedSrc.loop = true;
      const crSrc = context.createBufferSource();
      crSrc.buffer = cr;
      crSrc.loop = true;

      const bedFilter = context.createBiquadFilter();
      bedFilter.type = 'lowpass';
      bedFilter.frequency.value = 380;
      const bedGain = context.createGain();
      bedGain.gain.value = 0.55;
      const crHigh = context.createBiquadFilter();
      crHigh.type = 'highpass';
      crHigh.frequency.value = 90;
      const crWarm = context.createBiquadFilter();
      crWarm.type = 'lowpass';
      crWarm.frequency.value = 6500;
      const crGain = context.createGain();
      crGain.gain.value = 0.9;
      const gain = context.createGain();
      gain.gain.value = 0;

      bedSrc.connect(bedFilter).connect(bedGain).connect(gain);
      crSrc.connect(crHigh).connect(crWarm).connect(crGain).connect(gain);
      gain.connect(context.destination);
      gain.gain.setTargetAtTime(0.5, context.currentTime, 0.4);
      bedSrc.start();
      crSrc.start();
      soundRef.current = {sources: [bedSrc, crSrc], gain};
      setPlaying(true);
    } catch {
      unlockRef.current?.pause();
      setPlaying(false);
    }
  }, [playing, stopNow]);

  return {playing, supported, toggle};
}
