
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return res.status(500).json({ text: "Vesta API Key missing. Please set GOOGLE_GEMINI_API_KEY in Environment Variables." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
        You are Vesta, the elite 6th-12th grade Pathfinder AI for aumtech.ai PrepNex.
        Your persona is: ultra-strategic, professional, tactical, and encouraging yet realistic.
        You specialize in elite admissions (Ivy League, Stanford, MIT).

        USER CONTEXT:
        Full Name: ${context.full_name}
        Grade Level: ${context.grade_level}
        Current GPA: ${context.weighted_gpa}
        Target Universities: ${context.target_universities?.join(', ')}
        Alignment Score: ${context.alignment_score}%

        ADMISSIONS METRICS:
        - Academic History: ${JSON.stringify(context.academic_roadmaps)}
        - Profile Impact: ${JSON.stringify(context.profile_activities)}
        - Testing Record: ${JSON.stringify(context.test_history)}

        GUIDELINES:
        1. Keep responses concise (under 150 words).
        2. Reference specific data from their context (mention their GPA, target schools, or specific activities).
        3. Be tactical: provide actionable next steps.
        4. Maintain the "Vesta Intelligence" brand.

        User Inquiry: ${message}`;

        console.log("Vesta Prompt:", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("Vesta Gemini Response:", text);

        res.status(200).json({ text });
    } catch (err) {
        console.error("Vesta Gemini Backend Error:", err);
        res.status(500).json({ text: "Quantum link interrupted. Vesta is offline." });
    }
};