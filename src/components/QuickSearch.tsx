import React, { useState, useMemo } from 'react';
import { labResults } from '../data/labResults';
import { LabResultItem } from '../types/medical';
import { Search, ExternalLink, Calendar, MapPin, CheckCircle2, AlertTriangle, FileText, X } from 'lucide-react';

interface QuickSearchProps {
  onSelectResult: (result: LabResultItem) => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({
  onSelectResult,
  isOpenModal = false,
  onCloseModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(labResults.map((r) => r.category)));
    return ['all', ...cats];
  }, []);

  const filteredResults = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return labResults.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!term) return true;

      // Match parameter name, category, doctor, lab, location, or procedure keywords
      const matchParam = item.paramName.toLowerCase().includes(term);
      const matchCat = item.category.toLowerCase().includes(term);
      const matchDoc = item.doctor.toLowerCase().includes(term);
      const matchLab = item.laboratory.toLowerCase().includes(term);
      const matchVal = item.currentValue.toLowerCase().includes(term);
      const matchTab = item.physicalLocation.tab.toLowerCase().includes(term);

      // Alias matches
      const isSurgeryQuery = term.includes('cirurg') || term.includes('laudo') || term.includes('vascul');
      const isKidneyQuery = term.includes('rim') || term.includes('renal');
      const isHeartQuery = term.includes('cora') || term.includes('cardio') || term.includes('cate');

      return (
        matchParam ||
        matchCat ||
        matchDoc ||
        matchLab ||
        matchVal ||
        matchTab ||
        (isSurgeryQuery && (item.category === 'Imagem/Laudo' || item.paramName.toLowerCase().includes('laudo'))) ||
        (isKidneyQuery && item.category === 'Renal') ||
        (isHeartQuery && (item.paramName.toLowerCase().includes('cateterismo') || item.paramName.toLowerCase().includes('coronariana')))
      );
    });
  }, [searchTerm, selectedCategory]);

  const content = (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar por parâmetro (ex: ureia, creatinina, cateterismo, laudo, hiv, p168579, glicemia)..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white transition-all"
          autoFocus={isOpenModal}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'Todos os Resultados' : cat}
          </button>
        ))}
      </div>

      {/* Results Count & Quick Hint */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Encontrados: <strong className="text-slate-900 font-mono">{filteredResults.length}</strong> parâmetros / laudos
        </span>
        <span className="hidden sm:inline">
          Dica: clique em &quot;Ver Laudo / Imagem&quot; para abrir a folha exata na pasta física
        </span>
      </div>

      {/* Results List */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white max-h-[500px] overflow-y-auto">
        {filteredResults.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Nenhum resultado encontrado para &quot;<strong>{searchTerm}</strong>&quot;.
            <div className="text-xs text-slate-400 mt-1">
              Tente pesquisar termos como: ureia, creatinina, hemoglobina, cateterismo, laudo, hiv, p168579, sódio.
            </div>
          </div>
        ) : (
          filteredResults.map((item) => (
            <div
              key={item.id}
              className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                  <span className="text-slate-300">·</span>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                    {item.paramName}
                  </h4>
                </div>

                {/* Primary value display */}
                <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {item.currentValue} {item.unit}
                  </span>
                  <span className="text-xs text-slate-500">
                    (Ref: {item.referenceRange})
                  </span>
                  {item.status === 'normal' && (
                    <span className="text-xs text-emerald-700 flex items-center gap-0.5 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Normal
                    </span>
                  )}
                  {item.status === 'altered' && (
                    <span className="text-xs text-amber-700 flex items-center gap-0.5 font-medium">
                      <AlertTriangle className="w-3 h-3" /> Alterado
                    </span>
                  )}
                  {item.status === 'attention' && (
                    <span className="text-xs text-blue-700 flex items-center gap-0.5 font-medium">
                      <FileText className="w-3 h-3" /> Em processamento / Consulta Online
                    </span>
                  )}
                </div>

                {/* Metadata & Physical Location */}
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.collectionDate}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-600">{item.laboratory}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">{item.doctor}</span>
                </div>

                {/* Physical folder badge */}
                <div className="flex items-center gap-1.5 pt-1 text-xs text-cyan-900 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                  <span>
                    Pasta Física: <strong>{item.physicalLocation.tab}</strong>
                    {item.physicalLocation.block && ` · ${item.physicalLocation.block}`}
                    {` · ${item.physicalLocation.page}`}
                    {` (Item ${item.physicalLocation.itemNumber})`}
                  </span>
                </div>
              </div>

              {/* View Action Button */}
              <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0">
                <button
                  onClick={() => onSelectResult(item)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver Laudo / Folha
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full p-5 space-y-4 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pesquisa Rápida de Exames e Laudos
              </h3>
              <p className="text-xs text-slate-500">
                Localize qualquer parâmetro ou exame com a folha exata na pasta física
              </p>
            </div>
            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Pesquisa Rápida de Parâmetros e Laudos
        </h3>
        <p className="text-xs text-slate-500">
          Pesquise por nome do exame (ex: Ureia, Creatinina, Hemoglobina) ou procedimento (ex: Cateterismo, Cirurgia Vascular, Doppler, HIV)
        </p>
      </div>
      {content}
    </div>
  );
};
