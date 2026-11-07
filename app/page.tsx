'use client';
import {useEffect, useRef, useState} from 'react';
import {ArrowRight, X, Volume2, VolumeX} from 'lucide-react';
import {useFireSound} from './useFireSound';

type Panel = 'adventures' | 'privacy' | null;

export default function Home() {
  const [panel, setPanel] = useState<Panel>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const fire = useFireSound();

  const open = (next: Exclude<Panel, null>) => {
    if (!dialogRef.current?.open) returnFocusRef.current = document.activeElement as HTMLElement | null;
    setPanel(next);
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (panel && !dialog.open) dialog.showModal();
    if (panel) {
      document.documentElement.classList.add('modal-open');
      dialog.scrollTop = 0;
      dialog.querySelector<HTMLElement>('h2')?.focus();
    }
  }, [panel]);

  const onDialogClose = () => {
    document.documentElement.classList.remove('modal-open');
    setPanel(null);
    returnFocusRef.current?.focus();
  };

  return (
    <main className="immersive-home">
      <h1 className="visually-hidden">Little Tails — watercolor storybook adventures starring Drizzy the French bulldog</h1>
      <section className="illustrated-library" aria-label="The Little Tails library">
        <div className="library-artboard">
          <picture className="library-picture">
            <source media="(max-width: 640px)" srcSet="/images/library-mobile.webp" width={941} height={1672} />
            <source media="(max-width: 1024px)" srcSet="/images/library-tablet.webp" width={1086} height={1448} />
            <img
              className="library-painting"
              src="/images/library-desktop.webp"
              width={1535}
              height={1024}
              fetchPriority="high"
              alt="A cozy watercolor library with a glowing fireplace, Drizzy the French bulldog asleep in his checkered bed, and storybooks on the table"
            />
          </picture>
          <div className="firelight" aria-hidden="true" />
          <div className="firelight firelight-secondary" aria-hidden="true" />
          <button type="button" className="storybook-plaque plaque-adventures" onClick={() => open('adventures')}>
            <span aria-hidden="true">❧</span> Our Adventures <ArrowRight size={16} aria-hidden="true" /><span aria-hidden="true">❧</span>
          </button>
        </div>
        {fire.supported && (
          <button type="button" className="fire-sound-toggle" onClick={fire.toggle}>
            {fire.playing ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
            <span className="fire-sound-label">{fire.playing ? 'Mute the fire' : 'Hear the fire'}</span>
          </button>
        )}
        <footer className="library-bottom-hint">
          <p>— Where the littlest adventures come to life.</p>
          <button type="button" onClick={() => open('privacy')}>Privacy policy</button>
        </footer>
      </section>

      <dialog
        ref={dialogRef}
        className="library-modal"
        aria-labelledby="library-modal-title"
        onClose={onDialogClose}
        onClick={e => { if (e.target === e.currentTarget) close(); }}
      >
        <div className="library-modal-inner">
          <button type="button" className="modal-close" aria-label="Close" onClick={close}><X size={22} aria-hidden="true" /></button>
          <div className="modal-ornament" aria-hidden="true">✦ LITTLE TAILS ✦</div>
          {panel === 'adventures' && (
            <>
              <h2 id="library-modal-title" className="modal-title modal-title-compact" tabIndex={-1}>Shhh…a little adventure is in the making! <span aria-hidden="true">🐾</span></h2>
              <p>Drizzy is packing his favorite blanket, dreaming of pup cups, and getting ready for his next big adventure.</p>
              <p>Our storybooks aren’t quite ready to curl up with just yet, but something wonderful is on its way.</p>
              <p><strong>Check back soon. The best little tales are worth waiting for.</strong></p>
              <p><em>With love, Little Tails Press</em> <span aria-hidden="true">🐾</span></p>
            </>
          )}
          {panel === 'privacy' && (
            <>
              <h2 id="library-modal-title" className="modal-title modal-title-compact" tabIndex={-1}>A Little Note About Privacy</h2>
              <p>Even the coziest corners of the internet deserve a little privacy. Here’s how we keep things simple at Little Tails Press.</p>
              <div className="privacy-copy">
                <h3>No Sneaky Little Footprints <span aria-hidden="true">🐾</span></h3>
                <p>There are no accounts to create, forms to fill out, or personal details to share. We don’t use cookies, track visitors with analytics, or show advertisements.</p>
                <p>You’re simply here to enjoy a good story, and that’s just how we like it.</p>
                <h3>Behind the Storybook Door</h3>
                <p>Like any little home on the internet, our website needs a place to live. Our hosting provider automatically handles a few technical details, like your IP address and browser type, to keep the pages running safely and smoothly.</p>
                <p>Those details are handled according to our hosting provider’s own privacy policies.</p>
                <h3>A Crackling Little Fire <span aria-hidden="true">🔥</span></h3>
                <p>That cozy fireplace sound? It’s just a little bit of magic happening right in your browser.</p>
                <p>No microphones, no recordings, just the gentle crackle of a fire.</p>
                <h3>Adventures Beyond Our Pages</h3>
                <p>If you follow a book link, you’ll find yourself visiting Amazon, where their own privacy practices apply.</p>
                <h3>And That’s the Whole Tail!</h3>
                <p>No surprises, no complicated tricks. Just a cozy corner of the internet for little adventures and wonderful stories.</p>
                <p className="privacy-signoff"><strong>With love,</strong><br /><strong>Little Tails Press <span aria-hidden="true">🐾</span></strong></p>
              </div>
            </>
          )}
          <div className="modal-footer" aria-hidden="true">❧ &nbsp; Where the littlest adventures come to life. &nbsp; ❧</div>
        </div>
      </dialog>
    </main>
  );
}
