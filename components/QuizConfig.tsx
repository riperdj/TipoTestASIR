import React, { useState, useMemo } from 'react';
import { Question, QuizConfig as QuizConfigType } from '../types';
import { 
  Sliders, 
  Play, 
  Shuffle, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ListOrdered,
  Eye
} from 'lucide-react';

interface QuizConfigProps {
  totalQuestionsCount: number;
  fileName: string;
  allQuestions: Question[];
  onStart: (config: QuizConfigType) => void;
  onCancel: () => void;
}

export const QuizConfig: React.FC<QuizConfigProps> = ({
  totalQuestionsCount,
  fileName,
  allQuestions,
  onStart,
  onCancel,
}) => {
  // Default question count: 10 if total >= 10, else total
  const defaultCount = Math.min(10, totalQuestionsCount);
  const [questionCount, setQuestionCount] = useState<number>(defaultCount);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [instantFeedback, setInstantFeedback] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Compute preset choices based on total available questions
  const presets = useMemo(() => {
    const list = [5, 10, 15, 20, 25, 30, 40, 50].filter(n => n < totalQuestionsCount);
    return list;
  }, [totalQuestionsCount]);

  const handleCountChange = (val: number) => {
    const bounded = Math.max(1, Math.min(totalQuestionsCount, val));
    setQuestionCount(bounded);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      questionCount,
      shuffleQuestions,
      shuffleOptions,
      instantFeedback,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Document Overview Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Documento procesado
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 truncate max-w-xs sm:max-w-md mt-0.5">
                {fileName || "Documento Word"}
              </h2>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between">
            <span className="text-xs font-medium text-slate-400">Total preguntas</span>
            <span className="text-2xl font-extrabold text-blue-600">{totalQuestionsCount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          {/* Question Count Selector Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Número de preguntas a realizar
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Elige cuántas preguntas del documento quieres incluir en este test
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-blue-600">{questionCount}</span>
                <span className="text-xs font-medium text-slate-400 block">de {totalQuestionsCount}</span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="pt-2">
              <input
                type="range"
                min={1}
                max={totalQuestionsCount}
                value={questionCount}
                onChange={(e) => handleCountChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium px-1 mt-1">
                <span>1 pregunta</span>
                <span>{Math.round(totalQuestionsCount / 2)} preg.</span>
                <span>{totalQuestionsCount} (Todas)</span>
              </div>
            </div>

            {/* Stepper and Direct Input */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCountChange(questionCount - 5)}
                disabled={questionCount <= 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleCountChange(questionCount - 1)}
                disabled={questionCount <= 1}
                className="w-10 h-10 rounded-xl border border-slate-200 text-base font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
              >
                -
              </button>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={totalQuestionsCount}
                  value={questionCount}
                  onChange={(e) => handleCountChange(parseInt(e.target.value) || 1)}
                  className="w-20 h-10 text-center font-black text-lg text-slate-800 border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCountChange(questionCount + 1)}
                disabled={questionCount >= totalQuestionsCount}
                className="w-10 h-10 rounded-xl border border-slate-200 text-base font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => handleCountChange(questionCount + 5)}
                disabled={questionCount >= totalQuestionsCount}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                +5
              </button>
            </div>

            {/* Presets Quick Chips */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Accesos rápidos:</span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuestionCount(preset)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      questionCount === preset
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {preset} preg.
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setQuestionCount(totalQuestionsCount)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    questionCount === totalQuestionsCount
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Todas ({totalQuestionsCount})
                </button>
              </div>
            </div>
          </div>

          {/* Test Configuration Options */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Modo y configuración del examen
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Randomize Questions */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 select-none ${
                  shuffleQuestions 
                    ? "border-blue-500 bg-blue-50/50" 
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                    <Shuffle className="w-3.5 h-3.5 text-blue-600" />
                    Preguntas aleatorias
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selecciona y ordena las preguntas al azar en lugar de seguir el orden del Word
                  </p>
                </div>
              </label>

              {/* Shuffle Options */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 select-none ${
                  shuffleOptions 
                    ? "border-blue-500 bg-blue-50/50" 
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                    <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                    Mezclar respuestas
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cambia de posición las opciones A, B, C y D en cada pregunta
                  </p>
                </div>
              </label>
            </div>

            {/* Instant Feedback vs Standard Mode */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    instantFeedback ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {instantFeedback ? <CheckCircle2 className="w-5 h-5" /> : <ListOrdered className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">
                      {instantFeedback ? "Modo Práctica (Corrección inmediata)" : "Modo Examen Estándar"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {instantFeedback 
                        ? "Te muestra al instante si has acertado o fallado cada pregunta" 
                        : "Respondes todas las preguntas y ves la nota y corrección al final"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInstantFeedback(!instantFeedback)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    instantFeedback 
                      ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {instantFeedback ? "Activado" : "Activar"}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className="w-full sm:flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-base flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Comenzar Examen ({questionCount} {questionCount === 1 ? 'pregunta' : 'preguntas'})</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 text-sm transition-colors"
            >
              Cambiar documento
            </button>
          </div>
        </form>
      </div>

      {/* Collapsible Questions Preview */}
      {allQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-bold text-slate-700">
                Ver lista completa de preguntas extraídas ({allQuestions.length})
              </span>
            </div>
            {showPreview ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showPreview && (
            <div className="p-6 pt-0 border-t border-slate-100 max-h-96 overflow-y-auto space-y-4">
              <p className="text-xs text-slate-500 mt-3 mb-2">
                Revisa las preguntas y respuestas generadas a partir del contenido del documento:
              </p>
              {allQuestions.map((q, idx) => (
                <div key={q.id || idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <p className="font-bold text-slate-800 mb-1.5">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-1 pl-3">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswerIndex;
                      return (
                        <div 
                          key={optIdx} 
                          className={`py-0.5 px-2 rounded ${
                            isCorrect 
                              ? "bg-emerald-100/90 text-emerald-950 font-semibold border border-emerald-300 inline-block mr-2 my-0.5" 
                              : "text-slate-600"
                          }`}
                        >
                          <span className="font-mono text-slate-400 mr-1.5">
                            {String.fromCharCode(65 + optIdx)})
                          </span>
                          {opt}
                          {isCorrect && (
                            <span className="ml-1.5 text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-md font-bold">
                              ✓ Correcta
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizConfig;
