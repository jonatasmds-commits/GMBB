import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure API key is available
const ai = new GoogleGenAI({ apiKey });

const modelId = "gemini-2.5-flash";

/**
 * Analyzes a project description to suggest required documents and safety measures.
 */
export const analyzeProjectScope = async (description: string, storeType: string): Promise<string> => {
  try {
    const prompt = `
      Atue como um Engenheiro Civil Sênior especializado em normas de Shopping Centers (ABNT/NBR).
      Analise o seguinte escopo de obra para uma loja do tipo "${storeType}":
      "${description}"

      Forneça uma resposta formatada em Markdown contendo:
      1. Lista de Documentos Técnicos Prováveis necessários (ex: RRT, ART, Projetos).
      2. Principais Riscos de Segurança a mitigar.
      3. Sugestão de cronograma macro (em semanas) para esse tipo de intervenção.
      
      Seja direto, técnico e profissional.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao analisar projeto:", error);
    return "Erro ao conectar com o serviço de IA. Verifique sua chave de API.";
  }
};

/**
 * Chat bot for general regulation questions
 */
export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: "Você é o assistente virtual do Portal de Obras do Shopping. Você ajuda lojistas, arquitetos e engenheiros com dúvidas sobre processos, normas técnicas (NBR), horários de carga e descarga, e documentação necessária. Responda sempre de forma polida, profissional e concisa."
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Desculpe, estou com dificuldades de conexão no momento.";
  }
};