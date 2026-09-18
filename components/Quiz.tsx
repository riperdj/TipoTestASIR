import React, { useState } from 'react';
import { Question } from '../types';
import { ChevronRight, ArrowLeft, CheckCircle2, XCircle, Sliders, AlertCircle } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  instantFeedback?: boolean;
  onFinish: (answers: (number | null)[]) => void;
  onExit?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ 
  questions, 
  instantFeedback = false, 
  onFinish,
  onExit 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers[currentIndex];
  const hasAnsweredCurrent = currentAnswer !== null;

  const handleOptionSelect = (optionIndex: number) => {
    // If instant feedback is active and user already answered, allow changing or lock?
    // Let's allow selecting once or changing
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Top Bar with Progress & Exit Option */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-800">
              Pregunta {currentIndex + 1} <span className="font-normal text-slate-400">de {questions.length}</span>
            </span>
            {instantFeedback && (
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                Modo Práctica
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="text-xs font-semibold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                title="Cambiar número de preguntas o modo"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configurar</span>
              </button>
            )}
          </div>
        </div>
        <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 mb-6 border border-slate-100">
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg mb-3">
            Pregunta #{currentIndex + 1}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = currentAnswer === idx;
            const isCorrect = idx === currentQuestion.correctAnswerIndex;

            let buttonStyle = "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700";
            let circleStyle = "bg-slate-100 text-slate-500 group-hover:bg-slate-200";

            if (instantFeedback && hasAnsweredCurrent) {
              if (isCorrect) {
                buttonStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium";
                circleStyle = "bg-emerald-600 text-white";
              } else if (isSelected && !isCorrect) {
                buttonStyle = "border-red-500 bg-red-50/80 text-red-950 line-through opacity-90";
                circleStyle = "bg-red-600 text-white";
              } else {
                buttonStyle = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                circleStyle = "bg-slate-100 text-slate-400";
              }
            } else if (isSelected) {
              buttonStyle = "border-blue-500 bg-blue-50 text-blue-900 font-semibold shadow-sm";
              circleStyle = "bg-blue-600 text-white";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
              >
                <div className="flex items-center space-x-3.5 pr-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors text-sm font-bold ${circleStyle}`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-base sm:text-lg">{option}</span>
                </div>

                {instantFeedback && hasAnsweredCurrent && (
                  <div className="flex-shrink-0 ml-2">
                    {isCorrect && (
                      <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Correcta
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="inline-flex items-center text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Tu opción
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Explanation Box */}
        {instantFeedback && hasAnsweredCurrent && (
          <div className={`mt-6 p-4 rounded-2xl border text-sm transition-all animate-fadeIn ${
            currentAnswer === currentQuestion.correctAnswerIndex
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}>
            <div className="flex items-start space-x-2.5">
              {currentAnswer === currentQuestion.correctAnswerIndex ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold">
                  {currentAnswer === currentQuestion.correctAnswerIndex 
                    ? "¡Respuesta correcta!" 
                    : `Incorrecto. La respuesta correcta es la ${String.fromCharCode(65 + currentQuestion.correctAnswerIndex)}.`}
                </p>
                {currentQuestion.explanation && (
                  <p className="mt-1 text-xs opacity-90 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center px-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center px-5 py-3 rounded-xl font-semibold transition-colors ${
            currentIndex === 0 
              ? "text-slate-300 cursor-not-allowed" 
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Anterior
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleNext}
            disabled={answers[currentIndex] === null}
            className={`flex items-center px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md ${
              answers[currentIndex] === null
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 transform hover:-translate-y-0.5"
            }`}
          >
            <span>{currentIndex === questions.length - 1 ? "Finalizar Examen" : "Siguiente"}</span>
            <ChevronRight className="w-5 h-5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
