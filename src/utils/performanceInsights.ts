export type CognitiveDomain = 
  | 'Fluid Reasoning (GF)'
  | 'Crystallized Knowledge (GC)'
  | 'Working Memory (GWM)'
  | 'Processing Speed (Gs)'
  | 'Visual-Spatial Processing (Gv)'
  | 'Auditory Processing (Ga)'
  | 'Long-Term Retrieval (Glr)'
  | 'Quantitative Knowledge (Gq)'
  | 'Reading & Writing (Grw)'
  | string;

interface InsightLevels {
  superior: string;
  aboveAverage: string;
  average: string;
  belowAverage: string;
  low: string;
}

const insightsMap: Record<string, InsightLevels> = {
  'Fluid Reasoning (GF)': {
    superior: 'Performance indicates a highly developed capacity for novel problem-solving and recognizing complex patterns without relying on prior knowledge.',
    aboveAverage: 'Demonstrates strong capabilities in abstract thinking and logical deduction relative to the reference group.',
    average: 'Functions within the typical range for identifying relationships and solving novel problems.',
    belowAverage: 'Shows slightly below average efficiency in abstract reasoning. Practice with novel problem-solving may be beneficial.',
    low: 'Performance in adapting to novel, complex logic problems was below average relative to the reference group.'
  },
  'Crystallized Knowledge (GC)': {
    superior: 'Indicates an extensive depth of acquired knowledge, vocabulary, and ability to apply learned information effectively.',
    aboveAverage: 'Demonstrates a strong repository of general information and learned concepts.',
    average: 'Performance reflects typical acquisition and application of general knowledge and experience.',
    belowAverage: 'Slightly below average in utilizing prior learning and generalized knowledge.',
    low: 'Performance indicates difficulties in retrieving or applying acquired cultural and educational knowledge.'
  },
  'Working Memory (GWM)': {
    superior: 'Demonstrates exceptional ability to hold, manipulate, and process multiple pieces of information simultaneously.',
    aboveAverage: 'Shows strong capacity for short-term information retention and active mental manipulation.',
    average: 'Working memory capacity falls within the expected normative range for handling temporary information.',
    belowAverage: 'Slightly below average capacity to maintain and manipulate information in active awareness.',
    low: 'Performance suggests challenges in retaining and processing multiple pieces of information simultaneously.'
  },
  'Processing Speed (Gs)': {
    superior: 'Indicates exceptionally rapid and accurate cognitive processing of simple or repetitive tasks.',
    aboveAverage: 'Demonstrates above-average mental quickness and efficiency in visual scanning and decision-making.',
    average: 'Processing speed is within the typical range, reflecting standard cognitive efficiency.',
    belowAverage: 'Performance reflects slightly slower cognitive processing or visual scanning relative to peers.',
    low: 'Indicates below-average speed in executing simple, repetitive cognitive tasks.'
  },
  'Visual-Spatial Processing (Gv)': {
    superior: 'Shows highly advanced ability to perceive, analyze, and mentally manipulate visual patterns and shapes.',
    aboveAverage: 'Demonstrates strong spatial orientation and visual problem-solving skills.',
    average: 'Performance in mental rotation and spatial visualization is typical for the reference group.',
    belowAverage: 'Slightly below average efficiency in processing complex visual imagery and spatial relationships.',
    low: 'Performance indicates difficulties in mentally manipulating or analyzing visual-spatial information.'
  },
  'Auditory Processing (Ga)': {
    superior: 'Indicates exceptional ability to analyze, synthesize, and discriminate auditory stimuli.',
    aboveAverage: 'Demonstrates above-average auditory discrimination and phonetic processing capabilities.',
    average: 'Auditory processing falls within the expected typical range.',
    belowAverage: 'Slightly below average efficiency in processing complex auditory information.',
    low: 'Performance indicates challenges in discriminating or manipulating auditory patterns.'
  },
  'Long-Term Retrieval (Glr)': {
    superior: 'Demonstrates highly efficient storage of information and exceptional fluency in retrieving it over time.',
    aboveAverage: 'Shows strong capabilities in learning new concepts and retrieving them effectively.',
    average: 'Memory consolidation and retrieval functions operate within the typical average range.',
    belowAverage: 'Slightly below average efficiency in recalling stored information fluently.',
    low: 'Performance suggests difficulties in long-term information consolidation or retrieval fluency.'
  },
  'Quantitative Knowledge (Gq)': {
    superior: 'Indicates highly developed mathematical reasoning and fluency with complex quantitative concepts.',
    aboveAverage: 'Demonstrates strong mathematical problem-solving skills and numerical facility.',
    average: 'Quantitative reasoning abilities fall within the standard normative range.',
    belowAverage: 'Performance reflects slightly below average mathematical logic or numerical manipulation skills.',
    low: 'Indicates challenges in applying mathematical concepts or quantitative logic.'
  },
  'Reading & Writing (Grw)': {
    superior: 'Demonstrates exceptional literacy skills, including reading comprehension and written expression.',
    aboveAverage: 'Shows strong capabilities in reading fluency and writing skills relative to peers.',
    average: 'Basic reading and writing skills operate within the typical average range.',
    belowAverage: 'Slightly below average proficiency in written language comprehension or expression.',
    low: 'Performance suggests difficulties in fundamental reading or writing operations.'
  }
};

export const getPerformanceInsight = (domain: string, score: number | null): string => {
  if (score === null || isNaN(score) || score === 0) {
    return "Not evaluated in this assessment version.";
  }
  
  const insights = insightsMap[domain];
  
  if (!insights) {
    // Fallback logic if domain string isn't in map
    if (score >= 130) {
      return `Your performance in ${domain} is well above average, indicating a highly developed ability to process and manipulate this type of information efficiently.`;
    } else if (score >= 115) {
      return `Your performance in ${domain} is above average. You demonstrated strong capabilities in these cognitive tasks relative to the reference group.`;
    } else if (score >= 85) {
      return `Your performance in ${domain} is within the average range. This suggests typical capabilities in handling these specific cognitive operations.`;
    } else if (score >= 70) {
      return `Your performance in ${domain} was slightly below the average range. Practice in this specific cognitive area may improve future efficiency.`;
    } else {
      return `Your performance in ${domain} was below average relative to the reference group.`;
    }
  }

  if (score >= 130) return insights.superior;
  if (score >= 115) return insights.aboveAverage;
  if (score >= 85) return insights.average;
  if (score >= 70) return insights.belowAverage;
  return insights.low;
};
