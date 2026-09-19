import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export async function parseQuizContent(rawText: string, targetCount?: number): Promise<Question[]> {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No se ha configurado la clave de API de Gemini.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const countInstruction = targetCount && targetCount > 0 
    ? `Extrae o genera exactamente o aproximadamente ${targetCount} preguntas tipo test (si el texto tiene suficiente longitud para ello). Asegúrate de cubrir de forma exhaustiva y distribuida todo el documento.` 
    : `Extrae o genera un banco completo de preguntas (entre 10 y 25 preguntas, o tantas como el contenido permita para cubrir todos los temas clave).`;

  const prompt = `
    Eres un evaluador académico experto en la creación y análisis de exámenes tipo test.
    Tu misión es analizar el texto suministrado de un documento y obtener un banco riguroso de preguntas de examen tipo test de 4 opciones.

    ANALIZA EL DOCUMENTO Y APLICA LA LÓGICA ADECUADA:

    1. CASO A - EL DOCUMENTO YA CONTIENE PREGUNTAS TIPO TEST O EXÁMENES (con o sin respuestas marcadas):
       - Extrae cada una de las preguntas con sus 4 opciones.
       - Si alguna opción tiene etiquetas [CORRECT_START] y [CORRECT_END] (resaltado amarillo del documento original), tómala como la respuesta correcta.
       - Si NO hay etiquetas de resaltado ni soluciones marcadas en el documento, deduce y resuelve tú mismo con total precisión cuál es la respuesta correcta (índice 0, 1, 2 o 3) basándote en la veracidad fáctica y el contenido del texto.
       - Proporciona una explicación clara y pedagógica.

    2. CASO B - EL DOCUMENTO ES TEXTO GENERAL (apuntes, temario, leyes, resumen, artículo, manual, apuntes de clase, etc.):
       - Analiza en profundidad todo el texto del documento.
       - Identifica los conceptos clave, datos, definiciones, normativas, fechas, plazos, clasificaciones y detalles fundamentales explicados en el texto.
       - CREA y GENERA preguntas tipo test de alta calidad basadas estrictamente en la información del documento.
       - ${countInstruction}
       - Cada pregunta debe tener un enunciado claro, sin ambigüedades.
       - Formula siempre EXACTAMENTE 4 opciones (A, B, C, D) plausibles, donde una sola sea la correcta según lo expuesto en el documento.
       - Indica el índice numérico de la opción correcta (0 para la primera opción, 1 para la segunda, etc.).
       - Añade una explicación didáctica en español que fundamente la respuesta según el documento.

    REGLAS ESTRICTAS DE FORMATO:
    - Retorna ÚNICAMENTE un array JSON con los objetos de las preguntas.
    - "question": Enunciado limpio de la pregunta (sin prefijos como "1.-", "Pregunta 1:", sin etiquetas [CORRECT_START]).
    - "options": Array de 3 a 4 opciones de texto limpias (sin letras iniciales como "a)", "B.", "1.", etc., ni etiquetas).
    - "correctAnswerIndex": Entero entre 0 y el número de opciones menos 1 que indica la opción correcta.
    - "explanation": Breve explicación didáctica en español.

    Texto del documento:
    """
    ${rawText}
    """
  `;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswerIndex"]
          }
        }
      }
    });
  } catch (err) {
    console.warn("Error al invocar gemini-1.5-flash, utilizando fallback:", err);
    response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswerIndex"]
          }
        }
      }
    });
  }

  const text = response.text;
  if (!text) throw new Error("No se recibió respuesta del modelo al analizar el documento.");
  
  try {
    let cleanJson = text.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }
    const questions = JSON.parse(cleanJson) as any[];
    return questions.map((q, idx) => {
      const cleanOptions = (q.options || []).map((opt: string) => 
        (opt || '')
          .replace(/\[CORRECT_START\]|\[CORRECT_END\]/g, '')
          .replace(/^[a-dA-D][\)\.\-]\s*/, '')
          .trim()
      );
      const safeIndex = typeof q.correctAnswerIndex === 'number' 
        ? Math.max(0, Math.min(cleanOptions.length - 1, q.correctAnswerIndex))
        : 0;

      return {
        id: `q-${idx + 1}`,
        question: (q.question || '')
          .replace(/\[CORRECT_START\]|\[CORRECT_END\]/g, '')
          .replace(/^(?:pregunta\s*)?\d+[\.\-\)]\s*/i, '')
          .trim(),
        options: cleanOptions,
        correctAnswerIndex: safeIndex,
        explanation: q.explanation 
          ? q.explanation.replace(/\[CORRECT_START\]|\[CORRECT_END\]/g, '').trim() 
          : undefined
      };
    });
  } catch (error) {
    console.error("Error parsing JSON from Gemini:", error);
    throw new Error("Error al estructurar las preguntas generadas del documento.");
  }
}

