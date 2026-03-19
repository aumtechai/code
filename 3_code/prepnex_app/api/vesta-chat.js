
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    const { message, context } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are Vesta, the 6-12th grade Pathfinder AI for aumtech.ai. 
    User Context: ${JSON.stringify(context)}
    User Query: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
};