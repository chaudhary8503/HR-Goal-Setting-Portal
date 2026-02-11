/**
 * Fallback data for when the API is unavailable
 * This allows for graceful degradation of the app even when offline
 */

interface OKRData {
  department: string;
  jobTitle: string;
  goalDescription: string;
  keyResult: string;
  managersGoal: string;
  dueDate: string;
}

/**
 * Generate fallback SMART goals when the API is not available
 * @param okrData The user's OKR data
 * @returns An array of generated goals
 */
export const generateFallbackGoals = (okrData: OKRData) => {
  // Simple fallback logic that uses the user's input to generate goals
  return [
    {
      id: 1,
      goal: `Establish a comprehensive ${okrData.keyResult} tracking system for ${okrData.department} with automated reporting`,
      description: `Create a structured approach to monitor progress toward ${okrData.goalDescription} through quantifiable metrics, providing regular visibility to all stakeholders.`,
      kpi: `100% completion of ${okrData.keyResult} by ${new Date(okrData.dueDate).toLocaleDateString()}`,
      topBetsAlignment: "Operational Excellence - Streamlines decision-making through data-driven insights",
      frameworkAlignment: "Efficiency - Reduces manual reporting time while improving data quality",
      coreValues: `Accountability & Transparency - Demonstrates commitment to ${okrData.managersGoal} through consistent, accurate reporting`
    },
    {
      id: 2,
      goal: `Create measurable milestone checkpoints for ${okrData.department} objectives aligned with ${okrData.jobTitle} responsibilities`,
      description: `Define specific, quantifiable milestones with clear success criteria for tracking progress on ${okrData.goalDescription}. Each milestone includes resource allocation and risk assessment.`,
      kpi: `90% of milestones achieved on schedule by ${new Date(okrData.dueDate).toLocaleDateString()}`,
      topBetsAlignment: "Customer Centricity - Ensures deliverables meet stakeholder expectations through regular validation",
      frameworkAlignment: "Effectiveness - Validates that efforts are producing intended business outcomes",
      coreValues: "Excellence & Customer Focus - Strives for high-quality deliverables while maintaining strong stakeholder relationships"
    },
    {
      id: 3,
      goal: `Develop cross-functional collaboration framework for ${okrData.department} to achieve ${okrData.keyResult}`,
      description: "Establish clear communication channels, role definitions, and escalation procedures across all teams involved in achieving the goal. Include regular sync meetings and shared documentation.",
      kpi: `Team collaboration score above 4.2/5, with ${okrData.keyResult} achieved by ${new Date(okrData.dueDate).toLocaleDateString()}`,
      topBetsAlignment: "Innovation Culture - Fosters collaborative environment that drives creative problem-solving",
      frameworkAlignment: "Engagement - Increases team satisfaction and reduces project delivery risks through clear communication",
      coreValues: "Collaboration & Respect - Promotes inclusive teamwork and values diverse perspectives"
    }
  ];
};
