import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Lazy initialization of Google Generative AI
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Generates captions and hashtags optimized for a specific platform.
 */
export async function generateCaption(prompt: string, platform: string = "instagram"): Promise<{
  captions: string[];
  hashtags: string[];
}> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const systemInstruction = `You are QueueBot AI, an elite social media strategist.
Generate 3 variations of engaging posts based on the user prompt.
Format your response as a JSON object with two fields: 
- "captions": string[] (3 premium caption variations)
- "hashtags": string[] (10-15 highly target hashtags matching the platform style)
For platform: ${platform}. Ensure length and tone match target guidelines. Output ONLY the raw JSON.`;

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const text = response.response.text();
      const result = JSON.parse(text);
      return {
        captions: result.captions || [],
        hashtags: result.hashtags || [],
      };
    } catch (error) {
      console.error("Error calling Gemini API for caption:", error);
      // Fallback to mock on error
    }
  }

  // Quality Mock responses for a gorgeous first load
  const cleanPrompt = prompt.trim() || "modern web design services";
  return {
    captions: [
      `🚀 Ready to scale your brand? Our latest solutions for "${cleanPrompt}" are officially live! Level up your digital game today. ✨`,
      `Stop doing "${cleanPrompt}" the hard way. ⚡ Here's a step-by-step breakdown of how our new automation flow handles the heavy lifting for you! 👇`,
      `Aesthetics + Performance = Success. 💎 Check out how we're reshaping the future of "${cleanPrompt}". What do you think of this approach?`
    ],
    hashtags: [
      `#${platform}`,
      `#SaaS`,
      `#GrowthHacking`,
      `#MarketingAutomation`,
      `#QueueBot`,
      `#Productivity`,
      `#DigitalStrategy`,
      `#AICopilot`,
      `#ScaleUp`,
      `#Innovation`
    ]
  };
}

/**
 * Generates an automated comment reply based on comment text and prompt rules.
 */
export async function generateReply(commentText: string, ruleContext: string = "be friendly and helpful"): Promise<string> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a social media representative.
The user left this comment: "${commentText}"
The instruction to reply is: "${ruleContext}"
Generate a short, engaging, single-sentence reply (max 20 words). Keep it friendly and natural.`;

      const response = await model.generateContent(prompt);
      return response.response.text().trim();
    } catch (error) {
      console.error("Error calling Gemini API for reply:", error);
      // Fallback to mock on error
    }
  }

  // Mock auto replies based on comment keywords
  const lowerComment = commentText.toLowerCase();
  if (lowerComment.includes("price") || lowerComment.includes("cost") || lowerComment.includes("how much")) {
    return "Hi there! Our plans start at $0/mo. Check out our Billing section for details! ⚡";
  }
  if (lowerComment.includes("love") || lowerComment.includes("great") || lowerComment.includes("awesome")) {
    return "Thanks so much for the support! Glad you're loving the content! ❤️";
  }
  if (lowerComment.includes("work") || lowerComment.includes("broken") || lowerComment.includes("issue")) {
    return "DM us your details and our team will check this out immediately! 🛠️";
  }

  return "Thanks for stopping by! Let us know if you have any questions. ✨";
}
