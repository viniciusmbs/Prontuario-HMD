import React, { useState } from 'react';
import { Header, AppNavView } from './components/Header';
import { PatientSummaryBar } from './components/PatientSummaryBar';
import { ClinicalDossierView } from './components/ClinicalDossierView';
import { QuickSearch } from './components/QuickSearch';
import { HNMDChecklist } from './components/HNMDChecklist';
import { PhysicalFolderNav } from './components/PhysicalFolderNav';
import { ImageGalleryView } from './components/ImageGalleryView';
import { LabCredentialsView } from './components/LabCredentialsView';
import { LabEvolutionTable } from './components/LabEvolutionTable';
import { MedicationPanel } from './components/MedicationPanel';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { GitHubGuideModal } from './components/GitHubGuideModal';
import { SecurityGate } from './components/SecurityGate';
import { PrintSummary } from './components/PrintSummary';
import { EmergencyContactsModal } from './components/EmergencyContactsModal';
import { AddExamModal } from './components/AddExamModal';
import { FolderDividersModal } from './components/FolderDividersModal';
import { LabResultItem, PhysicalFolderItem, ExamImage, Medication } from './types/medical';
import { physicalFolderItems } from './data/physicalFolder';
import { labResults } from './data/labResults';
import { Search } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<AppNavView>('dossier');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [githubGuideOpen, setGithubGuideOpen] = useState(false);
  const [contactsModalOpen, setContactsModalOpen] = useState(false);
  const [addExamModalOpen, setAddExamModalOpen] = useState(false);
  const [dividersModal, setDividersModal] = useState<{
    isOpen: boolean;
    type: 'dividers' | 'labels';
  }>({
    isOpen: false,
    type: 'dividers',
  });
  const [folderInitialTab, setFolderInitialTab] = useState<1 | 2 | 3 | 4>(1);
  const [imageGalleryFilter, setImageGalleryFilter] = useState<'all' | 'cateterismo' | 'doppler'>('all');

  // Dynamic user-added exams
  const [customExams, setCustomExams] = useState<LabResultItem[]>([]);

  // Modal viewer state
  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    pages: string[];
    initialPage?: number;
    pdfPath?: string;
    doctor?: string;
    date?: string;
    location?: string;
  }>({
    isOpen: false,
    title: '',
    pages: [],
  });

  const handleOpenFolderTab = (tab: 1 | 2 | 3 | 4) => {
    setFolderInitialTab(tab);
    setActiveView('folder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGallery = (galleryId: string) => {
    if (galleryId === 'cateterismo') setImageGalleryFilter('cateterismo');
    else if (galleryId === 'doppler') setImageGalleryFilter('doppler');
    else setImageGalleryFilter('all');
    setActiveView('images');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOfficialMessage = () => {
    setViewerState({
      isOpen: true,
      title: 'Mensagem Oficial SIGAD-MB P221325Z & Despacho CFMG (Marinha do Brasil)',
      subtitle: 'Página 1: Mensagem Oficial (ALFA a DELTA) · Página 2: Despacho e-mail 3º SG Ana Barbazan',
      pages: [
        '/assets/rendered/marinha_sigad_mb_p01.png',
        '/assets/rendered/marinha_email_ana_p01.png',
      ],
      initialPage: 0,
      pdfPath: '/assets/aistudio/Procedimento_de_Alta_Complexidade_78074c58.pdf',
      doctor: 'Hospital Naval Marcílio Dias / 3º SG Ana Barbazan (CFMG)',
      date: '22/10/2026 a 26/10/2026',
      location: 'Aba 1 · Item 04 (Documento Oficial)',
    });
  };

  const handleSelectResult = (result: LabResultItem) => {
    const parentFolderItem = physicalFolderItems.find((f) => f.itemNumber === result.physicalLocation.itemNumber);
    const pages = parentFolderItem?.previewImages || [result.previewImage];
    const initialPage = result.pageNumber ? result.pageNumber - 1 : 0;

    setViewerState({
      isOpen: true,
      title: `${result.paramName}: ${result.currentValue} ${result.unit}`,
      subtitle: `${result.laboratory} · ${result.doctor}`,
      pages,
      initialPage: Math.min(Math.max(0, initialPage), pages.length - 1),
      pdfPath: result.pdfPath,
      doctor: result.doctor,
      date: result.collectionDate,
      location: `${result.physicalLocation.tab} · ${result.physicalLocation.page}`,
    });
  };

  const handleOpenDocument = (item: PhysicalFolderItem) => {
    setViewerState({
      isOpen: true,
      title: item.title,
      subtitle: item.subtitle,
      pages: item.previewImages,
      initialPage: 0,
      pdfPath: item.pdfPath,
      doctor: item.doctor,
      date: item.date,
      location: `${item.tabName} · Item ${item.itemNumber}`,
    });
  };

  const handleSelectExamImage = (img: ExamImage) => {
    setViewerState({
      isOpen: true,
      title: img.title,
      subtitle: img.projectionOrSite,
      pages: [img.imagePath],
      initialPage: 0,
      pdfPath: img.imagePath,
      doctor: img.doctor,
      date: img.date,
      location: img.institution,
    });
  };

  const handleOpenDocRef = (docRef: NonNullable<Medication['documentRef']>) => {
    setViewerState({
      isOpen: true,
      title: docRef.title,
      subtitle: `${docRef.folderTab} · Item ${docRef.itemNumber}`,
      pages: [docRef.previewImage],
      initialPage: 0,
      pdfPath: docRef.pdfPath,
      location: docRef.folderTab,
    });
  };

  const handleOpenBlock = (blockNum: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (blockNum === 1) {
      setViewerState({
        isOpen: true,
        title: 'Bloco 1: Laudo de Admissão — Dr. Lucas Klier (5 Páginas)',
        subtitle: 'Santa Casa de Misericórdia de Juiz de Fora · Dr. Lucas Klier Silva',
        pages: [
          '/assets/rendered/lab_santacasa_klier_5p_p01.png',
          '/assets/rendered/lab_santacasa_klier_5p_p02.png',
          '/assets/rendered/lab_santacasa_klier_5p_p03.png',
          '/assets/rendered/lab_santacasa_klier_5p_p04.png',
          '/assets/rendered/lab_santacasa_klier_5p_p05.png',
        ],
        initialPage: 0,
        pdfPath: '/assets/aistudio/laudo_laboratorial_dr_lucas_klier_santacasa_5p.pdf',
        doctor: 'Dr. Lucas Klier Silva',
        date: '20/09/2026',
        location: 'Aba 3 · Item 12 (Bloco 1)',
      });
    } else if (blockNum === 2) {
      setViewerState({
        isOpen: true,
        title: 'Bloco 2: Cirurgia Vascular / Angiologia — Dr. Luiz Kingma (7 Páginas)',
        subtitle: 'Santa Casa de Misericórdia de Juiz de Fora · Dr. Luiz Kingma Lanziotti',
        pages: [
          '/assets/rendered/lab_santacasa_kingma_7p_p01.png',
          '/assets/rendered/lab_santacasa_kingma_7p_p02.png',
          '/assets/rendered/lab_santacasa_kingma_7p_p03.png',
          '/assets/rendered/lab_santacasa_kingma_7p_p04.png',
          '/assets/rendered/lab_santacasa_kingma_7p_p05.png',
          '/assets/rendered/lab_santacasa_kingma_7p_p06.png',
          '/assets/rendered/lab_santacasa_kingma_7p_p07.png',
        ],
        initialPage: 0,
        pdfPath: '/assets/aistudio/laudo_laboratorial_dr_luiz_kingma_santacasa_7p.pdf',
        doctor: 'Dr. Luiz Kingma Lanziotti (Angiologia / Cirurgia Vascular)',
        date: '24/09/2026',
        location: 'Aba 3 · Item 12 (Bloco 2)',
      });
    } else if (blockNum === 3) {
      setViewerState({
        isOpen: true,
        title: 'Bloco 3: Exames Laboratoriais e Sorologias — Dr. Túlio (8 Páginas)',
        subtitle: 'Laboratório Carlos Chagas · Solicitante: Tulio Vieira Mendes (O.S. 004-67872-36)',
        pages: [
          '/assets/rendered/lab_carlos_chagas_tulio_8p_p01.png',
          '/assets/rendered/lab_carlos_chagas_tulio_8p_p02.png',
          '/assets/rendered/lab_carlos_chagas_tulio_8p_p03.png',
          '/assets/rendered/lab_carlos_chagas_tulio_8p_p04.png',
          '/assets/rendered/lab_carlos_chagas_tulio_8p_p05.png',
          '/assets/rendered/lab_carlos_chagas_tulio_8p_p06.png',
          '/assets/rendered/lab_carlos_chagas_tulio_8p_p07.png',
          '/assets/rendered/lab_carlos_chagas_tulio_8p_p08.png',
        ],
        initialPage: 0,
        pdfPath: '/assets/aistudio/11_Protocolo_de_Resultados_de_Exames_Laboratoriais_Tulio_a8028bee.pdf',
        doctor: 'Dr. Túlio Vieira Mendes (Maj. Túlio)',
        date: '29/10/2026 a 04/11/2026',
        location: 'Aba 3 · Item 12 (Bloco 3)',
      });
    } else if (blockNum === 4) {
      setViewerState({
        isOpen: true,
        title: 'Bloco 4: Protocolo Bioquímico Geral e Urina — Dra. Cecília (9 Páginas)',
        subtitle: 'Laboratório Carlos Chagas · Dra. Cecília Faria Wolkartt (O.S. 004-67872-36)',
        pages: [
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p01.png',
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p02.png',
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p03.png',
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p04.png',
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p05.png',
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p06.png',
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p07.png',
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p08.png',
          '/assets/rendered/lab_carlos_chagas_cecilia_9p_p09.png',
        ],
        initialPage: 0,
        pdfPath: '/assets/aistudio/11_Protocolo_de_Resultados_de_Exames_Laboratoriais__ceilia_f5c95ee4.pdf',
        doctor: 'Dra. Cecília Faria Wolkartt',
        date: '29/10/2026',
        location: 'Aba 3 · Item 11 / Item 12 (Bloco 4)',
      });
    } else if (blockNum === 5) {
      setViewerState({
        isOpen: true,
        title: 'Bloco 5: Imunologia CD4 e Carga Viral HIV — Dra. Cecília (2 Páginas)',
        subtitle: 'Laboratório Carlos Chagas · Dra. Cecília Faria Wolkartt (O.S. 004-67856-84)',
        pages: [
          '/assets/rendered/lab_carlos_chagas_ceciliacargaviral_2p_p01.png',
          '/assets/rendered/lab_carlos_chagas_ceciliacargaviral_2p_p02.png',
        ],
        initialPage: 0,
        pdfPath: '/assets/aistudio/laudo_cargaviral_cd4_cecilia_2p.pdf',
        doctor: 'Dra. Cecília Faria Wolkartt (Infectologista)',
        date: '13/10 a 23/10/2026',
        location: 'Aba 3 · Item 09 / Item 12 (Bloco 5)',
      });
    } else {
      setViewerState({
        isOpen: true,
        title: 'Bloco 6: Dr. Arthur Valdier (HGeJF) — Perfil Hormonal, PSA e Metabólico (9 Páginas)',
        subtitle: 'Hospital Geral de Juiz de Fora · Solicitação Dr. Arthur Valdier · Atendimento 00104618/014',
        pages: [
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p01.png',
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p02.png',
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p03.png',
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p04.png',
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p05.png',
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p06.png',
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p07.png',
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p08.png',
          '/assets/rendered/lab_dr_valdier_hormonal_9p_p09.png',
        ],
        initialPage: 7, // Opens directly on Page 8 (Hormonal / Estradiol 86,3) or page 1
        pdfPath: '/assets/aistudio/11_Protocolo_de_Resultados_de_Exames_Laboratoriais__etraiol_d7833244.pdf',
        doctor: 'Dr. Arthur Valdier',
        date: '20/05/2026',
        location: 'Aba 3 · Item 12 (Bloco 6)',
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLocked) {
    return <SecurityGate onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Sticky & Compact (Sem duplicidades, com ícones ajustados) */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSearch={() => setSearchModalOpen(true)}
        onPrint={handlePrint}
        onAddExam={() => setAddExamModalOpen(true)}
      />

      {/* Patient Summary Demographics Bar */}
      <PatientSummaryBar
        onOpenCredentials={() => {
          setActiveView('credentials');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
        {/* DOSSIÊ CLÍNICO EXECUTIVO (Default na frente conforme solicitado) */}
        {activeView === 'dossier' && (
          <ClinicalDossierView
            onOpenFolder={() => {
              setActiveView('folder');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChecklist={() => {
              setActiveView('checklist');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenOfficialMessage={handleOpenOfficialMessage}
            onOpenCateterismo={() => handleOpenGallery('cateterismo')}
            onOpenInfecto={() => {
              const item8 = physicalFolderItems.find((i) => i.itemNumber === 8);
              if (item8) handleOpenDocument(item8);
            }}
          />
        )}

        {/* PASTA FÍSICA (4 ABAS & 18 ITENS NUMERADOS) */}
        {activeView === 'folder' && (
          <PhysicalFolderNav
            initialTab={folderInitialTab}
            onOpenDocument={handleOpenDocument}
            onOpenGallery={handleOpenGallery}
            onOpenDividersModal={(type) => setDividersModal({ isOpen: true, type })}
            onOpenBlock={handleOpenBlock}
          />
        )}

        {/* CHECKLIST HNMD (9 DE 10 EXIGÊNCIAS) */}
        {activeView === 'checklist' && (
          <HNMDChecklist
            onSelectResult={handleSelectResult}
            onOpenFolderTab={handleOpenFolderTab}
            onOpenOfficialMessage={handleOpenOfficialMessage}
            onOpenSpecificLaudo={(title, pages, pdfPath) =>
              setViewerState({
                isOpen: true,
                title,
                pages,
                initialPage: 0,
                pdfPath,
              })
            }
          />
        )}

        {/* PESQUISA DE EXAMES */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            <QuickSearch onSelectResult={handleSelectResult} />
          </div>
        )}

        {/* EVOLUÇÃO TEMPORAL */}
        {activeView === 'evolution' && (
          <LabEvolutionTable onSelectResult={handleSelectResult} />
        )}

        {/* LABORATÓRIOS & SENHAS DOS PORTAIS */}
        {activeView === 'credentials' && (
          <LabCredentialsView
            onViewImage={(imagePath, title) =>
              setViewerState({
                isOpen: true,
                title,
                pages: [imagePath],
                initialPage: 0,
                pdfPath: imagePath,
              })
            }
          />
        )}

        {/* MEDICAÇÕES EM USO */}
        {activeView === 'medications' && (
          <div className="space-y-6">
            <MedicationPanel onOpenDocRef={handleOpenDocRef} />
          </div>
        )}

        {/* IMAGENS E LAUDOS MÉDICOS */}
        {activeView === 'images' && (
          <ImageGalleryView
            activeFilter={imageGalleryFilter}
            onSelectImage={handleSelectExamImage}
            onOpenLaudo={(laudoPath, title) =>
              setViewerState({
                isOpen: true,
                title,
                subtitle: 'Laudo Médico Original Assinado',
                pages: [laudoPath],
                initialPage: 0,
                pdfPath: laudoPath,
              })
            }
          />
        )}
      </main>

      {/* Floating search button on mobile */}
      <div className="md:hidden fixed bottom-5 right-5 z-20">
        <button
          onClick={() => setSearchModalOpen(true)}
          className="w-12 h-12 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center hover:bg-slate-800 transition-colors"
          title="Buscar exame"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="font-semibold text-slate-800">
              Dossiê Clínico e Cirúrgico Vascular — Vinícius Paes Mendes Pereira
            </span>
            <div className="text-slate-400">
              Capitania Fluvial de Minas Gerais (CFMG) · Hospital Naval Marcílio Dias (HNMD)
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setGithubGuideOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Instruções GitHub / Vercel
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handlePrint}
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Imprimir Resumo Executivo
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsLocked(true)}
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Bloquear com PIN
            </button>
          </div>
        </div>
      </footer>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={viewerState.isOpen}
        onClose={() => setViewerState((prev) => ({ ...prev, isOpen: false }))}
        title={viewerState.title}
        subtitle={viewerState.subtitle}
        pages={viewerState.pages}
        initialPage={viewerState.initialPage}
        pdfPath={viewerState.pdfPath}
        doctor={viewerState.doctor}
        date={viewerState.date}
        location={viewerState.location}
      />

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <QuickSearch
          isOpenModal={true}
          onCloseModal={() => setSearchModalOpen(false)}
          onSelectResult={(res) => {
            setSearchModalOpen(false);
            handleSelectResult(res);
          }}
        />
      )}

      {/* GitHub & Vercel Guide Modal */}
      <GitHubGuideModal
        isOpen={githubGuideOpen}
        onClose={() => setGithubGuideOpen(false)}
      />

      {/* Emergency Contacts Modal */}
      <EmergencyContactsModal
        isOpen={contactsModalOpen}
        onClose={() => setContactsModalOpen(false)}
      />

      {/* Add Exam Modal */}
      <AddExamModal
        isOpen={addExamModalOpen}
        onClose={() => setAddExamModalOpen(false)}
        onAddExam={(newExam) => {
          setCustomExams((prev) => [newExam, ...prev]);
          labResults.unshift(newExam);
        }}
      />

      {/* Folder Dividers Modal */}
      <FolderDividersModal
        isOpen={dividersModal.isOpen}
        onClose={() => setDividersModal({ isOpen: false, type: 'dividers' })}
        type={dividersModal.type}
      />

      {/* Printable Sheet */}
      <PrintSummary />
    </div>
  );
}
