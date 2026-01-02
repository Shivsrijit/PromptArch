import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
};

export const reverseEngineerPrompt = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: "Analyze this image with extreme detail. Perform two tasks: 1. Write a professional prompt describing its style, medium, and lighting. 2. Extract 8 distinct, tangible visual features. These must be 'mark-ready' components like 'Grainy Film Texture', 'Specific Subject (e.g. Celebrity Identity)', 'High-Contrast Shadows', 'Grass/Nature Environment', or 'Professional Bokeh'. Return as JSON.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prompt: {
            type: Type.STRING,
            description: "Detailed description of the image's artistic style.",
          },
          attributes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 8 specific, tangible visual features.",
          },
        },
        required: ["prompt", "attributes"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return {
      prompt: data.prompt || "No prompt generated.",
      attributes: data.attributes || [],
    };
  } catch (e) {
    console.error("JSON parsing error:", e);
    return {
      prompt: response.text || "Failed to analyze.",
      attributes: ['Cinematic Lighting', 'Natural Vibe', 'Subject Focus'],
    };
  }
};

export const generateHighResImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K"): Promise<string | null> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const editWithPrompt = async (baseImage: string, prompt: string, focusedAttributes: string[]): Promise<string | null> => {
  const ai = getAIClient();
  const focusString = focusedAttributes.length > 0 
    ? `MANDATORY FEATURES TO INJECT: ${focusedAttributes.join(', ')}.`
    : "Apply the overall aesthetic signature.";

  const styleInstruction = `
    INSTRUCTION: Act as a high-end Digital Retoucher.
    TASK: Apply the atmospheric and stylistic DNA from the 'Style Reference' to the 'User Photo' (attached).
    
    STYLE REFERENCE: "${prompt}"
    ${focusString}
    
    CRITICAL IDENTITY PROTECTION RULES:
    1. SUBJECT LOCK: You MUST preserve the exact identity of the people in the User Photo. If the user is with a celebrity (like Cristiano Ronaldo), DO NOT replace them. Keep their faces, hair, and body structures 100% recognizable.
    2. PIXEL-FIRST FIDELITY: Only modify the lighting, color grading, texture, and environmental atmosphere. 
    3. NO HALLUCINATION: Do not add new faces or remove existing ones. The output must be the EXACT SAME SCENE, but re-rendered with the style of the reference.
    4. QUALITY: Ensure skin tones remain natural unless the style explicitly demands a heavy color filter.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: baseImage.split(',')[1] || baseImage,
            mimeType: 'image/jpeg',
          },
        },
        {
          text: styleInstruction,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const chatEditImage = async (baseImage: string, chatInstruction: string): Promise<string | null> => {
  const ai = getAIClient();
  const complexInstruction = `
    ROLE: Advanced Image Editor.
    TASK: Apply the following user instruction: "${chatInstruction}".
    PRESERVE SUBJECTS: Maintain the identity of all people and main subjects. Only edit the environment or artistic style as requested.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: baseImage.split(',')[1] || baseImage,
            mimeType: 'image/jpeg',
          },
        },
        {
          text: complexInstruction,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};