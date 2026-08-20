import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FOCUSABLE } from '../utils/focus';
import './ImageViewer.css';

/**
 * Fullscreen image viewer — zoom, pan, pinch, swipe.
 *
 * One implementation behind three features: the floor-plan viewer, the
 * master-plan viewer and the gallery lightbox. A plot layout is unreadable as a
 * 300px card (read.md §15, §16), and none of it is gated behind a form.
 *
 * Interaction:
 *   desktop  wheel / +− buttons to zoom, drag to pan, double-click to toggle,
 *            ← → between images, Esc to close
 *   touch    pinch to zoom, drag to pan when zoomed, swipe between images at
 *            1×, double-tap to toggle
 *
 * Accessibility: role="dialog" aria-modal, focus moved in on open, Tab trapped
 * inside, focus restored to the opener on close, Escape closes.
 */

const MAX_SCALE = 5;
const MIN_SCALE = 1;
/** Horizontal travel (px) that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 60;

export default function ImageViewer({
  images = [],
  index = 0,
  onIndexChange,
  onClose,
  title,
  /** Optional label rendered under the image, e.g. the plan's configuration. */
  caption,
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [failed, setFailed] = useState(false);
  // True only while a pointer gesture is in flight — the transform must not be
  // transitioned mid-drag or the image lags a frame behind the finger.
  const [gesturing, setGesturing] = useState(false);

  const panelRef = useRef(null);
  const stageRef = useRef(null);
  // active pointers, for pinch: id -> {x, y}
  const pointers = useRef(new Map());
  const gesture = useRef(null);

  const current = images[index];
  const count = images.length;
  const isZoomed = scale > 1.01;

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const go = useCallback((delta) => {
    if (count < 2) return;
    // wrap, so ← on the first plan lands on the last rather than dead-ending
    const next = (index + delta + count) % count;
    reset();
    setFailed(false);
    onIndexChange?.(next);
  }, [count, index, onIndexChange, reset]);

  // Reset zoom whenever the image changes — including when the caller switches
  // it from outside (the plan selector, the gallery grid). Adjusted during
  // render rather than in an effect, so the next image never paints for a frame
  // at the previous one's zoom and pan.
  const [lastIndex, setLastIndex] = useState(index);
  if (lastIndex !== index) {
    setLastIndex(index);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setFailed(false);
  }

  /** Clamp the pan so the image can never be dragged entirely off screen. */
  const clampOffset = useCallback((next, s) => {
    const stage = stageRef.current;
    if (!stage) return next;
    const { width, height } = stage.getBoundingClientRect();
    const maxX = (width * (s - 1)) / 2;
    const maxY = (height * (s - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
  }, []);

  const zoomTo = useCallback((nextScale) => {
    const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
    setScale(s);
    setOffset((o) => (s <= 1 ? { x: 0, y: 0 } : clampOffset(o, s)));
  }, [clampOffset]);

  // ---------- keyboard: navigation, zoom, close, focus trap ----------
  useEffect(() => {
    const opener = document.activeElement;

    const onKey = (e) => {
      switch (e.key) {
        case 'Escape': onClose(); return;
        case 'ArrowRight': go(1); return;
        case 'ArrowLeft': go(-1); return;
        case '+': case '=': zoomTo(scale + 0.5); return;
        case '-': case '_': zoomTo(scale - 0.5); return;
        case '0': reset(); return;
        default: break;
      }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll(FOCUSABLE);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panel.contains(document.activeElement)) {
        e.preventDefault(); first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // hides the floating header, which would otherwise sit over the viewer
    document.body.classList.add('has-modal');
    window.lenis?.stop();
    panelRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('has-modal');
      window.lenis?.start();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [onClose, go, zoomTo, scale, reset]);

  // ---------- wheel zoom ----------
  const onWheel = (e) => {
    e.preventDefault();
    zoomTo(scale - e.deltaY * 0.0022);
  };

  // ---------- pointer: drag-pan, pinch-zoom, swipe ----------
  const onPointerDown = (e) => {
    stageRef.current?.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setGesturing(true);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        mode: 'pinch',
        startDist: Math.hypot(a.x - b.x, a.y - b.y),
        startScale: scale,
      };
    } else if (pointers.current.size === 1) {
      gesture.current = {
        mode: isZoomed ? 'pan' : 'swipe',
        startX: e.clientX,
        startY: e.clientY,
        originX: offset.x,
        originY: offset.y,
      };
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;

    if (g.mode === 'pinch' && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (g.startDist > 0) zoomTo(g.startScale * (dist / g.startDist));
      return;
    }

    if (g.mode === 'pan') {
      setOffset(clampOffset(
        { x: g.originX + (e.clientX - g.startX), y: g.originY + (e.clientY - g.startY) },
        scale,
      ));
    }
  };

  const onPointerUp = (e) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);

    if (g?.mode === 'swipe' && pointers.current.size === 0) {
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      // Only a mostly-horizontal drag counts, so a vertical flick to dismiss
      // the on-screen keyboard doesn't skip a plan.
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1);
      }
    }

    if (pointers.current.size === 0) {
      gesture.current = null;
      setGesturing(false);
    } else if (pointers.current.size === 1) {
      // dropping from two fingers to one must not resume a stale pinch
      gesture.current = null;
    }
  };

  const onDoubleClick = () => (isZoomed ? reset() : zoomTo(2.4));

  if (!current) return null;

  return createPortal(
    <div
      className="image-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Image viewer'}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="image-viewer__panel" ref={panelRef} tabIndex={-1} data-lenis-prevent>
        <header className="image-viewer__bar">
          <div className="image-viewer__meta">
            {title && <span className="image-viewer__title">{title}</span>}
            {count > 1 && (
              <span className="image-viewer__counter">{index + 1} / {count}</span>
            )}
          </div>

          <div className="image-viewer__tools">
            <button type="button" onClick={() => zoomTo(scale - 0.5)} aria-label="Zoom out" disabled={scale <= MIN_SCALE}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden><path d="M5 10h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
            <span className="image-viewer__zoom" aria-live="polite">{Math.round(scale * 100)}%</span>
            <button type="button" onClick={() => zoomTo(scale + 0.5)} aria-label="Zoom in" disabled={scale >= MAX_SCALE}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden><path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
            <button type="button" onClick={reset} aria-label="Reset zoom" disabled={!isZoomed && offset.x === 0 && offset.y === 0}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M4 8V4h4M16 12v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8A6 6 0 006 5.5M4 12a6 6 0 0010 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
            <button type="button" className="image-viewer__close" onClick={onClose} aria-label="Close viewer">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
            </button>
          </div>
        </header>

        <div
          className={`image-viewer__stage ${isZoomed ? 'is-zoomed' : ''}`}
          ref={stageRef}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
        >
          {failed ? (
            <p className="image-viewer__error">This image could not be loaded.</p>
          ) : (
            <img
              src={typeof current === 'string' ? current : current.src}
              alt={(typeof current === 'string' ? '' : current.alt) || caption || title || ''}
              draggable={false}
              onError={() => setFailed(true)}
              style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                // no transition mid-gesture, or the pan lags a frame behind the finger
                transition: gesturing ? 'none' : 'transform .28s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            />
          )}

          {count > 1 && (
            <>
              <button type="button" className="image-viewer__nav image-viewer__nav--prev" onClick={() => go(-1)} aria-label="Previous image">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button type="button" className="image-viewer__nav image-viewer__nav--next" onClick={() => go(1)} aria-label="Next image">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </>
          )}
        </div>

        <footer className="image-viewer__foot">
          {(typeof current === 'object' && current.label) || caption ? (
            <span className="image-viewer__caption">
              {(typeof current === 'object' && current.label) || caption}
            </span>
          ) : <span />}
          <span className="image-viewer__hint" aria-hidden>
            Pinch or scroll to zoom · drag to pan{count > 1 ? ' · swipe to change' : ''}
          </span>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
