import React from 'react';
import { medications } from '../data/medications';
import { Medication } from '../types/medical';
import { Pill, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface MedicationPanelProps {
  onOpenDocRef: (docRef: NonNullable<Medication['documentRef']>) => void;
}

export const MedicationPanel: React.FC<MedicationPanelProps> = ({ onOpenDocRef }) => {
  const categories = [
    {
      key: 'vascular' as const,
      title: 'B) Tratamento Vascular & Prevenção Antitrombótica',
      doctor: 'Dr. Luiz Kingma Lanziotti (Cirurgia Vascular - Santa Casa JF)',
      desc: 'Proteção endotelial, inibição plaquetária e dilatação arteriolar periférica.',
      badgeClass: 'bg-blue-50 text-blue-900 border-blue-200',
    },
    {
      key: 'analgesia' as const,
      title: 'A) Analgesia & Relaxamento Muscular',
      doctor: 'Maj. Túlio Vieira Mendes (HGeJF - Exército Brasileiro)',
      desc: 'Alívio da dor isquêmica em queimação e controle de espasmos musculares no membro direito.',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      key: 'hiv' as const,
      title: 'C) Esquema Antirretroviral / Infectologia (Manter Ininterruptamente)',
      doctor: 'Dra. Cecília Faria Wolkartt (Infectologia)',
      desc: 'Terapia antirretroviral contínua há >30 anos. Manter no pré e pós-operatório sem interrupções.',
      badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="text-xs font-semibold text-cyan-800 uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-cyan-700" />
            Lista Completa de Medicamentos em Uso Recente
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
            Prescrições em Uso e Recomendações Perioperatórias
          </h3>
          <p className="text-xs text-slate-500">
            Dossiê conferido com os receituários originais e formulário oficial SICLOM.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          Sem interações medicamentosas adversas (atestado por Infectologia)
        </div>
      </div>

      {/* 3 Categories Blocks */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const items = medications.filter((m) => m.category === cat.key);
          return (
            <div key={cat.key} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${cat.badgeClass}`}>
                    {cat.title.split(') ')[0]}
                  </span>
                  <span>{cat.title.split(') ')[1]}</span>
                </h4>
                <span className="text-[11px] text-slate-500">{cat.doctor}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((med) => (
                  <div
                    key={med.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900 tracking-tight">
                          {med.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                          {med.dosage}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 mt-1">
                        Posologia: <span className="font-semibold text-slate-900">{med.posology}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {med.notes}
                      </p>
                    </div>

                    {med.documentRef && (
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {med.documentRef.folderTab} · Item {med.documentRef.itemNumber}
                        </span>
                        <button
                          onClick={() => onOpenDocRef(med.documentRef!)}
                          className="font-semibold text-cyan-800 hover:text-cyan-950 flex items-center gap-1 transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Ver Receita</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Recomendação da Infectologista (Dra. Cecília):</strong> Manter rigorosamente o esquema antirretroviral (Darunavir + Dolutegravir + Ritonavir) no pré e pós-operatório. Orientação de suspensão ou ajuste do AAS/Cilostazol deve ser dada privativamente pelo cirurgião vascular e anestesista do HNMD conforme a técnica operatória.
        </div>
      </div>
    </div>
  );
};
