/**
 * PREPNEX - VESTA AI INTELLIGENCE ENGINE
 * This script handles the read/write logic between the Vesta AI interface 
 * and the Supabase 'prepnex' schema.
 */

import { createClient } from '@supabase/supabase-js';

// Configuration (To be populated with actual Aumtech credentials)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 1. GET FULL STUDENT CONTEXT
 * Fetches the entire 7-year profile to prime the AI (Vesta).
 */
export async function getVestaContext(studentId) {
    const { data: profile, error } = await supabase
        .schema('prepnex')
        .from('students')
        .select(`
            *,
            academic_roadmaps (*),
            profile_activities (*),
            test_history (*),
            ai_context (*)
        `)
        .eq('id', studentId)
        .single();

    if (error) throw error;
    return profile;
}

/**
 * 2. PERSIST VESTA NUDGE
 * Writes a new "Aura Nudge" back to the DB after AI analysis.
 */
export async function persistVestaNudge(studentId, nudgeContent) {
    const { data, error } = await supabase
        .schema('prepnex')
        .from('ai_context')
        .upsert({
            student_id: studentId,
            last_strategy_nudge: nudgeContent,
            updated_at: new Date().toISOString()
        });

    if (error) console.error("Failed to write back Vesta context:", error);
    return data;
}

/**
 * 3. ANALYZE PROFILE GAP (Edge Logic)
 * Local logic to identify which pillar needs an AI intervention.
 */
export function analyzeProfileGap(profile) {
    const hisScore = profile.alignment_score || 0;
    const currentGrade = profile.current_grade;

    // Strategic Logic: If GPA is high but HIS is low, suggest an Olympiad.
    const activeActivities = profile.profile_activities || [];
    const hasOlympiad = activeActivities.some(a => a.activity_type === 'Olympiad');

    if (hisScore > 85 && !hasOlympiad && currentGrade < 11) {
        return "CRITICAL_GAP: Lacks Elite Competition (Suggest USACO/AMC)";
    }
    
    return "STABLE_TRACK: Continue Current Roadmap";
}

/**
 * 4. AI CHAT HANDLER (MOCKUP)
 * Simulates sending the context to Gemini and getting a structured response.
 */
export async function vestaChat(studentId, message) {
    const context = await getVestaContext(studentId);
    
    // In a production environment, this 'context' is sent as 
    // system instructions to the LLM (Gemini 1.5 Pro).
    
    const response = {
        reply: `Vesta here. I see you're aiming for MIT. Based on your current ${context.academic_roadmaps[0].course_name} performance, I've updated your roadmap to include the AMC 10 test window.`,
        suggestedAction: "Update Roadmap for Math Olympiad"
    };

    // Auto-update the context in DB
    await persistVestaNudge(studentId, response.reply);
    
    return response;
}
