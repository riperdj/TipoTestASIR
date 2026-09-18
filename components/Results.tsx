import React, { useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, RefreshCcw, Award, Sliders, RotateCcw, UploadCloud } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsProps {
  questions: Question[];
  userAnswers: (number | null)[];
  totalDocumentQuestions?: number;
  onRestart: () => void; // Load another document
  onConfigureAgain?: () => void; // Return to quiz config
  onRetrySame?: () => void; // Retry current question set
}

const Results: React.FC<ResultsProps> = ({ 
  questions, 
  userAnswers, 
  totalDocumentQuestions,
  onRestart,
  onConfigureAgain,
  onRetrySame
}) => {
  const correctCount = userAnswers.reduce((count, answer, index) => {
    return answer === questions[index].correctAnswerIndex ? (count as number) + 1 : count;
  }, 0) as number;

  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  useEffect(() => {
    if (scorePercentage >= 70) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [scorePercentage]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-12">
      {/* Score Summary Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 text-center border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
        <div className="inline-flex items-center justify-center p-4 bg-yellow-100/80 rounded-2xl mb-6 shadow-sm">
          <Award className="w-10 h-10 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">¡Examen Completado!</h2>
        <p className="text-slate-500 text-sm mb-8">
          Has completado las {questions.length} preguntas seleccionadas
          {totalDocumentQuestions && totalDocumentQuestions > questions.length ? ` (de ${totalDocumentQuestions} disponibles en el documento)` : ''}.
        </p>
        
        <div className="flex justify-center items-end space-x-6 sm:space-x-12 mb-8">
          <div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-600">{correctCount}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Aciertos</div>
          </div>
          <div className="h-14 w-px bg-slate-100"></div>
          <div>
            <div className="text-6xl sm:text-7xl font-black text-slate-900">{scorePercentage}%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Puntuación</div>
          </div>
          <div className="h-14 w-px bg-slate-100"></div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-rose-500">{questions.length - correctCount}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Fallos</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onConfigureAgain && (
            <button
              type="button"
              onClick={onConfigureAgain}
              className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-200"
            >
              <Sliders className="w-4 h-4 mr-2" />
              Elegir otro número de preguntas
            </button>
          )}

          {onRetrySame && (
            <button
              type="button"
              onClick={onRetrySame}
              className="bg-slate-100 text-slate-700 px-5 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Repetir este mismo test
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-3.5 rounded-2xl font-semibold hover:bg-slate-50 transition-all flex items-center"
          >
            <UploadCloud className="w-4 h-4 mr-2 text-slate-400" />
            Cargar otro Word
          </button>
        </div>
      </div>

      {/* Detailed Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
            Revisión detallada de preguntas
          </h3>
          <span className="text-xs font-medium text-slate-400">
            {correctCount} de {questions.length} correctas
          </span>
        </div>
        
        {questions.map((q, idx) => {
          const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
          const userSelectedIdx = userAnswers[idx];

          return (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border bg-white shadow-sm transition-all ${
                isCorrect ? "border-emerald-100" : "border-rose-100"
              }`}
            >
              <div className="flex items-start mb-4">
                <div className={`mt-0.5 mr-3 flex-shrink-0 ${isCorrect ? "text-emerald-500" : "text-rose-500"}`}>
                  {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">
                    Pregunta {idx + 1}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                    {q.question}
                  </h4>
                </div>
              </div>

              <div className="ml-9 space-y-2">
                {q.options.map((option, optIdx) => {
                  const isUserSelection = userSelectedIdx === optIdx;
                  const isCorrectAnswer = q.correctAnswerIndex === optIdx;
                  
                  let optStyle = "bg-slate-50 text-slate-600 border-slate-100";
                  if (isCorrectAnswer) {
                    optStyle = "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold";
                  } else if (isUserSelection && !isCorrectAnswer) {
                    optStyle = "bg-rose-50 text-rose-900 border-rose-200 line-through opacity-85";
                  }

                  return (
                    <div 
                      key={optIdx} 
                      className={`p-3 rounded-xl border text-sm flex items-center justify-between ${optStyle}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="opacity-60 font-mono text-xs">
                          {String.fromCharCode(65 + optIdx)})
                        </span>
                        <span>{option}</span>
                      </div>
                      
                      <div className="flex-shrink-0 ml-2">
                        {isCorrectAnswer && (
                          <span className="text-[11px] bg-emerald-100 text-emerald-800 py-0.5 px-2 rounded-md font-bold">
                            Respuesta correcta
                          </span>
                        )}
                        {isUserSelection && !isCorrectAnswer && (
                          <span className="text-[11px] bg-rose-100 text-rose-800 py-0.5 px-2 rounded-md font-bold">
                            Tu elección
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {q.explanation && (
                <div className="mt-4 ml-9 p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900">
                  <span className="font-bold block mb-0.5">Explicación:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
