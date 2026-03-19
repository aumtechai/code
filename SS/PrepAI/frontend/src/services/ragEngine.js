// Simulated RAG (Retrieval-Augmented Generation) Knowledge Base
// In a production environment, this would query Pinecone, Weaviate, or Vertex AI Search.

const UNIVERSITY_CDS_DATABASE = {
  MIT: {
    university_tier: "Ivy Plus / Highly Selective Tech",
    target_major: "STEM",
    requirements: {
      math_hook: "AP Calculus BC required by 11th/12th grade. Multivariable preferred.",
      testing_avg: "SAT Math 790-800, Reading 730-780",
      spike_focus: "Demonstrated national-level achievement in STEM (e.g., USAMO, Regeneron STS) or deep independent research.",
      extracurricular_avg: "High impact leadership. Not just participation."
    },
    dataset_version: "MIT Common Data Set 2024-2025"
  },
  Stanford: {
    university_tier: "Ivy Plus",
    target_major: "STEM / Business",
    requirements: {
      math_hook: "AP Calculus BC heavily preferred.",
      testing_avg: "SAT 1500-1570",
      spike_focus: "Entrepreneurial or innovative impact. 'Intellectual Vitality' demonstrated outside the classroom.",
      extracurricular_avg: "Founding organizations or significant local/global community impact."
    },
    dataset_version: "Stanford IPEDS & CDS 2024"
  },
  StateFlagship: {
    university_tier: "Top 50 State",
    target_major: "Any",
    requirements: {
      math_hook: "Pre-Calculus or AP Calculus AB by 12th grade.",
      testing_avg: "SAT 1350-1480",
      spike_focus: "Consistent state-level achievement or strong consistent commitment over 4 years.",
      extracurricular_avg: "Varsity sports, consistent club leadership, state competitions."
    },
    dataset_version: "Aggregated State Univ CDS 2024"
  }
};

/**
 * Simulates a vector database semantic search.
 * Returns the most relevant university context for grounding the LLM prompt.
 */
export const retrieveGroundingContext = async (targetTier, targetMajor) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Very basic simulated semantic matching
      let bestMatch = UNIVERSITY_CDS_DATABASE.StateFlagship;
      
      if (targetTier.includes("Ivy") || targetTier.includes("Tech")) {
        bestMatch = UNIVERSITY_CDS_DATABASE.MIT; 
      }
      
      resolve({
        context: bestMatch,
        rag_log: `[RAG System] Retrieved ${bestMatch.dataset_version} for inference.`
      });
    }, 400); // 400ms simulate vector search latency
  });
};
