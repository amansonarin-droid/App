import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates jewelry design ideas based on a text prompt.
 * @param prompt The user's description of the jewelry.
 * @returns The generated text description.
 */
export const generateJewelryDesign = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a detailed description for a piece of jewelry based on the following idea: "${prompt}". Focus on materials, style, and unique features.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating jewelry design:", error);
    return "Sorry, I couldn't generate a design at the moment. Please try again later.";
  }
};

/**
 * Generates jewelry design images. Can take a text prompt or a reference image.
 * @param prompt The text description.
 * @param referenceImage Optional base64 image string.
 * @returns An array of objects containing the base64 image and its mime type.
 */
export const generateJewelryImage = async (prompt: string, referenceImage?: string | null): Promise<{data: string, mimeType: string}[]> => {
    try {
        if (referenceImage) {
            // Multimodal generation with reference image
            const imagePart = { inlineData: { data: referenceImage, mimeType: 'image/jpeg' } };
            const textPart = { text: prompt || 'generate a similar design' };
            
            const results = await Promise.all(
              Array(4).fill(0).map(() => 
                ai.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: { parts: [imagePart, textPart] },
                  // FIX: Added responseModalities config for image generation.
                  config: {
                    responseModalities: [Modality.IMAGE],
                  },
                })
              )
            );
            
            return results.flatMap(response => {
                const parts = response.candidates?.[0]?.content?.parts;
                if (!Array.isArray(parts)) {
                    return [];
                }
                return parts
                    .filter(part => part.inlineData?.data)
                    .map(part => ({ data: part.inlineData!.data, mimeType: part.inlineData!.mimeType }));
            });

        } else {
            // Text-to-image generation
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `A photorealistic image of the following jewelry piece on a neutral, elegant background: ${prompt}`,
                config: {
                  numberOfImages: 4,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '1:1',
                },
            });
            return response.generatedImages.map(img => ({data: img.image.imageBytes, mimeType: 'image/jpeg'}));
        }
    } catch (error) {
        console.error("Error generating jewelry image:", error);
        return [];
    }
};

/**
 * Estimates the weight of a piece of jewelry from an image.
 * @param image The image data (base64 and mimeType).
 * @param karat The selected karat ('22k', '18k', '9k', or 'custom').
 * @param customPurityValue The custom purity percentage if karat is 'custom'.
 * @returns The estimated weight as a number, or null.
 */
export const getEstimatedWeight = async (
    image: { data: string; mimeType: string; },
    karat: '22k' | '18k' | '9k' | 'custom',
    customPurityValue?: number
): Promise<number | null> => {
    try {
        let purityDescription = `${karat} gold`;
        if (karat === 'custom' && customPurityValue) {
            purityDescription = `gold with ${customPurityValue}% purity`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { data: image.data, mimeType: image.mimeType } },
                    { text: `Analyze this jewelry image and estimate its weight in grams if it were made from ${purityDescription}. Provide a realistic weight between 1 and 100 grams.` }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        estimatedWeight: { type: Type.NUMBER, description: 'The estimated weight in grams.' }
                    }
                },
            },
        });
        const json = JSON.parse(response.text);
        return json.estimatedWeight || null;
    } catch (error) {
        console.error("Error estimating weight:", error);
        return null;
    }
};

/**
 * Estimates the making charge for a piece of jewelry from an image based on purity.
 * @param image The image data.
 * @param karat The selected karat.
 * @param customPurityValue The custom purity percentage if karat is 'custom'.
 * @returns The estimated making charge percentage, or null.
 */
export const getMakingCharge = async (
    image: { data: string; mimeType: string; },
    karat: '22k' | '18k' | '9k' | 'custom',
    customPurityValue?: number
): Promise<number | null> => {
    try {
        let makingChargeRules = 'A typical making charge for intricate designs is between 12% and 25%.';
        let purityDescription = `${karat} gold`;
        
        if (karat === '22k') {
            makingChargeRules = 'For 22k gold, suggest a making charge between 12% and 20%.';
        } else if (karat === '18k') {
            makingChargeRules = 'For 18k gold, suggest a making charge of 15% or higher.';
        } else if (karat === '9k') {
            makingChargeRules = 'For 9k gold, suggest a making charge of 20% or higher.';
        } else if (karat === 'custom' && customPurityValue) {
            purityDescription = `gold with ${customPurityValue}% purity`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { data: image.data, mimeType: image.mimeType } },
                    { text: `Analyze this jewelry's design complexity. Based on its complexity, what would be a fair making charge percentage? ${makingChargeRules} The piece is made from ${purityDescription}.` }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        makingChargePercentage: { type: Type.NUMBER, description: 'The estimated making charge as a percentage.' }
                    }
                },
            },
        });
        const json = JSON.parse(response.text);
        return json.makingChargePercentage || null;
    } catch (error) {
        console.error("Error estimating making charge:", error);
        return null;
    }
};