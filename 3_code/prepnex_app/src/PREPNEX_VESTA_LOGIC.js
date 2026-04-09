// PREPNEX_VESTA_LOGIC.js - BROWSER SAFE VERSION
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Definitive Supabase Configuration (Sync with gwqikdtwmtwwcmahlpsg)
const supabaseUrl = 'https://gwqikdtwmtwwcmahlpsg.supabase.co';
const supabaseKey = 'sb_publishable_wuFm7OKw9K2flFYVjMCHlQ_qSeR6OHq'; 

// SCHEMA CALIBRATION: Falling back to default 'public' for demo reliability
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 1. GET FULL STUDENT CONTEXT
 * Fetches the entire 7-year profile from the 'prepnex' schema.
 */
export async function getVestaContext(studentId) {
    console.log("Vesta: Fetching context for Student", studentId);
    
    const { data: profile, error } = await supabase
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

    if (error) {
        console.error("Vesta Intelligence: Context retrieval failed:", error);
        throw error;
    }
    return profile;
}

/**
 * 2. PERSIST VESTA NUDGE
 * Writes a strategic update back to the DB.
 */
export async function persistVestaNudge(studentId, nudgeContent) {
    const { data, error } = await supabase
        .from('ai_context')
        .upsert({
            student_id: studentId,
            last_strategy_nudge: nudgeContent,
            updated_at: new Date().toISOString()
        });

    if (error) console.error("Vesta: Failed to persist nudge:", error);
    return data;
}

/**
 * 3. CORE MODULE HELPERS
 */
export async function getAcademicRoadmap(studentId) {
    const { data, error } = await supabase.from('academic_roadmaps').select('*').eq('student_id', studentId);
    if (error) throw error;
    return data;
}

export async function getTestHistory(studentId) {
    const { data, error } = await supabase.from('test_history').select('*').eq('student_id', studentId);
    if (error) throw error;
    return data;
}

export async function getProfileImpact(studentId) {
    const { data, error } = await supabase.from('profile_activities').select('*').eq('student_id', studentId);
    if (error) throw error;
    return data;
}

export async function addAcademicCourse(studentId, courseData) {
    const { data, error } = await supabase
        .from('academic_roadmaps')
        .insert({
            student_id: studentId,
            ...courseData
        });
    if (error) throw error;
    return data;
}

/**
 * 4. PATHWAY SYNC (AUDIT ENGINE)
 * Simulates a Vesta Audit by updating the alignment score.
 */
export async function performPathwaySync(studentId) {
    console.log("Vesta: Running Pathway Sync Audit...");
    const newScore = Math.floor(Math.random() * (99 - 90 + 1) + 90);
    
    const { error } = await supabase
        .from('students')
        .update({ alignment_score: newScore })
        .eq('id', studentId);

    if (error) throw error;
    return newScore;
}

export async function addProfileActivity(studentId, activityData) {
    const { data, error } = await supabase
        .from('profile_activities')
        .insert({
            student_id: studentId,
            ...activityData
        });
    if (error) throw error;
    return data;
}

/**
 * 5. AI CHAT HANDLER (VESTA PERSONA)
 */
export async function vestaChat(studentId, message) {
    const context = await getVestaContext(studentId);
    
    try {
        const response = await fetch('/api/vesta-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context })
        });

        if (!response.ok) throw new Error("Vesta Intelligence Sync Failed");

        const data = await response.json();
        const replyText = data.text;
        
        const vestaRes = {
            reply: replyText,
            suggestedAction: "Strategic Alignment: SECURED"
        };

        await persistVestaNudge(studentId, vestaRes.reply);
        return vestaRes;
    } catch (err) {
        console.error("Vesta Gemini Sync Error:", err);
        return {
            reply: "Vesta is currently undergoing a quantum recalibration. Please try again shortly.",
            suggestedAction: "Offline Mode Active"
        };
    }
}

/**
 * 6. NEW FEATURE MODULES: TRACKER & ESSAYS
 */
export async function getTrackerData(studentId) {
    const { data, error } = await supabase
        .from('student_universities')
        .select(`
            id,
            university_id,
            student_fit_score,
            status,
            tier,
            universities (
                name,
                category,
                acceptance_rate,
                avg_sat,
                logo_url
            )
        `)
        .eq('student_id', studentId);
        
    if (error) console.error("Error fetching tracker data:", error);
    return data || [];
}

export async function getApplicationDocuments(studentId) {
    const { data, error } = await supabase
        .from('application_documents')
        .select(`
            id,
            document_name,
            status,
            due_date,
            universities ( name )
        `)
        .eq('student_id', studentId);
        
    if (error) console.error("Error fetching application docs:", error);
    return data || [];
}

export async function getEssayDrafts(studentId) {
    const { data, error } = await supabase
        .from('essay_drafts')
        .select(`
            id,
            prompt_title,
            prompt_text,
            content,
            vesta_feedback,
            word_limit,
            universities ( name )
        `)
        .eq('student_id', studentId);
        
    if (error) console.error("Error fetching essay drafts:", error);
    return data || [];
}

export async function saveEssayDraft(draftId, newContent, studentId) {
    const { data, error } = await supabase
        .from('essay_drafts')
        .update({ content: newContent, last_updated: new Date().toISOString() })
        .eq('id', draftId)
        .eq('student_id', studentId);
        
    if (error) throw error;
    return true;
}

/**
 * 7. MENTORSHIP & FINANCIAL HUB (Categories 5 and 6)
 */
export async function getCommunityPosts() {
    const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('upvotes', { ascending: false });
        
    if (error) console.error("Error fetching community posts:", error);
    return data || [];
}

export async function getScholarships(studentId) {
    const { data, error } = await supabase
        .from('student_scholarships')
        .select(`
            id,
            status,
            match_score,
            scholarships (
                name,
                amount_usd,
                deadline,
                description
            )
        `)
        .eq('student_id', studentId)
        .order('match_score', { ascending: false });
        
    if (error) console.error("Error fetching scholarships:", error);
    return data || [];
}


