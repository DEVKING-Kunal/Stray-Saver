
// This would normally use Supabase Edge Function to securely interact with Gemini API
// For this implementation, we'll create a simulated response

export type InjuryAssessment = {
  recommendation: string;
  urgency: "low" | "medium" | "high";
  careSteps: string[];
};

export const getInjuryAssessment = async (
  species: string,
  severity: string,
  notes: string
): Promise<InjuryAssessment> => {
  // This is a simulated response, in production this would call Gemini AI via a Supabase Edge Function
  
  // For severity == "normal", we provide helpful information
  if (severity === "normal") {
    const assessments: Record<string, InjuryAssessment> = {
      dog: {
        recommendation: "The animal appears to have minor injuries that don't require immediate professional attention.",
        urgency: "low",
        careSteps: [
          "Provide fresh water in a clean container",
          "If possible, offer dog-appropriate food",
          "Create a quiet, safe space for the animal to rest",
          "Approach slowly and speak softly to avoid frightening the animal",
          "Don't attempt to treat injuries if the animal seems aggressive or scared"
        ]
      },
      cat: {
        recommendation: "The cat has minor issues that can likely be managed with basic care.",
        urgency: "low",
        careSteps: [
          "Provide fresh water in a shallow dish",
          "Offer small amounts of cat food if available",
          "Create a quiet shelter away from traffic and noise",
          "Don't attempt to pick up a frightened cat",
          "Watch from a distance to monitor condition"
        ]
      },
      bird: {
        recommendation: "The bird appears to have minor issues that require gentle care.",
        urgency: "low",
        careSteps: [
          "Create a quiet, warm environment",
          "Do not attempt to feed or give water unless you're experienced with birds",
          "Place in a ventilated box with soft lining",
          "Keep away from children and pets",
          "Contact a wildlife rehabilitator for further guidance"
        ]
      },
      // Default for any other animal type
      other: {
        recommendation: "The animal has minor issues but should still be assessed by a professional.",
        urgency: "low",
        careSteps: [
          "Maintain a safe distance",
          "Provide water if possible without approaching too closely",
          "Create shelter from extreme weather if needed",
          "Contact local animal control or wildlife services",
          "Do not attempt to handle unfamiliar animal species"
        ]
      }
    };

    // Return the appropriate assessment based on species
    return assessments[species as keyof typeof assessments] || assessments.other;
  }
  
  // For other severities, we recommend professional help
  return {
    recommendation: "This animal requires professional veterinary care.",
    urgency: severity === "critical" ? "high" : "medium",
    careSteps: [
      "Do not attempt to treat the animal yourself",
      "Contact a local veterinarian or animal rescue immediately",
      "Keep the animal calm and minimize movement",
      "Provide shelter from extreme weather if possible",
      "Wait for professional assistance to arrive"
    ]
  };
};
