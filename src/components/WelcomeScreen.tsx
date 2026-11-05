import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT } from '@/lib/event';

interface WelcomeScreenProps {
  onJoin: (name: string) => void;
}

/**
 * Foto de Grecia para el fondo. Cuando la familia mande una, se guarda en
 * /public/grecia.jpg y se pone aquí: HERO_PHOTO = '/grecia.jpg'.
 * Mientras tanto la pantalla se sostiene sola con el marfil y el ornamento.
 */
const HERO_PHOTO: string | null = null;

/** Cruz delgada con florituras — hace eco del crucifijo de plata de la invitación */
function CruzOrnamento({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 64" fill="none" className={className} aria-hidden="true">
      <line x1="20" y1="4"  x2="20" y2="60" stroke="currentColor" strokeWidth="0.9" />
      <line x1="6"  y1="21" x2="34" y2="21" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="20" cy="4"  r="1.6" fill="currentColor" />
      <circle cx="6"  cy="21" r="1.2" fill="currentColor" />
      <circle cx="34" cy="21" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function WelcomeScreen({ onJoin }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim());
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[100dvh] overflow-hidden py-10"
      style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #FDFAF5 0%, #F7F2EA 45%, #EFE7DA 100%)' }}
    >
      {/* ── Foto de fondo (si la hay) ── */}
      {HERO_PHOTO && (
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_PHOTO})`, opacity: 0.32 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(247,242,234,0.55) 0%, rgba(247,242,234,0.80) 55%, rgba(247,242,234,0.96) 100%)' }}
          />
        </div>
      )}

      {/* ── Marco doble, como el filo de la invitación impresa (sin foto, viste la pantalla) ── */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.4 }}
        className="pointer-events-none absolute inset-3 rounded-[26px] z-0"
        style={{ border: '1px solid rgba(165,162,156,0.45)' }}
      >
        <div className="absolute inset-[6px] rounded-[21px]" style={{ border: '1px solid rgba(181,150,138,0.28)' }} />
      </motion.div>

      {/* ── Nombre enorme de marca de agua ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.055 }}
          transition={{ delay: 1.9, duration: 2.5 }}
          className="font-script leading-none text-[var(--accent-dark)]"
          style={{ fontSize: 'clamp(150px, 42vw, 400px)' }}
        >
          G
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {!showContent ? (
          /* ── Antesala ── */
          <motion.div
            key="pre"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="z-10 flex flex-col items-center gap-4 my-auto"
          >
            <CruzOrnomentoSafe />
            <p className="text-[8.5px] tracking-[0.55em] uppercase text-[var(--muted-foreground)]/60 font-sans">
              Cargando
            </p>
          </motion.div>
        ) : (
          /* ── Título ── */
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="z-10 text-center px-8 pt-2 pb-0 w-full max-w-[440px]"
          >
            {/* Fecha entre reglas de plata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center justify-center gap-3 mb-7"
            >
              <div className="h-[1px] w-8 bg-[var(--silver)]/60" />
              <span className="text-[9px] tracking-[0.5em] uppercase text-[var(--muted-foreground)] font-sans font-medium whitespace-nowrap">
                {EVENT.fechaCorta}
              </span>
              <div className="h-[1px] w-8 bg-[var(--silver)]/60" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="flex justify-center mb-5"
            >
              <CruzOrnamento className="w-[28px] h-[46px] text-[var(--accent)]" />
            </motion.div>

            <h1 className="leading-[1.05]">
              <span
                className="block font-heading font-light italic text-[var(--muted-foreground)] tracking-[0.13em]"
                style={{ fontSize: 'clamp(0.95rem, 3.8vw, 1.15rem)' }}
              >
                {EVENT.titulo}
              </span>
              <span
                className="block font-script text-[var(--accent-dark)] mt-1"
                style={{ fontSize: 'clamp(3.6rem, 16vw, 5.4rem)', lineHeight: 1.18 }}
              >
                {EVENT.nombre}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mt-6 mx-auto max-w-[300px] font-heading italic text-[var(--foreground)]/80 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 3.9vw, 1.05rem)' }}
            >
              «{EVENT.versiculo.texto}»
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-3 text-[9px] font-medium tracking-[0.45em] uppercase text-[var(--accent-dark)] font-sans"
            >
              {EVENT.versiculo.cita}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Formulario ── */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="z-10 w-full max-w-[360px] px-8 pb-4 pt-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <input
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-0 pt-6 pb-6 bg-transparent border-b border-[var(--silver)]/60 outline-none text-center text-[1.3rem] transition-colors duration-500 placeholder:text-[var(--muted-foreground)]/60 text-[var(--foreground)] font-heading italic tracking-wide focus:border-[var(--accent)]/70"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--accent)] origin-left transition-all duration-500 group-focus-within:w-full" />
              </div>

              <motion.button
                whileHover={{ scale: 1.012 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                className="w-full py-[17px] text-[11px] font-semibold tracking-[0.3em] uppercase rounded-2xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(180deg, #B5968A 0%, #9E7F73 100%)',
                  border: '1px solid rgba(140,111,99,0.6)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 26px rgba(140,111,99,0.28)',
                  color: '#FFFDF9',
                }}
              >
                Entrar a la Galería
              </motion.button>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-6 text-center text-[9px] tracking-[0.38em] uppercase text-[var(--muted-foreground)] font-sans"
            >
              Comparte tus fotos de este día
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** La cruz en la antesala, ya latiendo suave */
function CruzOrnomentoSafe() {
  return (
    <motion.div
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <CruzOrnamento className="w-[22px] h-[36px] text-[var(--silver)]" />
    </motion.div>
  );
}
