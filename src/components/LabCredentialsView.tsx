import React, { useState } from 'react';
import { labPortals } from '../data/labPortals';
import { Copy, Check, ExternalLink, Key, ShieldCheck, Phone, Eye, Share2 } from 'lucide-react';

interface LabCredentialsViewProps {
  onViewImage?: (imagePath: string, title: string) => void;
}

export const LabCredentialsView: React.FC<LabCredentialsViewProps> = ({ onViewImage }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = () => {
    const text = `*DOSSIÊ CLÍNICO VASCULAR - PORTAIS & SENHAS DE ACESSO ONLINE*
Paciente: Vinícius Paes Mendes Pereira (NIP: 86679619 | CPF: 862.278.156-91)
Destino: Hospital Naval Marcílio Dias (HNMD)

1. NOVO EXAME PENDENTE - CARLOS CHAGAS (HIV / VDRL / TESTOSTERONA / TOXO):
Portal: https://labcarloschagas.com.br
Protocolo / Login: P168579
Senha Oficial: Oa#P28nT (ou m4-QQywm)
Previsão de Resultado: 04/11/2026 às 17:00

2. ROTINA PRÉ-OPERATÓRIA - CARLOS CHAGAS (Hemograma, Ureia, Creatinina, EAS, CD4/CV):
Portal: https://labcarloschagas.com.br
CPF: 862.278.156-91
O.S.: 004-67872-36 | O.S. CD4/CV: 004-67856-84

3. SANTA CASA DE JUIZ DE FORA (Cateterismo CATE 88181, Doppler, Relatório Vascular):
Portal: https://santacasajf.org.br
Prontuário: 91226818
Atendimento: 4945339
Senha: 60613938

4. ULTRIMAGEM DIAGNÓSTICOS (Angiotomografia Aorta Abdominal e Torácica):
Portal: https://juizdefora.ultrimagem.com.br
Nº de Ordem: 471034
Senha: 8471034
Protocolos: 1001 1636599 / 1001 1636589

5. HOSPITAL GERAL DE JUIZ DE FORA (HGeJF - Exército / LAC):
Portal: https://www.laudoonline.com.br/hgejf
Login: 00104618
Senha: 18538237`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Copy All Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-700" />
            Portais de Laboratórios & Credenciais Médicas
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Acesso Online Direto aos Laudos Oficiais e Exames Pendentes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            A equipe médica do HNMD pode consultar e baixar diretamente os laudos originais dos sistemas dos laboratórios.
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs shrink-0 self-start sm:self-center"
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copiado com Sucesso!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Copiar Todas as Senhas (WhatsApp)</span>
            </>
          )}
        </button>
      </div>

      {/* SPECIAL HIGHLIGHT CARD: Novo Protocolo Carlos Chagas (Ticket com foto) */}
      {labPortals
        .filter((p) => p.isSpecialNotice)
        .map((portal) => (
          <div
            key={portal.id}
            className="bg-amber-50/70 border-2 border-amber-300 rounded-xl p-5 shadow-xs relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row gap-5 items-start">
              {/* Ticket Photo Preview */}
              {portal.ticketImage && (
                <div className="w-full sm:w-64 shrink-0 bg-white border border-amber-200 rounded-lg p-2 shadow-xs">
                  <div className="relative group cursor-pointer" onClick={() => onViewImage && onViewImage(portal.ticketImage!, 'Comprovante Oficial de Coleta - Carlos Chagas (P168579)')}>
                    <img
                      src={portal.ticketImage}
                      alt="Comprovante Carlos Chagas P168579"
                      className="w-full h-44 object-cover rounded-md border border-slate-200"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md text-white text-xs font-medium gap-1.5">
                      <Eye className="w-4 h-4" />
                      Clique para Ampliar Foto
                    </div>
                  </div>
                  <div className="text-[11px] text-center text-slate-500 font-medium mt-1.5">
                    Foto do comprovante físico de coleta
                  </div>
                </div>
              )}

              {/* Protocol & Credentials details */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Novo Exame / Coleta Recente (Novembro 2026)
                  </span>
                  <span className="text-xs text-slate-500">Convênio Marinha do Brasil</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {portal.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {portal.purpose}
                  </p>
                </div>

                {/* Key-Value Credentials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {/* Protocol */}
                  <div className="bg-white border border-amber-200 rounded-lg p-3">
                    <div className="text-[11px] text-slate-500 font-medium">Protocolo / Login</div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-base font-bold font-mono text-slate-900">
                        {portal.login}
                      </span>
                      <button
                        onClick={() => handleCopy(portal.login, 'special-login')}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Copiar protocolo"
                      >
                        {copiedKey === 'special-login' ? (
                          <Check className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password 1 */}
                  <div className="bg-white border border-amber-200 rounded-lg p-3">
                    <div className="text-[11px] text-slate-500 font-medium">Senha Oficial (Comprovante)</div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-base font-bold font-mono text-amber-950">
                        {portal.password}
                      </span>
                      <button
                        onClick={() => handleCopy(portal.password || '', 'special-pwd-1')}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Copiar senha"
                      >
                        {copiedKey === 'special-pwd-1' ? (
                          <Check className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password 2 (Alternative) */}
                  <div className="bg-white border border-amber-200 rounded-lg p-3">
                    <div className="text-[11px] text-slate-500 font-medium">Senha Anotada (Alternativa)</div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-base font-bold font-mono text-slate-900">
                        m4-QQywm
                      </span>
                      <button
                        onClick={() => handleCopy('m4-QQywm', 'special-pwd-2')}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Copiar senha anotada"
                      >
                        {copiedKey === 'special-pwd-2' ? (
                          <Check className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Previsões e Link */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600">
                  <div>
                    {portal.notes}
                  </div>
                  <a
                    href={portal.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir Portal Carlos Chagas
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Grid of the remaining 4 clinical portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {labPortals
          .filter((p) => !p.isSpecialNotice)
          .map((portal) => (
            <div
              key={portal.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      {portal.name}
                    </h3>
                    <div className="text-xs text-slate-500">{portal.institution}</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {portal.purpose}
                </p>

                {/* Credentials list */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 space-y-2 text-xs">
                  {portal.login && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-medium">Login / Usuário / CPF:</span>
                      <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-900">
                        <span>{portal.login}</span>
                        <button
                          onClick={() => handleCopy(portal.login, `${portal.id}-login`)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Copiar login"
                        >
                          {copiedKey === `${portal.id}-login` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {portal.password && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-medium">Senha:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                        <span>{portal.password}</span>
                        <button
                          onClick={() => handleCopy(portal.password || '', `${portal.id}-pwd`)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Copiar senha"
                        >
                          {copiedKey === `${portal.id}-pwd` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {portal.additionalCredentials?.map((cred, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                      <span className="text-slate-500">{cred.label}:</span>
                      <div className="flex items-center gap-1.5 font-mono font-medium text-slate-800">
                        <span>{cred.value}</span>
                        <button
                          onClick={() => handleCopy(cred.value, `${portal.id}-cred-${idx}`)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title={`Copiar ${cred.label}`}
                        >
                          {copiedKey === `${portal.id}-cred-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Phone and Portal Button */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1 text-slate-500 font-medium">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{portal.phone}</span>
                </div>

                <a
                  href={portal.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Acessar Portal
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
