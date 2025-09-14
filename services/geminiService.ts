
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import `Recurrence` to use it as a default value for generated tasks.
import { Priority, Task, Recurrence } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'The specific, actionable sub-task. Should be concise.',
      },
      priority: {
        type: Type.STRING,
        description: 'The suggested priority for the task: "High", "Medium", or "Low".',
      },
    },
    required: ['title', 'priority'],
  },
};

export async function generateSubTasks(goal: string): Promise<Omit<Task, 'id' | 'completed'>[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the goal "${goal}", generate a list of actionable sub-tasks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const generatedTasks = JSON.parse(jsonText);

    if (!Array.isArray(generatedTasks)) {
      console.error("Gemini did not return an array:", generatedTasks);
      return [];
    }

    // FIX: Add the required 'recurrence' property to the returned objects to match the Omit<Task, ...> type.
    return generatedTasks.map((task: any) => ({
        title: task.title,
        priority: Object.values(Priority).includes(task.priority) ? task.priority : Priority.MEDIUM,
        recurrence: Recurrence.NONE,
    }));

  } catch (error) {
    console.error("Error generating sub-tasks with Gemini:", error);
    throw new Error("Failed to generate tasks. Please check your API key and try again.");
  }
}
