import React, { useState } from 'react';
import { AppStep, Question, QuizConfig as QuizConfigType } from './types';
import { extractDocxContent } from './services/docxProcessor';
import { parseQuizContent } from './services/geminiService';
import FileUpload from './components/FileUpload';
import QuizConfig from './components/QuizConfig';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { SAMPLE_QUESTIONS } from './data/sampleQuestions';
import { BrainCircuit, AlertCircle, FileQuestion, Sliders, ArrowLeft, RotateCcw } from 'lucide-react';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQuestionOptions(q: Question): Question {
  const correctOptionText = q.options[q.correctAnswerIndex];
  const shuffledOptions = shuffleArray(q.options);
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
  return {
    ...q,
    options: shuffledOptions,
    correctAnswerIndex: newCorrectIndex >= 0 ? newCorrectIndex : q.correctAnswerIndex,
  };
}

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [currentConfig, setCurrentConfig] = useState<QuizConfigType>({
    questionCount: 10,
    shuffleQuestions: true,
    shuffleOptions: false,
    instantFeedback: false,
  });
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Analizando documento...");
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File, targetCount?: number) => {
    setLoading(true);
    setError(null);
    setFileName(file.name);
    setStep(AppStep.PROCESSING);
    setLoadingMessage("Leyendo y extrayendo contenido del documento...");

    try {
      // 1. Extract content from Word / text
      const rawText = await extractDocxContent(file);
      
      if (!rawText.trim()) {
        throw new Error("El archivo no contiene texto legible.");
      }

      setLoadingMessage("Analizando temas y generando preguntas tipo test con IA...");

      // 2. Parse with Gemini (without requiring marked answers)
      const parsedQuestions = await parseQuizContent(rawText, targetCount);
      
      if (parsedQuestions.length === 0) {
        throw new Error("No se pudieron generar o detectar preguntas a partir del documento. Asegúrate de que tenga suficiente contenido textual.");
      }

      setAllQuestions(parsedQuestions);
      setStep(AppStep.CONFIG);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error inesperado al procesar el archivo.");
      setStep(AppStep.UPLOAD);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (text: string, title: string, targetCount?: number) => {
    setLoading(true);
    setError(null);
    setFileName(title || "Texto / Apuntes");
    setStep(AppStep.PROCESSING);
    setLoadingMessage("Analizando texto y generando preguntas tipo test...");

    try {
      const parsedQuestions = await parseQuizContent(text, targetCount);
      
      if (parsedQuestions.length === 0) {
        throw new Error("No se pudieron generar preguntas a partir del texto introducido. Prueba con un texto más extenso.");
      }

      setAllQuestions(parsedQuestions);
      setStep(AppStep.CONFIG);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al procesar el texto.");
      setStep(AppStep.UPLOAD);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setError(null);
    setFileName("examen_constitucion_y_cultura_general.docx");
    setAllQuestions(SAMPLE_QUESTIONS);
    setStep(AppStep.CONFIG);
  };

  const handleStartQuiz = (config: QuizConfigType) => {
    setCurrentConfig(config);

    // 1. Prepare questions: shuffle or take in original order
    let pool = [...allQuestions];
    if (config.shuffleQuestions) {
      pool = shuffleArray(pool);
    }

    // 2. Slice the chosen question count
    const count = Math.min(config.questionCount, pool.length);
    let selected = pool.slice(0, count);

    // 3. Optionally shuffle answer options
    if (config.shuffleOptions) {
      selected = selected.map(shuffleQuestionOptions);
    }

    setActiveQuestions(selected);
    setUserAnswers(new Array(selected.length).fill(null));
    setStep(AppStep.QUIZ);
  };

  const handleQuizFinish = (answers: (number | null)[]) => {
    setUserAnswers(answers);
    setStep(AppStep.RESULTS);
  };

  const handleRetrySame = () => {
    setUserAnswers(new Array(activeQuestions.length).fill(null));
    setStep(AppStep.QUIZ);
  };

  const handleConfigureAgain = () => {
    setStep(AppStep.CONFIG);
  };

  const handleRestart = () => {
    setAllQuestions([]);
    setActiveQuestions([]);
    setUserAnswers([]);
    setFileName('');
    setStep(AppStep.UPLOAD);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => step !== AppStep.PROCESSING && step !== AppStep.QUIZ && handleRestart()}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 tracking-tight">
                EXÁMENES TIPO TEST
              </h1>
              {fileName && step !== AppStep.UPLOAD && (
                <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {fileName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {step === AppStep.QUIZ && (
              <button 
                onClick={handleConfigureAgain}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Cambiar número de preguntas"
              >
                <Sliders className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Cambiar preguntas</span>
              </button>
            )}

            {step !== AppStep.UPLOAD && step !== AppStep.PROCESSING && (
              <button 
                onClick={handleRestart}
                className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cerrar examen
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full">
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 animate-fadeIn">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Error al procesar</p>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* STEP 1: UPLOAD */}
        {step === AppStep.UPLOAD && (
          <div className="text-center">
            <div className="max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Analiza tus documentos y genera <span className="text-blue-600">exámenes tipo test</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Sube cualquier documento Word (apuntes, leyes, resúmenes o temas). La IA analiza el contenido y genera preguntas tipo test con 4 opciones y respuestas fundamentadas, <strong>sin necesidad de que vengan marcadas</strong>.
              </p>
            </div>
            <FileUpload 
              onFileSelect={handleFileSelect} 
              onTextSubmit={handleTextSubmit}
              onLoadSample={handleLoadSample}
            />
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === AppStep.PROCESSING && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileQuestion className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{loadingMessage}</h2>
            <p className="text-slate-500 text-sm">
              Estamos extrayendo el contenido y preparando el configurador de preguntas.
            </p>
          </div>
        )}

        {/* STEP 3: CONFIGURATION (Choose number of questions, shuffle, mode) */}
        {step === AppStep.CONFIG && (
          <QuizConfig 
            totalQuestionsCount={allQuestions.length}
            fileName={fileName}
            allQuestions={allQuestions}
            onStart={handleStartQuiz}
            onCancel={handleRestart}
          />
        )}

        {/* STEP 4: ACTIVE QUIZ */}
        {step === AppStep.QUIZ && (
          <Quiz 
            questions={activeQuestions} 
            instantFeedback={currentConfig.instantFeedback}
            onFinish={handleQuizFinish} 
            onExit={handleConfigureAgain}
          />
        )}

        {/* STEP 5: RESULTS */}
        {step === AppStep.RESULTS && (
          <Results 
            questions={activeQuestions} 
            userAnswers={userAnswers} 
            totalDocumentQuestions={allQuestions.length}
            onConfigureAgain={handleConfigureAgain}
            onRetrySame={handleRetrySame}
            onRestart={handleRestart} 
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-400 text-xs border-t border-slate-100 bg-white/50">
        Analizador de Exámenes Word • Gemini 3.8 Flash • Soporta resaltado en Word
      </footer>
    </div>
  );
};

export default App;
