import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight, FileText, Maximize2 } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  pages: string[];
  initialPage?: number;
  pdfPath?: string;
  doctor?: string;
  date?: string;
  location?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  pages,
  initialPage = 0,
  pdfPath,
  doctor,
  date,
  location,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [invertContrast, setInvertContrast] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentPageIndex(Math.min(Math.max(0, initialPage), Math.max(0, pages.length - 1)));
      setZoomLevel(1);
      setRotation(0);
      setInvertContrast(false);
    }
  }, [isOpen, initialPage, pages]);

  if (!isOpen || pages.length === 0) return null;

  const currentImage = pages[currentPageIndex] || pages[0];

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
    setInvertContrast(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl h-[94vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                Folha {currentPageIndex + 1} de {pages.length}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {title}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 pt-0.5">
              {subtitle && <span>{subtitle}</span>}
              {doctor && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{doctor}</span>
                </>
              )}
              {date && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{date}</span>
                </>
              )}
              {location && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-300">{location}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Zoom Controls */}
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.2))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reduzir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 min-w-[45px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.2))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Rotate */}
            <button
              onClick={handleRotate}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Girar 90 graus"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Contrast invert */}
            <button
              onClick={() => setInvertContrast((c) => !c)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                invertContrast ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Inverter contraste (radiologia)"
            >
              Negativo
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              Ajustar
            </button>

            {/* Download PDF button */}
            {pdfPath && (
              <a
                href={pdfPath}
                download
                className="px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                title="Baixar arquivo original assinado"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Original</span>
              </a>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 bg-slate-950/90 overflow-auto flex items-center justify-center p-4 relative select-none">
          <div
            className="transition-transform duration-150 origin-center max-w-full max-h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              filter: invertContrast ? 'invert(1) hue-rotate(180deg)' : 'none',
            }}
          >
            <img
              src={currentImage}
              alt={`${title} - Página ${currentPageIndex + 1}`}
              className="max-h-[80vh] w-auto object-contain rounded-md shadow-2xl bg-white"
            />
          </div>

          {/* Navigation Arrows for multi-page documents */}
          {pages.length > 1 && (
            <>
              <button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPageIndex === pages.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Bottom Pagination Strip (if multi-page) */}
        {pages.length > 1 && (
          <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium mr-2">Páginas:</span>
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(idx)}
                className={`px-3 py-1 rounded-md font-mono text-xs transition-colors ${
                  currentPageIndex === idx
                    ? 'bg-cyan-700 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Pág {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
