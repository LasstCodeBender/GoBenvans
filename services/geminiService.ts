import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// Note: In a real app, this should be handled securely on the backend.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateChoreSuggestions = async (childAge: number, interests: string[]): Promise<string[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return ["Clean your room", "Wash the dishes", "Walk the dog"]; // Fallback
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest 5 age-appropriate chores for a ${childAge} year old interested in ${interests.join(', ')}. Return only the chore titles as a JSON list.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Chore Gen Error:", error);
    return ["Organize bookshelf", "Water the plants", "Set the table"];
  }
};

export const generateFinancialTip = async (topic: string): Promise<{ title: string; content: string; quizQuestion: string; options: string[]; correctAnswer: number }> => {
   if (!apiKey) {
    return {
      title: "Savings 101",
      content: "Saving money helps you buy big things later!",
      quizQuestion: "Why do we save?",
      options: ["To spend it all now", "To buy expensive things later", "To lose it"],
      correctAnswer: 1
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a short, fun financial lesson about "${topic}" for a kid. Include a title, a short explanation (under 50 words), and a multiple choice quiz question with 3 options and the index of the correct answer (0-2).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                quizQuestion: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER }
            },
            required: ["title", "content", "quizQuestion", "options", "correctAnswer"]
        }
      }
    });

    const text = response.text;
    if(!text) throw new Error("No response");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Tip Gen Error:", error);
    return {
      title: "Budgeting Basics",
      content: "A budget is a plan for your money. It helps you make sure you don't spend more than you have!",
      quizQuestion: "What is a budget?",
      options: ["A type of bird", "A plan for money", "A customized car"],
      correctAnswer: 1
    };
  }
};
