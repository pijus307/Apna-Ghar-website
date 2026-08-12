import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));

  // Initialize Gemini API client safely
  let aiClient: GoogleGenAI | null = null;
  function getAI() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Apna Ghar" });
  });

  // 1. AI Diagnostic Endpoint
  app.post("/api/ai-diagnose", async (req, res) => {
    try {
      const { issueDescription, city, urgency } = req.body;

      if (!issueDescription || typeof issueDescription !== "string") {
        return res.status(400).json({ error: "Please provide a valid issue description." });
      }

      const ai = getAI();

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are Ghar AI, the smart home maintenance diagnostic assistant for Apna Ghar (India's premier home service platform).
Analyze the following user's home issue in ${city || "India"} (Urgency preference: ${urgency || "standard"}):

Issue: "${issueDescription}"

Provide an accurate, practical diagnosis with realistic Indian Rupee (₹) price ranges, estimated repair duration, safety advice, required tools/materials, and recommended professional trade.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Clear 1-2 sentence diagnosis of what is likely wrong.",
              },
              recommendedCategory: {
                type: Type.STRING,
                description: "Primary professional trade needed e.g., Electrical, Plumbing, Cleaning, Painting, AC Repair, Carpentry, Locksmith.",
              },
              urgencyLevel: {
                type: Type.STRING,
                description: "Urgency rating: 'Immediate (24/7 Emergency)', 'High (Same Day)', 'Medium (1-2 Days)', or 'Routine'.",
              },
              estimatedCostRangeINR: {
                type: Type.STRING,
                description: "Estimated cost range in INR e.g. '₹299 - ₹599' or '₹1,200 - ₹2,500'.",
              },
              estimatedTime: {
                type: Type.STRING,
                description: "Estimated repair duration e.g. '30-45 mins', '1-2 hours'.",
              },
              safetyAdvice: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Important immediate safety steps for the homeowner (e.g. Turn off main switch, shut off stopcock).",
              },
              possibleCauses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Top 2-3 potential causes for this issue.",
              },
              recommendedPartsOrServices: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Parts or specific tasks likely required.",
              },
            },
            required: [
              "summary",
              "recommendedCategory",
              "urgencyLevel",
              "estimatedCostRangeINR",
              "estimatedTime",
              "safetyAdvice",
              "possibleCauses",
              "recommendedPartsOrServices",
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response generated from Gemini API");
      }

      const parsedData = JSON.parse(text);
      res.json({ success: true, diagnosis: parsedData });
    } catch (error: any) {
      console.error("AI Diagnostic Error:", error);
      res.status(500).json({
        error: error.message || "Failed to analyze home issue. Please try selecting a service directly.",
      });
    }
  });

  // 2. Multi-turn Chatbot Endpoint ("Ghar AI Assistant")
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { messages, city } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const ai = getAI();

      // Convert messages to history format
      const formattedHistory = messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const latestMessage = messages[messages.length - 1].content;

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are Ghar AI, an expert, friendly home maintenance and repair consultant for Apna Ghar in ${city || "India"}.
Your job is to provide accurate troubleshooting steps, estimate hardware/parts costs in Indian Rupees (₹), answer DIY vs Professional repair questions, and suggest when to book a technician on Apna Ghar.
Keep answers clear, helpful, structured with bullet points, and practical for Indian homes (addressing monsoon moisture, voltage fluctuations, hard water issues, etc.).`,
        },
        history: formattedHistory,
      });

      const response = await chat.sendMessage({ message: latestMessage });
      const text = response.text || "I couldn't generate a response. Please try asking again.";

      res.json({ success: true, reply: text });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: error.message || "Failed to chat with AI assistant." });
    }
  });

  // 3. Google Search Grounding Endpoint (Live Market Rates & Spare Parts Pricing)
  app.post("/api/ai-search-grounding", async (req, res) => {
    try {
      const { query, city } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query string is required." });
      }

      const ai = getAI();
      const prompt = `Search live Indian market prices, hardware rates, or standard service norms for: "${query}" in ${city || "India"}.
Summarize exact current pricing in ₹ (INR), top brands (e.g. Havells, Schneider, Jaquar, Asian Paints, Daikin, Godrej), and standard warranty expectations.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No live market data found.";
      const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({
        success: true,
        summary: text,
        groundingSources: searchChunks.map((c: any) => ({
          title: c.web?.title || "Web Source",
          uri: c.web?.uri || "",
        })),
      });
    } catch (error: any) {
      console.error("Search Grounding Error:", error);
      res.status(500).json({ error: error.message || "Search grounding failed." });
    }
  });

  // 4. Google Maps Grounding Endpoint (Hardware Stores & Service Centers Search)
  app.post("/api/ai-maps-grounding", async (req, res) => {
    try {
      const { searchQuery, city } = req.body;
      const ai = getAI();

      const prompt = `Find hardware stores, sanitaryware dealers, electrical supply shops, or emergency service centers near ${city || "Mumbai, India"}: "${searchQuery || "Electrical and plumbing supply store"}".`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      const text = response.text || "No location results available.";

      res.json({
        success: true,
        summary: text,
      });
    } catch (error: any) {
      console.error("Maps Grounding Error:", error);
      res.status(500).json({ error: error.message || "Maps grounding failed." });
    }
  });

  // 5. Audio Transcription Endpoint (Voice Problem Reporting)
  app.post("/api/ai-transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: "audioBase64 is required" });
      }

      const ai = getAI();

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: mimeType || "audio/webm",
              data: audioBase64,
            },
          },
          "Listen to this voice recording from a homeowner in India. Transcribe their words accurately in English or Hinglish, and provide a 1-sentence summary of the home repair problem reported.",
        ],
      });

      const text = response.text || "Could not transcribe audio.";
      res.json({ success: true, text });
    } catch (error: any) {
      console.error("Audio Transcription Error:", error);
      res.status(500).json({ error: error.message || "Audio transcription failed." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Apna Ghar server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
