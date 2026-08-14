// Pre-built roadmap data modeled after roadmap.sh
// Each roadmap has nodes (positioned), connections, and metadata

export const ROADMAP_CATEGORIES = [
  { id: 'all', label: 'All Roadmaps', count: 0 }, // count computed dynamically
  { id: 'role', label: 'Role Based', count: 0 },
  { id: 'skill', label: 'Skill Based', count: 0 },
  { id: 'tool', label: 'Tools', count: 0 },
  { id: 'language', label: 'Languages', count: 0 },
  { id: 'framework', label: 'Frameworks', count: 0 },
  { id: 'database', label: 'Databases', count: 0 },
  { id: 'mobile', label: 'Mobile', count: 0 },
  { id: 'concept', label: 'Concepts', count: 0 },
  { id: 'beginner', label: 'Absolute Beginners', count: 0 },
  { id: 'best-practices', label: 'Best Practices', count: 0 },
];

// Node types
export const NODE_TYPES = {
  TOPIC: 'topic',           // Yellow bg — key topics to learn
  CHECKPOINT: 'checkpoint', // Dark bg — project ideas / milestones
  SECTION: 'section',       // Text label — section marker
  ANNOTATION: 'annotation', // Light bordered box — explanatory text
  SUBTOPIC: 'subtopic',     // Smaller yellow/orange — sub-skill inside a topic
};

// Connection types
export const CONN_TYPES = {
  SOLID: 'solid',
  DASHED: 'dashed',
};

import { GENERATED_ROADMAPS } from './generatedRoadmaps';
import { 
  aiAgentsRoadmap, aiDataScientistRoadmap, aiEngineerRoadmap, aiProductBuilderRoadmap, aiRedTeamingRoadmap,
  androidRoadmap, angularRoadmap, apiDesignRoadmap, aspnetCoreRoadmap, awsRoadmap,
  backendBeginnerRoadmap, biAnalystRoadmap, blockchainRoadmap, cRoadmap, claudeCodeRoadmap,
  cloudflareRoadmap, computerScienceRoadmap, cppRoadmap, cssRoadmap, cyberSecurityRoadmap, dataAnalystRoadmap,
  dataEngineerRoadmap, dsaRoadmap, designSystemRoadmap, devopsBeginnerRoadmap, devopsRoadmap,
  devrelRoadmap, devsecopsRoadmap, djangoRoadmap, dockerRoadmap, elasticsearchRoadmap,
  engineeringManagerRoadmap, flutterRoadmap, forwardDeployedEngineerRoadmap, frontendBeginnerRoadmap, gameDeveloperRoadmap,
  gitGithubBeginnerRoadmap, gitGithubRoadmap, golangRoadmap, htmlRoadmap, iosRoadmap,
  javaRoadmap, javascriptRoadmap, kotlinRoadmap, kubernetesRoadmap, laravelRoadmap,
  leetcodeRoadmap, linuxRoadmap, machineLearningRoadmap, mlopsRoadmap, mongodbRoadmap,
  networkEngineerRoadmap, nextjsRoadmap, nodejsRoadmap, openclawRoadmap, phpRoadmap,
  postgresqlDbaRoadmap, productManagerRoadmap, promptEngineeringRoadmap, pythonDataAnalysisRoadmap, qaRoadmap,
  reactNativeRoadmap, reactRoadmap, redisRoadmap, rubyOnRailsRoadmap, rubyRoadmap,
  rustRoadmap, scalaRoadmap, serverSideGameDeveloperRoadmap, shellBashRoadmap, softwareArchitectRoadmap,
  softwareDesignArchitectureRoadmap, springBootRoadmap, sqlRoadmap, swiftUiRoadmap, systemDesignRoadmap,
  technicalWriterRoadmap, terraformRoadmap, typescriptRoadmap, uxDesignRoadmap, vibeCodingRoadmap,
  vueRoadmap, wordpressRoadmap,
  backendRoadmap, frontendRoadmap, fullStackRoadmap, pythonRoadmap,
  productDesignRoadmap, graphqlRoadmap, powerBiRoadmap, codeReviewRoadmap
} from './manualRoadmaps';

// ============================
// EXPORTS
// ============================

// Full roadmaps with flowchart data
export const DETAILED_ROADMAPS = [
  fullStackRoadmap,
  frontendRoadmap,
  backendRoadmap,
  pythonRoadmap,
  aiAgentsRoadmap,
  aiDataScientistRoadmap,
  aiEngineerRoadmap,
  aiProductBuilderRoadmap,
  aiRedTeamingRoadmap,
  androidRoadmap,
  angularRoadmap,
  apiDesignRoadmap,
  aspnetCoreRoadmap,
  awsRoadmap,
  backendBeginnerRoadmap,
  biAnalystRoadmap,
  blockchainRoadmap,
  cRoadmap,
  claudeCodeRoadmap,
  cloudflareRoadmap,
  computerScienceRoadmap,
  cppRoadmap,
  cssRoadmap,
  cyberSecurityRoadmap,
  dataAnalystRoadmap,
  dataEngineerRoadmap,
  dsaRoadmap,
  designSystemRoadmap,
  devopsBeginnerRoadmap,
  devopsRoadmap,
  devrelRoadmap,
  devsecopsRoadmap,
  djangoRoadmap,
  dockerRoadmap,
  elasticsearchRoadmap,
  engineeringManagerRoadmap,
  flutterRoadmap,
  forwardDeployedEngineerRoadmap,
  frontendBeginnerRoadmap,
  gameDeveloperRoadmap,
  gitGithubBeginnerRoadmap,
  gitGithubRoadmap,
  golangRoadmap,
  htmlRoadmap,
  iosRoadmap,
  javaRoadmap,
  javascriptRoadmap,
  kotlinRoadmap,
  kubernetesRoadmap,
  laravelRoadmap,
  leetcodeRoadmap,
  linuxRoadmap,
  machineLearningRoadmap,
  mlopsRoadmap,
  mongodbRoadmap,
  networkEngineerRoadmap,
  nextjsRoadmap,
  nodejsRoadmap,
  openclawRoadmap,
  phpRoadmap,
  postgresqlDbaRoadmap,
  productManagerRoadmap,
  promptEngineeringRoadmap,
  pythonDataAnalysisRoadmap,
  qaRoadmap,
  reactNativeRoadmap,
  reactRoadmap,
  redisRoadmap,
  rubyOnRailsRoadmap,
  rubyRoadmap,
  rustRoadmap,
  scalaRoadmap,
  serverSideGameDeveloperRoadmap,
  shellBashRoadmap,
  softwareArchitectRoadmap,
  softwareDesignArchitectureRoadmap,
  springBootRoadmap,
  sqlRoadmap,
  swiftUiRoadmap,
  systemDesignRoadmap,
  technicalWriterRoadmap,
  terraformRoadmap,
  typescriptRoadmap,
  uxDesignRoadmap,
  vibeCodingRoadmap,
  vueRoadmap,
  wordpressRoadmap,
  productDesignRoadmap,
  graphqlRoadmap,
  powerBiRoadmap,
  codeReviewRoadmap,
  ...GENERATED_ROADMAPS.filter(r => ![
    'ai-agents', 'ai-data-scientist', 'ai-engineer', 'ai-product-builder', 'ai-red-teaming',
    'android', 'angular', 'api-design', 'aspnet-core', 'aws',
    'backend-beginner', 'bi-analyst', 'blockchain', 'c', 'claude-code',
    'cloudflare', 'computer-science', 'cpp', 'css', 'cyber-security', 'data-analyst',
    'data-engineer', 'datastructures-and-algorithms', 'design-system', 'devops-beginner', 'devops',
    'devrel', 'devsecops', 'django', 'docker', 'elasticsearch',
    'engineering-manager', 'flutter', 'forward-deployed-engineer', 'frontend-beginner', 'game-developer',
    'git-github-beginner', 'git-github', 'golang', 'html', 'ios',
    'java', 'javascript', 'kotlin', 'kubernetes', 'laravel',
    'leetcode', 'linux', 'machine-learning', 'mlops', 'mongodb',
    'network-engineer', 'nextjs', 'nodejs', 'openclaw', 'php',
    'postgresql-dba', 'product-manager', 'prompt-engineering', 'python-data-analysis', 'qa',
    'react-native', 'react', 'redis', 'ruby-on-rails', 'ruby',
    'rust', 'scala', 'server-side-game-developer', 'shell-bash', 'software-architect',
    'software-design-architecture', 'spring-boot', 'sql', 'swift-ui', 'system-design',
    'technical-writer', 'terraform', 'typescript', 'ux-design', 'vibe-coding',
    'vue', 'wordpress', 'product-design', 'graphql', 'power-bi', 'code-review'
  ].includes(r.id)),
];

// All roadmaps (detailed + stubs) for the browser listing
export const ALL_ROADMAPS = DETAILED_ROADMAPS.map(r => ({
  id: r.id,
  title: r.title,
  description: r.description,
  category: r.category,
  hasFlowchart: true,
}));

// Get a detailed roadmap by ID
export const getRoadmapById = (id) => DETAILED_ROADMAPS.find(r => r.id === id);

// Get roadmaps filtered by category
export const getRoadmapsByCategory = (category) => {
  if (category === 'all') return ALL_ROADMAPS;
  return ALL_ROADMAPS.filter(r => r.category === category);
};

// Get category counts
export const getCategoryCounts = () => {
  const counts = { all: ALL_ROADMAPS.length };
  for (const r of ALL_ROADMAPS) {
    counts[r.category] = (counts[r.category] || 0) + 1;
  }
  return counts;
};

// New roadmaps (featured / recently added)
export const NEW_ROADMAPS = ['product-design', 'prompt-engineering', 'ai-engineer', 'mlops'];
