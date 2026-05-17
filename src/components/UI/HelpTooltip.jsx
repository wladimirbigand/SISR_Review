import { HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Tooltip rendered through a React portal so it escapes any
// `overflow:hidden` / `overflow-x:auto` ancestor (typically the <pre>
// element of CodeBlock, which would otherwise clip the popover).
export default function HelpTooltip({ text, size = 16, className = '' }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const closeTimer = useRef(null);

  const reposition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({
      top: r.top + window.scrollY,
      left: r.left + r.width / 2 + window.scrollX,
    });
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [cancelClose]);

  const openNow = useCallback(() => {
    cancelClose();
    reposition();
    setOpen(true);
  }, [cancelClose, reposition]);

  useEffect(() => {
    if (!open) return;
    reposition();
    const onScrollOrResize = () => reposition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !popoverRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  // Hit-target slightly larger than the icon so it's easier to hover/tap.
  const pad = 4;
  const dim = size + pad * 2;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Aide"
        aria-expanded={open}
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
        onFocus={openNow}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (open) setOpen(false);
          else openNow();
        }}
        className={`inline-flex items-center justify-center align-middle rounded-full bg-white shadow-sm border border-[#D70A53]/30 hover:scale-110 active:scale-95 transition-transform leading-none ${className}`}
        style={{
          width: dim,
          height: dim,
          color: '#D70A53',
          minWidth: dim,
          minHeight: dim,
        }}
      >
        <HelpCircle size={size} strokeWidth={2.6} aria-hidden="true" />
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div
                ref={popoverRef}
                role="tooltip"
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                style={{
                  position: 'absolute',
                  top: coords.top - 8,
                  left: coords.left,
                  transform: 'translate(-50%, -100%)',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="relative w-64 max-w-[80vw] rounded-xl bg-ink text-white text-xs leading-relaxed px-3 py-2 shadow-xl"
                >
                  {text}
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-ink"
                    style={{ top: '100%', marginTop: '-5px' }}
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
