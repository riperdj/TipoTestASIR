import React, { useCallback, useState } from 'react';
import { Upload, FileText, Sparkles, Clipboard, Check, HelpCircle, Layers } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, targetCount?: number) => void;
  onTextSubmit?: (text: string, title: string, targetCount?: number) => void;
  onLoadSample?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onTextSubmit, onLoadSample }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [targetCount, setTargetCount] = useState<number | undefined>(undefined);
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.docx') || file.name.endsWith('.txt')) {
        onFileSelect(file, targetCount);
      } else {
        alert("Por favor, sube un archivo de Word (.docx) o de texto (.txt)");
      }
    }
  }, [onFileSelect, targetCount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0], targetCount);
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    if (onTextSubmit) {
      onTextSubmit(pastedText, pastedTitle || "Texto pegado", targetCount);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Tab Switcher: Subir Documento vs Pegar Texto */}
      <div className="flex items-center justify-center p-1 bg-slate-200/70 rounded-2xl max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'upload'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Subir Documento Word</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'paste'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span>Pegar Texto / Apuntes</span>
        </button>
      </div>

      {/* Target Question Count Preference */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Cantidad de preguntas a extraer / generar:
            </span>
            <span className="text-[11px] text-slate-400">
              (También podrás elegir cuántas responder antes de empezar el test)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: 'Auto (15-25)', val: undefined },
            { label: '10 preg.', val: 10 },
            { label: '15 preg.', val: 15 },
            { label: '20 preg.', val: 20 },
            { label: '30 preg.', val: 30 },
          ].map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setTargetCount(item.val)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                targetCount === item.val
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div>
          <label 
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
              dragActive 
                ? "border-blue-500 bg-blue-50/80 shadow-inner scale-[1.01]" 
                : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/70 shadow-sm"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-3.5 text-blue-600 shadow-sm">
                <Upload className="w-8 h-8" />
              </div>
              <p className="mb-1 text-lg font-bold text-slate-800">
                Selecciona o arrastra tu archivo Word (.docx)
              </p>
              <p className="text-sm text-slate-500 max-w-md">
                Apuntes, temarios, resúmenes, leyes o exámenes.
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".docx,.txt"
              onChange={handleChange}
            />
          </label>
        </div>
      ) : (
        <form onSubmit={handlePasteSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Título o tema del documento (opcional)
            </label>
            <input
              type="text"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
              placeholder="Ej: Tema 4 - El Poder Judicial en la Constitución"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Texto o apuntes para analizar
            </label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Pega aquí cualquier texto de estudio, temario, leyes o preguntas..."
              className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!pastedText.trim()}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-all"
          >
            Analizar texto y generar examen tipo test
          </button>
        </form>
      )}

      {/* Demo test shortcut */}
      {onLoadSample && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>¿Sin documento a mano? Probar con test de ejemplo (20 preguntas)</span>
          </button>
        </div>
      )}
      
      {/* Explanatory cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <h3 className="text-slate-900 font-bold mb-1.5 text-sm flex items-center">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs mr-2 font-black">✓</span>
            Cualquier documento o texto
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Puedes subir apuntes normales, temarios, resúmenes o leyes. La IA analiza los conceptos y <strong>crea preguntas tipo test desde cero</strong> con 4 opciones fundamentadas.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-left">
          <h3 className="text-slate-900 font-bold mb-1.5 text-sm flex items-center">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs mr-2 font-black">★</span>
            Exámenes con o sin solución
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Si tu documento ya incluye preguntas pero no tienen respuestas marcadas, la IA <strong>deduce y resuelve la respuesta correcta</strong>. Si estaban resaltadas, también las respeta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
