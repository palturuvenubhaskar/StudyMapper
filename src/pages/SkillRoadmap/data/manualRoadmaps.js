// Hand-crafted pixel-perfect representations of roadmaps based on PDFs
import { NODE_TYPES } from './roadmapData';

export const aiAgentsRoadmap = {
  id: 'ai-agents',
  title: 'AI Agents',
  description: 'Step by step guide to building AI Agents in 2026',
  layout: 'linear',
  category: 'role',
  subscriberCount: '12,400',
  faq: {
    question: 'What are AI Agents?',
    answer: 'AI Agents are autonomous or semi-autonomous systems driven by Large Language Models that can perceive their environment, reason, plan, and take actions using tools.'
  },
  items: [
    {
      id: 'prereq-label',
      title: 'Learn the Pre-requisites',
      type: 'section',
      children: [
        { id: 'backend-dev', title: 'Basic Backend Development', type: 'topic', link: { id: 'backend-beginner', title: 'Backend Beginner Roadmap' } },
        { id: 'git-terminal', title: 'Git and Terminal Usage', type: 'topic', link: { id: 'git-and-github', title: 'Git and GitHub Roadmap' } },
        { id: 'rest-api', title: 'REST API Knowledge', type: 'topic', link: { id: 'api-design', title: 'API Design Roadmap' } }
      ]
    },
    {
      id: 'llm-fundamentals',
      title: 'LLM Fundamentals',
      type: 'section',
      children: [
        { id: 'open-weight', title: 'Open Weight Models', type: 'topic' },
        { id: 'closed-weight', title: 'Closed Weight Models', type: 'topic' },
        {
          id: 'transformers',
          title: 'Transformer Models and LLMs',
          type: 'topic',
          children: [
            {
              id: 'mechanics-label',
              title: 'Model Mechanics',
              type: 'subgroup',
              children: [
                { id: 'tokenization', title: 'Tokenization', type: 'subtopic' },
                { id: 'context-windows', title: 'Context Windows', type: 'subtopic' },
                { id: 'token-pricing', title: 'Token Based Pricing', type: 'subtopic' }
              ]
            },
            {
              id: 'gen-controls-label',
              title: 'Generation Controls',
              type: 'subgroup',
              children: [
                { id: 'temperature', title: 'Temperature', type: 'subtopic' },
                { id: 'top-p', title: 'Top-p', type: 'subtopic' },
                { id: 'freq-penalty', title: 'Frequency Penalty', type: 'subtopic' },
                { id: 'pres-penalty', title: 'Presence Penalty', type: 'subtopic' },
                { id: 'stop-criteria', title: 'Stopping Criteria', type: 'subtopic' },
                { id: 'max-length', title: 'Max Length', type: 'subtopic' }
              ]
            }
          ]
        },
        { id: 'model-families', title: 'Model Families and Licences', type: 'topic' },
        {
          id: 'understand-basics',
          title: 'Understand the Basics',
          type: 'topic',
          children: [
            { id: 'stream-vs-unstream', title: 'Streamed vs Unstreamed Responses', type: 'subtopic' },
            { id: 'reason-vs-standard', title: 'Reasoning vs Standard Models', type: 'subtopic' },
            { id: 'finetune-vs-prompt', title: 'Fine-tuning vs Prompt Engineering', type: 'subtopic' },
            { id: 'embeddings', title: 'Embeddings and Vector Search', type: 'subtopic' },
            { id: 'rag-basics', title: 'Understand the Basics of RAG', type: 'subtopic' },
            { id: 'pricing-models', title: 'Pricing of Common Models', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ai-agents-101',
      title: 'AI Agents 101',
      type: 'section',
      children: [
        { id: 'what-are-agents', title: 'What are AI Agents?', type: 'topic' },
        { id: 'what-are-tools', title: 'What are Tools?', type: 'topic' },
        {
          id: 'agent-loop',
          title: 'Agent Loop',
          type: 'topic',
          children: [
            { id: 'step1', title: '1. Perception / User Input', type: 'subtopic' },
            { id: 'step2', title: '2. Reason and Plan', type: 'subtopic' },
            { id: 'step3', title: '3. Acting / Tool Invocation', type: 'subtopic' },
            { id: 'step4', title: '4. Observation & Reflection', type: 'subtopic' }
          ]
        },
        {
          id: 'usecases-label',
          title: 'Example Usecases',
          type: 'topic',
          children: [
            { id: 'personal-assistant', title: 'Personal assistant', type: 'subtopic' },
            { id: 'code-gen', title: 'Code generation', type: 'subtopic' },
            { id: 'data-analysis', title: 'Data analysis', type: 'subtopic' },
            { id: 'web-scraping', title: 'Web Scraping / Crawling', type: 'subtopic' },
            { id: 'npc-game', title: 'NPC / Game AI', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'prompt-eng-sec',
      title: 'Prompt Engineering',
      type: 'section',
      children: [
        { id: 'prompt-eng-left', title: 'What is Prompt Engineering', type: 'topic' },
        {
          id: 'writing-prompts-label',
          title: 'Writing Good Prompts',
          type: 'topic',
          link: { id: 'prompt-engineering', title: 'Prompt Engineering Roadmap' },
          children: [
            { id: 'be-specific', title: 'Be specific in what you want', type: 'subtopic' },
            { id: 'provide-context', title: 'Provide additional context', type: 'subtopic' },
            { id: 'tech-terms', title: 'Use relevant technical terms', type: 'subtopic' },
            { id: 'use-examples', title: 'Use Examples in your Prompt', type: 'subtopic' },
            { id: 'iterate-test', title: 'Iterate and Test your Prompts', type: 'subtopic' },
            { id: 'specify-format', title: 'Specify Length, format etc', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tools-actions',
      title: 'Tools / Actions',
      type: 'section',
      children: [
        {
          id: 'tool-definition',
          title: 'Tool Definition',
          type: 'topic',
          children: [
            { id: 'td-1', title: 'Name and Description', type: 'subtopic' },
            { id: 'td-2', title: 'Input / Output Schema', type: 'subtopic' },
            { id: 'td-3', title: 'Error Handling', type: 'subtopic' },
            { id: 'td-4', title: 'Usage Examples', type: 'subtopic' }
          ]
        },
        {
          id: 'example-tools-label',
          title: 'Examples of Tools',
          type: 'topic',
          children: [
            { id: 'web-search', title: 'Web Search', type: 'subtopic' },
            { id: 'code-exec', title: 'Code Execution / REPL', type: 'subtopic' },
            { id: 'db-queries', title: 'Database Queries', type: 'subtopic' },
            { id: 'api-req', title: 'API Requests', type: 'subtopic' },
            { id: 'email-slack', title: 'Email / Slack / SMS', type: 'subtopic' },
            { id: 'file-system', title: 'File System Access', type: 'subtopic' }
          ]
        },
        {
          id: 'mcp',
          title: 'Model Context Protocol (MCP)',
          type: 'topic',
          children: [
            {
              id: 'mcp-label',
              title: 'Core Components',
              type: 'subgroup',
              children: [
                { id: 'mcp-hosts', title: 'MCP Hosts', type: 'subtopic' },
                { id: 'mcp-client', title: 'MCP Client', type: 'subtopic' },
                { id: 'mcp-servers', title: 'MCP Servers', type: 'subtopic' }
              ]
            },
            {
              id: 'creating-mcp',
              title: 'Creating MCP Servers',
              type: 'subgroup',
              children: [
                {
                  id: 'deploy-modes-label',
                  title: 'Deployment Modes',
                  type: 'subgroup',
                  children: [
                    { id: 'local-desktop', title: 'Local Desktop', type: 'subtopic' },
                    { id: 'remote-cloud', title: 'Remote / Cloud', type: 'subtopic' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'agent-memory-sec',
      title: 'Agent Memory',
      type: 'section',
      children: [
        { id: 'what-is-memory', title: 'What is Agent Memory?', type: 'topic' },
        {
          id: 'ep-vs-sem',
          title: 'Episodic vs Semantic Memory',
          type: 'topic',
          children: [
            { id: 'short-term', title: 'Short Term Memory', type: 'subtopic', description: 'Within Prompt' },
            { id: 'long-term', title: 'Long Term Memory', type: 'subtopic', description: 'Vector DB / SQL / Custom' }
          ]
        },
        {
          id: 'maintaining-memory-label',
          title: 'Maintaining Memory',
          type: 'topic',
          children: [
            { id: 'rag-vector', title: 'RAG and Vector Databases', type: 'subtopic' },
            { id: 'user-profile', title: 'User Profile Storage', type: 'subtopic' },
            { id: 'summarization', title: 'Summarization / Compression', type: 'subtopic' },
            { id: 'forgetting', title: 'Forgetting / Aging Strategies', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'agent-arch-sec',
      title: 'Agent Architectures',
      type: 'section',
      children: [
        {
          id: 'common-arch',
          title: 'Common Architectures',
          type: 'topic',
          children: [
            { id: 'rag-agent', title: 'RAG Agent', type: 'subtopic' },
            { id: 'react-agent', title: 'ReAct (Reason + Act)', type: 'subtopic' },
            { id: 'cot-agent', title: 'Chain of Thought (CoT)', type: 'subtopic' }
          ]
        },
        {
          id: 'other-arch',
          title: 'Other Architecture Patterns',
          type: 'topic',
          children: [
            { id: 'planner-exec', title: 'Planner Executor', type: 'subtopic' },
            { id: 'dag-agent', title: 'DAG Agents', type: 'subtopic' },
            { id: 'tot-agent', title: 'Tree-of-Thought', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'building-agents',
      title: 'Building Agents',
      type: 'section',
      children: [
        {
          id: 'manual-scratch',
          title: 'Manual (from scratch)',
          type: 'topic',
          children: [
            { id: 'man-1', title: 'Direct LLM API calls', type: 'subtopic' },
            { id: 'man-2', title: 'Implementing the agent loop', type: 'subtopic' },
            { id: 'man-3', title: 'Parsing model output', type: 'subtopic' },
            { id: 'man-4', title: 'Error & Rate-limit handling', type: 'subtopic' }
          ]
        },
        {
          id: 'using-frameworks',
          title: 'Building Using Frameworks',
          type: 'topic',
          children: [
            { id: 'fw-langchain', title: 'Langchain', type: 'subtopic' },
            { id: 'fw-llamaindex', title: 'LlamaIndex', type: 'subtopic' },
            { id: 'fw-haystack', title: 'Haystack', type: 'subtopic' },
            { id: 'fw-autogen', title: 'AutoGen', type: 'subtopic' },
            { id: 'fw-crewai', title: 'CrewAI', type: 'subtopic' },
            { id: 'fw-smoldepot', title: 'Smol Depot', type: 'subtopic' }
          ]
        },
        {
          id: 'fn-calling',
          title: 'LLM Native "Function Calling"',
          type: 'topic',
          children: [
            { id: 'fn-openai-fun', title: 'OpenAI Functions Calling', type: 'subtopic' },
            { id: 'fn-openai-ast', title: 'OpenAI Assistant API', type: 'subtopic' },
            { id: 'fn-gemini', title: 'Gemini Function Calling', type: 'subtopic' },
            { id: 'fn-anthropic', title: 'Anthropic Tool Use', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'eval-sec',
      title: 'Evaluation and Testing',
      type: 'section',
      children: [
        { id: 'eval-metrics', title: 'Metrics to Track', type: 'topic' },
        { id: 'eval-unit', title: 'Unit Testing for Individual Tools', type: 'topic' },
        { id: 'eval-integ', title: 'Integration Testing for Flows', type: 'topic' },
        { id: 'eval-human', title: 'Human in the Loop Evaluation', type: 'topic' },
        {
          id: 'eval-frameworks',
          title: 'Frameworks',
          type: 'topic',
          children: [
            { id: 'eval-langsmith', title: 'LangSmith', type: 'subtopic' },
            { id: 'eval-deepeval', title: 'DeepEval', type: 'subtopic' },
            { id: 'eval-ragas', title: 'Ragas', type: 'subtopic' }
          ]
        },
        {
          id: 'eval-debug',
          title: 'Debugging and Monitoring',
          type: 'topic',
          children: [
            { id: 'eval-logging', title: 'Structured logging & tracing', type: 'subtopic' }
          ]
        },
        {
          id: 'eval-observability',
          title: 'Observability Tools',
          type: 'topic',
          children: [
            { id: 'eval-obs-lang', title: 'LangSmith', type: 'subtopic' },
            { id: 'eval-obs-hel', title: 'Helicone', type: 'subtopic' },
            { id: 'eval-obs-fuse', title: 'LangFuse', type: 'subtopic' },
            { id: 'eval-obs-open', title: 'openllmetry', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'security-sec',
      title: 'Security & Ethics',
      type: 'section',
      children: [
        { id: 'sec-1', title: 'Prompt Injection / Jailbreaks', type: 'topic' },
        { id: 'sec-2', title: 'Tool sandboxing / Permissioning', type: 'topic' },
        { id: 'sec-3', title: 'Data Privacy + PII Redaction', type: 'topic' },
        { id: 'sec-4', title: 'Bias & Toxicity Guardrails', type: 'topic' },
        { id: 'sec-5', title: 'Safety + Red Team Testing', type: 'topic' }
      ]
    },
    {
      id: 'related-footer',
      title: 'Related Roadmaps',
      type: 'section',
      children: [
        { id: 'footer-btn-1', title: 'AI Engineer Roadmap', type: 'topic', link: { id: 'ai-engineer', title: 'AI Engineer' } },
        { id: 'footer-btn-2', title: 'AI and Data Scientist Roadmap', type: 'topic', link: { id: 'ai-data-scientist', title: 'AI & Data Scientist' } },
        { id: 'related-3', title: 'MLOps Roadmap', type: 'topic' },
        { id: 'related-4', title: 'AI Red Teaming Roadmap', type: 'topic' },
        { id: 'related-5', title: 'Prompt Engineering Roadmap', type: 'topic' }
      ]
    }
  ]
};
export const aiDataScientistRoadmap = {
  id: 'ai-data-scientist',
  title: 'AI and Data Scientist',
  description: 'Step by step guide to becoming an AI and Data Scientist in 2026',
  layout: 'linear',
  category: 'role',
  subscriberCount: '45,200',
  faq: {
    question: 'What is an AI and Data Scientist?',
    answer: 'An AI and Data Scientist combines strong statistical and mathematical foundations with machine learning and coding to extract insights from data and build intelligent models.'
  },
  items: [
    {
      id: 'math',
      title: '1. Mathematics',
      type: 'topic',
      children: [
        { id: 'math-1', title: 'Linear Algebra, Calculus, Mathematical Analysis', type: 'subtopic' },
        { id: 'math-2', title: 'Mathematics for Machine Learning', type: 'subtopic' },
        { id: 'math-3', title: 'Differential Calculus', type: 'subtopic' }
      ]
    },
    {
      id: 'stats',
      title: '2. Statistics',
      type: 'topic',
      children: [
        { id: 'stats-1', title: 'Statistics, CLT', type: 'subtopic' },
        { id: 'stats-2', title: 'Hypothesis Testing', type: 'subtopic' },
        { id: 'stats-3', title: 'Probability and Sampling', type: 'subtopic' },
        { id: 'stats-4', title: 'AB Testing', type: 'subtopic' }
      ]
    },
    {
      id: 'econometrics',
      title: '3. Econometrics',
      type: 'topic',
      children: [
        { id: 'econ-1', title: 'Pre-requisites of Econometrics', type: 'subtopic' },
        { id: 'econ-2', title: 'Regression, Timeseries, Fitting Distributions', type: 'subtopic' }
      ]
    },
    {
      id: 'coding',
      title: '4. Coding',
      type: 'topic',
      children: [
        { id: 'code-1', title: 'Learn Python Programming Language', type: 'subtopic' },
        { id: 'code-2', title: 'Data Structures and Algorithms (Python)', type: 'subtopic' },
        { id: 'code-3', title: 'Learn SQL', type: 'subtopic' }
      ]
    },
    {
      id: 'eda',
      title: '5. Exploratory Data Analysis',
      type: 'topic',
      children: [
        { id: 'eda-1', title: 'Data understanding, Data Analysis and Visualization', type: 'subtopic' },
        { id: 'eda-2', title: 'Exploratory Data Analysis with Python and Pandas', type: 'subtopic' }
      ]
    },
    {
      id: 'ml',
      title: '6. Machine Learning',
      type: 'topic',
      children: [
        { id: 'ml-1', title: 'Classic ML (Sup., Unsup.), Advanced ML', type: 'subtopic' },
        { id: 'ml-2', title: 'Machine Learning Specialization', type: 'subtopic' },
        { id: 'ml-3', title: 'Pattern Recognition', type: 'subtopic' }
      ]
    },
    {
      id: 'dl',
      title: '7. Deep Learning',
      type: 'topic',
      children: [
        { id: 'dl-1', title: 'Fully Connected, CNN, RNN, LSTM, Transformers', type: 'subtopic' },
        { id: 'dl-2', title: 'Deep Learning Specialization', type: 'subtopic' },
        { id: 'dl-3', title: 'Attention is all you need', type: 'subtopic' }
      ]
    },
    {
      id: 'mlops',
      title: '8. MLOps',
      type: 'topic',
      children: [
        { id: 'mlops-1', title: 'Deployment Models, CI/CD', type: 'subtopic' },
        { id: 'mlops-2', title: 'MLOps Specialization', type: 'subtopic' }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Keep Learning',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Data Analyst Roadmap', type: 'topic', link: { id: 'data-analyst', title: 'Data Analyst' } },
        { id: 'related-2', title: 'Machine Learning Roadmap', type: 'topic', link: { id: 'machine-learning', title: 'Machine Learning' } },
        { id: 'related-3', title: 'Prompt Engineering Roadmap', type: 'topic', link: { id: 'prompt-engineering', title: 'Prompt Engineering' } }
      ]
    }
  ]
};
export const aiProductBuilderRoadmap = {
  id: 'ai-product-builder',
  title: 'AI Product Builder',
  description: 'Step by step guide to becoming an AI Product Builder',
  layout: 'linear',
  category: 'role',
  subscriberCount: '25,500',
  faq: {
    question: 'What is an AI Product Builder?',
    answer: 'An AI Product Builder leverages AI generation tools, vibe coding, and prompt engineering to prototype and build full AI-powered products rapidly.'
  },
  items: [
    {
      id: 'cycle',
      title: 'AI Product Creation Cycle',
      type: 'section',
      children: [
        {
          id: 'scope',
          title: 'Definition & Scope',
          type: 'topic',
          children: [
            { id: 'sc-1', title: 'Problem Definition', type: 'subtopic' },
            { id: 'sc-2', title: 'App Anatomy', type: 'subtopic' },
            { id: 'sc-3', title: 'Feature Scoping', type: 'subtopic' },
            { id: 'sc-4', title: 'Tech Stack & Constraints', type: 'subtopic' },
            { id: 'sc-5', title: 'Know your options', type: 'subtopic' }
          ]
        },
        {
          id: 'proto',
          title: '1. Prototyping',
          type: 'topic',
          children: [
            {
              id: 'choose-proto',
              title: 'Choose a Prototype Tool',
              type: 'subgroup',
              children: [
                { id: 'cp-1', title: 'AI App Builders', type: 'subtopic' },
                { id: 'cp-2', title: 'Lovable / Replit', type: 'subtopic' },
                { id: 'cp-3', title: 'Claude Design / v0', type: 'subtopic' },
                { id: 'cp-4', title: 'Hope / Bolt', type: 'subtopic' }
              ]
            },
            { id: 'feedback', title: 'Feedback & Validation', type: 'subtopic' }
          ]
        },
        {
          id: 'gen',
          title: '2. Generation',
          type: 'topic',
          children: [
            {
              id: 'ai-tools',
              title: 'Use AI-assisted Coding Tools',
              type: 'subgroup',
              children: [
                { id: 'at-1', title: 'Technical but Powerful', type: 'subtopic' },
                { id: 'at-2', title: 'Claude Code / Codex', type: 'subtopic' },
                { id: 'at-3', title: 'Cursor / Copilot', type: 'subtopic' },
                { id: 'at-4', title: 'Gemini CLI / Codex', type: 'subtopic' }
              ]
            }
          ]
        },
        {
          id: 'refine',
          title: '3. Refinement',
          type: 'topic',
          children: [
            {
              id: 'learn',
              title: 'Learn by the need',
              type: 'subgroup',
              children: [
                { id: 'ln-1', title: 'HTML / CSS / JavaScript', type: 'subtopic' },
                { id: 'ln-2', title: 'React', type: 'subtopic' },
                { id: 'ln-3', title: 'Browsers / DevTools', type: 'subtopic' },
                { id: 'ln-4', title: 'Node.js', type: 'subtopic' }
              ]
            },
            {
              id: 'change-box',
              title: 'Targeted Change',
              type: 'subgroup',
              children: [
                { id: 'tc-1', title: 'New Feature / Structural Change', type: 'subtopic' }
              ]
            }
          ]
        },
        {
          id: 'collab',
          title: '4. Collaboration',
          type: 'topic',
          children: [
            {
              id: 'test-box',
              title: 'Testing & Feedback',
              type: 'subgroup',
              children: [
                { id: 'tb-1', title: 'User Testing', type: 'subtopic' },
                { id: 'tb-2', title: 'Unit Testing', type: 'subtopic' },
                { id: 'tb-3', title: 'Integration Testing', type: 'subtopic' },
                { id: 'tb-4', title: 'E2E Testing', type: 'subtopic' }
              ]
            },
            {
              id: 'ci-box',
              title: 'Change Management & CI',
              type: 'subgroup',
              children: [
                { id: 'ci-1', title: 'GitHub / GitLab', type: 'subtopic' },
                { id: 'ci-2', title: 'Bit Cloud', type: 'subtopic' },
                { id: 'ci-3', title: 'Azure DevOps', type: 'subtopic' }
              ]
            }
          ]
        },
        {
          id: 'deploy',
          title: '5. Deployment',
          type: 'topic',
          children: [
            {
              id: 'deploy-box',
              title: 'Pick one Option for Deployment',
              type: 'subgroup',
              children: [
                { id: 'dp-1', title: 'Serverless: Cloudflare / Vercel', type: 'subtopic' },
                { id: 'dp-2', title: 'PaaS: DigitalOcean / Render / Railway', type: 'subtopic' },
                { id: 'dp-3', title: 'Cloud: AWS / Azure / GCP', type: 'subtopic' }
              ]
            },
            {
              id: 'db-box',
              title: 'Connect to a Database',
              type: 'subgroup',
              children: [
                { id: 'db-1', title: 'MongoDB / Atlas', type: 'subtopic' },
                { id: 'db-2', title: 'PostgreSQL / MySQL', type: 'subtopic' },
                { id: 'db-3', title: 'Supabase', type: 'subtopic' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Vibe Coding Roadmap', type: 'topic', link: { id: 'vibe-coding', title: 'Vibe Coding' } },
        { id: 'related-2', title: 'Claude Code Roadmap', type: 'topic', link: { id: 'claude-code', title: 'Claude Code' } },
        { id: 'related-3', title: 'Full Stack Roadmap', type: 'topic', link: { id: 'full-stack', title: 'Full Stack' } }
      ]
    }
  ]
};
export const aiEngineerRoadmap = {
  id: 'ai-engineer',
  title: 'AI Engineer',
  description: 'Step by step guide to becoming an AI Engineer in 2026',
  layout: 'linear',
  category: 'role',
  subscriberCount: '150,000',
  faq: {
    question: 'What is an AI Engineer?',
    answer: 'An AI Engineer builds AI-powered applications, combining software engineering with AI models like LLMs, RAG, and AI agents.'
  },
  items: [
    {
      id: 'prereq-sec',
      title: 'Pre-requisites (One of these)',
      type: 'section',
      children: [
        { id: 'frontend', title: 'Frontend', type: 'topic' },
        { id: 'backend', title: 'Backend', type: 'topic' },
        { id: 'fullstack', title: 'Full-Stack', type: 'topic' }
      ]
    },
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is an AI Engineer?', type: 'subtopic' },
            { id: 'in-2', title: 'AI Engineer vs ML Engineer', type: 'subtopic' },
            { id: 'in-3', title: 'Impact on Product Development', type: 'subtopic' },
            { id: 'in-4', title: 'Roles and Responsibilities', type: 'subtopic' }
          ]
        },
        { id: 'ai-agi', title: 'AI vs AGI', type: 'topic' },
        {
          id: 'llms',
          title: 'LLMs',
          type: 'topic',
          children: [
            { id: 'llm-1', title: 'Inference', type: 'subtopic' },
            { id: 'llm-2', title: 'Training', type: 'subtopic' },
            { id: 'llm-3', title: 'Pre-trained Models', type: 'subtopic' },
            { id: 'llm-4', title: 'Embeddings', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'models-sec',
      title: 'Models & API',
      type: 'section',
      children: [
        {
          id: 'pretrained',
          title: 'Using Pre-trained Models',
          type: 'topic',
          children: [
            { id: 'pt-1', title: 'Benefits of Pre-trained Models', type: 'subtopic' },
            { id: 'pt-2', title: 'Limitations and Considerations', type: 'subtopic' },
            { id: 'pt-3', title: 'OpenAI Models', type: 'subtopic' }
          ]
        },
        {
          id: 'popular',
          title: 'Popular AI Models',
          type: 'topic',
          children: [
            { id: 'pop-1', title: "Anthropic's Claude", type: 'subtopic' },
            { id: 'pop-2', title: "Google's Gemini", type: 'subtopic' },
            { id: 'pop-3', title: 'Azure AI / AWS Sagemaker', type: 'subtopic' },
            { id: 'pop-4', title: 'Hugging Face Models', type: 'subtopic' },
            { id: 'pop-5', title: 'Mistral AI / Cohere / Replicate', type: 'subtopic' }
          ]
        },
        {
          id: 'openai-api',
          title: 'OpenAI API',
          type: 'topic',
          children: [
            { id: 'oa-1', title: 'Common Terminology', type: 'subtopic' },
            { id: 'oa-2', title: 'Chat Completions API', type: 'subtopic' },
            { id: 'oa-3', title: 'Maximum Tokens', type: 'subtopic' },
            { id: 'oa-4', title: 'Token Counting', type: 'subtopic' },
            { id: 'oa-5', title: 'Pricing Considerations', type: 'subtopic' },
            { id: 'oa-6', title: 'Managing Tokens', type: 'subtopic' },
            { id: 'oa-7', title: 'Open AI Playground', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'prompt-sec',
      title: 'Prompt Engineering & Safety',
      type: 'section',
      children: [
        {
          id: 'prompt-eng',
          title: 'Prompt Engineering',
          type: 'topic',
          children: [
            { id: 'pe-1', title: 'Writing Prompts', type: 'subtopic' },
            { id: 'pe-2', title: 'Capabilities / Context Length', type: 'subtopic' },
            { id: 'pe-3', title: 'Cut-off Dates / Knowledge', type: 'subtopic' },
            { id: 'pe-4', title: 'Fine-tuning', type: 'subtopic' },
            { id: 'pe-5', title: 'Prompt Injection Attacks', type: 'subtopic' }
          ]
        },
        {
          id: 'ai-safety',
          title: 'AI Safety and Ethics',
          type: 'topic',
          children: [
            { id: 'safe-1', title: 'Security and Privacy Concerns', type: 'subtopic' },
            { id: 'safe-2', title: 'Bias and Fairness', type: 'subtopic' },
            { id: 'safe-3', title: 'Understanding AI Safety Issues', type: 'subtopic' },
            { id: 'safe-4', title: 'Safety Best Practices', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'opensource-sec',
      title: 'Open Source',
      type: 'section',
      children: [
        {
          id: 'opensource',
          title: 'Open Source AI',
          type: 'topic',
          children: [
            { id: 'os-1', title: 'Popular Open Source Models', type: 'subtopic' },
            { id: 'os-2', title: 'Hugging Face Hub', type: 'subtopic' },
            { id: 'os-3', title: 'Hugging Face Tasks', type: 'subtopic' },
            { id: 'os-4', title: 'Using Open Source Models', type: 'subtopic' },
            { id: 'os-5', title: 'Ollama / Ollama SDK', type: 'subtopic' },
            { id: 'os-6', title: 'Transformers.js', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-sec',
      title: 'Embeddings & RAG',
      type: 'section',
      children: [
        {
          id: 'embeddings',
          title: 'Embeddings & Vector Databases',
          type: 'topic',
          children: [
            { id: 'emb-1', title: 'What are Embeddings', type: 'subtopic' },
            { id: 'emb-2', title: 'OpenAI Embedding Models', type: 'subtopic' },
            { id: 'emb-3', title: 'Semantic Search', type: 'subtopic' },
            { id: 'emb-4', title: 'Data Classification', type: 'subtopic' },
            { id: 'emb-5', title: 'Use Cases for Embeddings', type: 'subtopic' },
            { id: 'emb-6', title: 'Open-Source Embeddings', type: 'subtopic' }
          ]
        },
        {
          id: 'vector-dbs',
          title: 'Vector Databases',
          type: 'topic',
          children: [
            { id: 'vd-1', title: 'Purpose and Functionality', type: 'subtopic' },
            { id: 'vd-2', title: 'Chroma / Pinecone', type: 'subtopic' },
            { id: 'vd-3', title: 'Weaviate / FAISS', type: 'subtopic' },
            { id: 'vd-4', title: 'LanceDB / Qdrant', type: 'subtopic' },
            { id: 'vd-5', title: 'Supabase / MongoDB Atlas', type: 'subtopic' },
            { id: 'vd-6', title: 'Implementing Vector Search', type: 'subtopic' }
          ]
        },
        {
          id: 'rag',
          title: 'RAG & Implementation',
          type: 'topic',
          children: [
            { id: 'rg-1', title: 'RAG Usecases', type: 'subtopic' },
            { id: 'rg-2', title: 'RAG vs Fine-tuning', type: 'subtopic' },
            { id: 'rg-3', title: 'Implementing RAG', type: 'subtopic' },
            { id: 'rg-4', title: 'Chunking / Embedding', type: 'subtopic' },
            { id: 'rg-5', title: 'Retrieval Process / Generation', type: 'subtopic' },
            { id: 'rg-6', title: 'Using SDKs Directly', type: 'subtopic' },
            { id: 'rg-7', title: 'Langchain / Llama Index', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-sec',
      title: 'Advanced Topics',
      type: 'section',
      children: [
        {
          id: 'agents',
          title: 'Building AI Agents',
          type: 'topic',
          children: [
            { id: 'ag-1', title: 'Agents Usecases', type: 'subtopic' },
            { id: 'ag-2', title: 'Prompt Engineering', type: 'subtopic' },
            { id: 'ag-3', title: 'ReAct Prompting', type: 'subtopic' },
            { id: 'ag-4', title: 'Manual Implementation', type: 'subtopic' },
            { id: 'ag-5', title: 'OpenAI Functions / Tools', type: 'subtopic' },
            { id: 'ag-6', title: 'OpenAI Assistant API', type: 'subtopic' }
          ]
        },
        {
          id: 'multimodal',
          title: 'Multimodal AI',
          type: 'topic',
          children: [
            { id: 'mm-1', title: 'Image Understanding', type: 'subtopic' },
            { id: 'mm-2', title: 'Image Generation', type: 'subtopic' },
            { id: 'mm-3', title: 'Video Understanding', type: 'subtopic' },
            { id: 'mm-4', title: 'Audio Processing', type: 'subtopic' },
            { id: 'mm-5', title: 'Text-to-Speech / Speech-to-Text', type: 'subtopic' },
            { id: 'mm-6', title: 'OpenAI Vision API / DALL-E API', type: 'subtopic' },
            { id: 'mm-7', title: 'Whisper API', type: 'subtopic' }
          ]
        },
        {
          id: 'dev-tools',
          title: 'Development Tools',
          type: 'topic',
          children: [
            { id: 'dt-1', title: 'AI Code Editors', type: 'subtopic' },
            { id: 'dt-2', title: 'Code Completion Tools', type: 'subtopic' },
            { id: 'dt-3', title: 'LangChain for Multimodal Apps', type: 'subtopic' },
            { id: 'dt-4', title: 'LlamaIndex for Multimodal Apps', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AI & Data Scientist Roadmap', type: 'topic', link: { id: 'ai-data-scientist', title: 'AI & Data Scientist' } },
        { id: 'related-2', title: 'Prompt Engineering Roadmap', type: 'topic', link: { id: 'prompt-engineering', title: 'Prompt Engineering' } },
        { id: 'related-3', title: 'Data Analyst Roadmap', type: 'topic', link: { id: 'data-analyst', title: 'Data Analyst' } }
      ]
    }
  ]
};
export const aiRedTeamingRoadmap = {
  id: 'ai-red-teaming',
  title: 'AI Red Teaming',
  description: 'Step by step guide to AI Red Teaming',
  layout: 'linear',
  category: 'role',
  subscriberCount: '18,300',
  faq: {
    question: 'What is AI Red Teaming?',
    answer: 'AI Red Teaming is the practice of systematically testing AI models (especially LLMs) for vulnerabilities, biases, toxicity, and security flaws like prompt injection.'
  },
  items: [
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Why Red Team AI Systems?', type: 'subtopic' },
            { id: 'in-2', title: 'Ethical Considerations', type: 'subtopic' },
            { id: 'in-3', title: 'Role of Red Teams', type: 'subtopic' },
            { id: 'in-4', title: 'Foundational Knowledge', type: 'subtopic' }
          ]
        },
        {
          id: 'ai-ml',
          title: 'AI / ML Fundamentals',
          type: 'topic',
          children: [
            { id: 'am-1', title: 'Supervised Learning', type: 'subtopic' },
            { id: 'am-2', title: 'Unsupervised Learning', type: 'subtopic' },
            { id: 'am-3', title: 'Reinforcement Learning', type: 'subtopic' },
            { id: 'am-4', title: 'Neural Networks', type: 'subtopic' },
            { id: 'am-5', title: 'Generative Models', type: 'subtopic' },
            { id: 'am-6', title: 'Large Language Models', type: 'subtopic' },
            { id: 'am-7', title: 'Prompt Engineering', type: 'subtopic' }
          ]
        },
        {
          id: 'ai-sec',
          title: 'AI Security Fundamentals',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Confidentiality, Integrity, Availability', type: 'subtopic' },
            { id: 'as-2', title: 'Threat Modeling', type: 'subtopic' },
            { id: 'as-3', title: 'Cybersecurity Principles', type: 'subtopic' },
            { id: 'as-4', title: 'Risk Management', type: 'subtopic' },
            { id: 'as-5', title: 'Vulnerability Assessment', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'vuln-sec',
      title: 'Vulnerabilities & Security',
      type: 'section',
      children: [
        {
          id: 'model-vuln',
          title: 'Model Vulnerabilities',
          type: 'topic',
          children: [
            { id: 'mv-1', title: 'Jailbreak Techniques', type: 'subtopic' },
            { id: 'mv-2', title: 'Prompt Hacking', type: 'subtopic' },
            { id: 'mv-3', title: 'Safety Filter Bypasses', type: 'subtopic' },
            { id: 'mv-4', title: 'Model Weight Stealing', type: 'subtopic' }
          ]
        },
        {
          id: 'sys-sec',
          title: 'System Security',
          type: 'topic',
          children: [
            { id: 'ss-1', title: 'Prompt Injection (Direct/Indirect)', type: 'subtopic' },
            { id: 'ss-2', title: 'Unauthorized Access', type: 'subtopic' },
            { id: 'ss-3', title: 'Model Extraction', type: 'subtopic' },
            { id: 'ss-4', title: 'Data Poisoning', type: 'subtopic' },
            { id: 'ss-5', title: 'Adversarial Examples', type: 'subtopic' },
            { id: 'ss-6', title: 'Code Injection', type: 'subtopic' },
            { id: 'ss-7', title: 'Model Inversion', type: 'subtopic' },
            { id: 'ss-8', title: 'Model Manipulation', type: 'subtopic' },
            { id: 'ss-9', title: 'Insecure Deserialization', type: 'subtopic' },
            { id: 'ss-10', title: 'Remote Code Execution', type: 'subtopic' },
            { id: 'ss-11', title: 'Infrastructure Security', type: 'subtopic' },
            { id: 'ss-12', title: 'API Protection', type: 'subtopic' },
            { id: 'ss-13', title: 'Authentication', type: 'subtopic' }
          ]
        },
        {
          id: 'defense',
          title: 'Defense Strategies',
          type: 'topic',
          children: [
            { id: 'df-1', title: 'Countermeasures', type: 'subtopic' },
            { id: 'df-2', title: 'Adversarial Training', type: 'subtopic' },
            { id: 'df-3', title: 'Robust Model Design', type: 'subtopic' },
            { id: 'df-4', title: 'Continuous Monitoring', type: 'subtopic' },
            { id: 'df-5', title: 'Authentication', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-sec',
      title: 'Testing & Tools',
      type: 'section',
      children: [
        {
          id: 'testing',
          title: 'Testing Methodologies',
          type: 'topic',
          children: [
            { id: 'tm-1', title: 'Black Box Testing', type: 'subtopic' },
            { id: 'tm-2', title: 'White Box Testing', type: 'subtopic' },
            { id: 'tm-3', title: 'Grey Box Testing', type: 'subtopic' },
            { id: 'tm-4', title: 'Automated vs Manual', type: 'subtopic' },
            { id: 'tm-5', title: 'Continuous Testing', type: 'subtopic' }
          ]
        },
        {
          id: 'tools',
          title: 'Tools and Frameworks',
          type: 'topic',
          children: [
            { id: 'tf-1', title: 'Testing Platforms', type: 'subtopic' },
            { id: 'tf-2', title: 'Monitoring Solutions', type: 'subtopic' },
            { id: 'tf-3', title: 'Lab Environments', type: 'subtopic' },
            { id: 'tf-4', title: 'Benchmark Datasets', type: 'subtopic' },
            { id: 'tf-5', title: 'Custom Testing Scripts', type: 'subtopic' },
            { id: 'tf-6', title: 'Reporting Tools', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'growth-sec',
      title: 'Growth & Future',
      type: 'section',
      children: [
        {
          id: 'practical',
          title: 'Practical Experience',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Real-world Applications', type: 'subtopic' },
            { id: 'pr-2', title: 'LLM Security Testing', type: 'subtopic' },
            { id: 'pr-3', title: 'CTF Challenges', type: 'subtopic' },
            { id: 'pr-4', title: 'Agentic AI Security', type: 'subtopic' },
            { id: 'pr-5', title: 'Red Team Simulations', type: 'subtopic' },
            { id: 'pr-6', title: 'Responsible Disclosure', type: 'subtopic' }
          ]
        },
        {
          id: 'prof-dev',
          title: 'Professional Development',
          type: 'topic',
          children: [
            { id: 'pd-1', title: 'Conferences', type: 'subtopic' },
            { id: 'pd-2', title: 'Research Groups', type: 'subtopic' },
            { id: 'pd-3', title: 'Forums', type: 'subtopic' },
            { id: 'pd-4', title: 'Community Engagement', type: 'subtopic' },
            { id: 'pd-5', title: 'Specialized Courses', type: 'subtopic' },
            { id: 'pd-6', title: 'Industry Credentials', type: 'subtopic' },
            { id: 'pd-7', title: 'Certifications', type: 'subtopic' }
          ]
        },
        { id: 'emerging', title: 'Emerging Threats', type: 'topic' },
        {
          id: 'future',
          title: 'Future Directions',
          type: 'topic',
          children: [
            { id: 'fu-1', title: 'Advanced Techniques', type: 'subtopic' },
            { id: 'fu-2', title: 'Research Opportunities', type: 'subtopic' },
            { id: 'fu-3', title: 'Industry Standards', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Cyber Security Roadmap', type: 'topic', link: { id: 'cyber-security', title: 'Cyber Security' } },
        { id: 'related-2', title: 'AI Engineer Roadmap', type: 'topic', link: { id: 'ai-engineer', title: 'AI Engineer' } }
      ]
    }
  ]
};
export const androidRoadmap = {
  id: 'android',
  title: 'Android Developer',
  description: 'Step by step guide to becoming an Android Developer in 2026',
  layout: 'linear',
  category: 'role',
  subscriberCount: '135,000',
  faq: {
    question: 'What is an Android Developer?',
    answer: 'An Android Developer builds applications for the Android operating system using languages like Kotlin and Java.'
  },
  items: [
    {
      id: 'core-setup',
      title: 'Core Setup',
      type: 'section',
      children: [
        { id: 'ide', title: 'Development IDE', type: 'topic' },
        {
          id: 'language',
          title: 'Pick a Language',
          type: 'topic',
          children: [
            { id: 'lang-kotlin', title: 'Kotlin', type: 'subtopic' },
            { id: 'lang-java', title: 'Java', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals & VCS',
      type: 'section',
      children: [
        {
          id: 'fundamentals',
          title: 'The Fundamentals',
          type: 'topic',
          children: [
            { id: 'fund-1', title: 'Basics of Kotlin / Java', type: 'subtopic' },
            { id: 'fund-2', title: 'Basics of OOP', type: 'subtopic' },
            { id: 'fund-3', title: 'Data Structures and Algorithms', type: 'subtopic' },
            { id: 'fund-4', title: 'What is and how to use Gradle?', type: 'subtopic' },
            { id: 'fund-5', title: 'Create a Basic Hello World App', type: 'subtopic' }
          ]
        },
        {
          id: 'vcs',
          title: 'Version Control',
          type: 'topic',
          children: [
            { id: 'vcs-1', title: 'Git', type: 'subtopic' },
            { id: 'vcs-2', title: 'VCS Hosting', type: 'subtopic' },
            { id: 'vcs-3', title: 'GitHub / GitLab / Bitbucket', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'components-sec',
      title: 'App Components',
      type: 'section',
      children: [
        {
          id: 'components',
          title: 'App Components Overview',
          type: 'topic',
          children: [
            {
              id: 'comp-intent',
              title: 'Intent',
              type: 'subgroup',
              children: [
                { id: 'int-1', title: 'Implicit Intents / Explicit Intents', type: 'subtopic' },
                { id: 'int-2', title: 'Intent Filters', type: 'subtopic' }
              ]
            },
            {
              id: 'comp-activity',
              title: 'Activity',
              type: 'subgroup',
              children: [
                { id: 'act-1', title: 'Activity Life Cycle', type: 'subtopic' },
                { id: 'act-2', title: 'State Changes', type: 'subtopic' },
                { id: 'act-3', title: 'Tasks & Backstack', type: 'subtopic' }
              ]
            },
            {
              id: 'comp-services',
              title: 'Services',
              type: 'subgroup',
              children: [
                { id: 'svc-1', title: 'Content Provider', type: 'subtopic' },
                { id: 'svc-2', title: 'Broadcast Receiver', type: 'subtopic' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'ui-sec',
      title: 'User Interface',
      type: 'section',
      children: [
        {
          id: 'ui',
          title: 'Interface & Navigation',
          type: 'topic',
          children: [
            { id: 'ui-1', title: 'Jetpack Compose', type: 'subtopic' },
            { id: 'ui-2', title: 'Fragments', type: 'subtopic' },
            { id: 'ui-3', title: 'Navigation Components', type: 'subtopic' },
            { id: 'ui-4', title: 'App Shortcuts', type: 'subtopic' },
            { id: 'ui-5', title: 'Layouts: Frame, Linear, Relative, Constraint', type: 'subtopic' },
            { id: 'ui-6', title: 'Elements: TextView, Toast, Dialogs', type: 'subtopic' },
            { id: 'ui-7', title: 'Buttons, Bottom Sheet, ImageView, Tabs', type: 'subtopic' },
            { id: 'ui-8', title: 'EditText, RecycleView, Drawer', type: 'subtopic' },
            { id: 'ui-9', title: 'ListView, Animations', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'architecture-sec',
      title: 'Architecture & Design',
      type: 'section',
      children: [
        {
          id: 'architecture',
          title: 'Design & Architecture',
          type: 'topic',
          children: [
            {
              id: 'arch-patterns',
              title: 'Architectural Patterns',
              type: 'subgroup',
              children: [
                { id: 'ap-1', title: 'MVI / MVVM / MVP / MVC', type: 'subtopic' }
              ]
            },
            {
              id: 'design-patterns',
              title: 'Design Patterns',
              type: 'subgroup',
              children: [
                { id: 'dp-1', title: 'Repository Pattern', type: 'subtopic' },
                { id: 'dp-2', title: 'Builder Pattern', type: 'subtopic' },
                { id: 'dp-3', title: 'Factory Pattern', type: 'subtopic' },
                { id: 'dp-4', title: 'Observer Pattern', type: 'subtopic' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'storage-async-sec',
      title: 'Storage & Asynchronism',
      type: 'section',
      children: [
        {
          id: 'storage',
          title: 'Storage',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Shared Preferences', type: 'subtopic' },
            { id: 'st-2', title: 'DataStore', type: 'subtopic' },
            { id: 'st-3', title: 'Room Database', type: 'subtopic' },
            { id: 'st-4', title: 'File System', type: 'subtopic' }
          ]
        },
        {
          id: 'async',
          title: 'Asynchronism',
          type: 'topic',
          children: [
            { id: 'asy-1', title: 'Coroutines / Threads', type: 'subtopic' },
            { id: 'asy-2', title: 'Flow / WorkManager', type: 'subtopic' },
            { id: 'asy-3', title: 'RxKotlin / RxJava', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'network-common-sec',
      title: 'Network & Common Services',
      type: 'section',
      children: [
        {
          id: 'network',
          title: 'Network',
          type: 'topic',
          children: [
            { id: 'nw-1', title: 'Retrofit', type: 'subtopic' },
            { id: 'nw-2', title: 'OkHttp', type: 'subtopic' },
            { id: 'nw-3', title: 'Apollo-Android', type: 'subtopic' }
          ]
        },
        {
          id: 'common',
          title: 'Common Services',
          type: 'topic',
          children: [
            { id: 'cs-1', title: 'Timber', type: 'subtopic' },
            { id: 'cs-2', title: 'Leak Canary', type: 'subtopic' },
            { id: 'cs-3', title: 'Google Play Services', type: 'subtopic' },
            { id: 'cs-4', title: 'Google Maps', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'di-lint-sec',
      title: 'DI & Linting',
      type: 'section',
      children: [
        {
          id: 'di',
          title: 'Dependency Injection',
          type: 'topic',
          children: [
            { id: 'di-1', title: 'Dagger', type: 'subtopic' },
            { id: 'di-2', title: 'Hilt', type: 'subtopic' },
            { id: 'di-3', title: 'Koin', type: 'subtopic' },
            { id: 'di-4', title: 'Kodein', type: 'subtopic' }
          ]
        },
        {
          id: 'linting',
          title: 'Linting',
          type: 'topic',
          children: [
            { id: 'li-1', title: 'Ktlint', type: 'subtopic' },
            { id: 'li-2', title: 'Detekt', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'test-debug-sec',
      title: 'Testing & Debugging',
      type: 'section',
      children: [
        {
          id: 'testing',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'ts-1', title: 'Espresso', type: 'subtopic' },
            { id: 'ts-2', title: 'JUnit', type: 'subtopic' },
            { id: 'ts-3', title: 'Jetpack Benchmark', type: 'subtopic' }
          ]
        },
        {
          id: 'debugging',
          title: 'Debugging',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'Crashlytics', type: 'subtopic' },
            { id: 'db-2', title: 'Chucker', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'dist-sec',
      title: 'Distribution',
      type: 'section',
      children: [
        {
          id: 'distribution',
          title: 'Distribution',
          type: 'topic',
          children: [
            { id: 'ds-1', title: 'Firebase Distribution', type: 'subtopic' },
            { id: 'ds-2', title: 'Signed APK', type: 'subtopic' },
            { id: 'ds-3', title: 'Ways to distribute', type: 'subtopic' },
            { id: 'ds-4', title: 'Google Playstore', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'iOS Developer Roadmap', type: 'topic', link: { id: 'ios', title: 'iOS' } },
        { id: 'related-2', title: 'React Native Roadmap', type: 'topic', link: { id: 'react-native', title: 'React Native' } },
        { id: 'related-3', title: 'Flutter Roadmap', type: 'topic', link: { id: 'flutter', title: 'Flutter' } }
      ]
    }
  ]
};
export const angularRoadmap = {
  id: 'angular',
  title: 'Angular Developer',
  description: 'Step by step guide to becoming an Angular Developer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '112,000',
  faq: {
    question: 'What is Angular?',
    answer: 'Angular is a platform and framework for building single-page client applications using HTML and TypeScript.'
  },
  items: [
    {
      id: 'intro-arch-sec',
      title: 'Intro & Architecture',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction to Angular',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Angular and History', type: 'subtopic' },
            { id: 'in-2', title: 'Learn TypeScript Basics', type: 'subtopic' }
          ]
        },
        {
          id: 'arch',
          title: 'Angular Architecture',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Setting up a New Project', type: 'subtopic' },
            { id: 'ar-2', title: 'Module Architecture', type: 'subtopic' },
            { id: 'ar-3', title: 'Creating Modules / Feature Modules', type: 'subtopic' },
            { id: 'ar-4', title: 'Lazy Loading Modules', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'components-sec',
      title: 'Components',
      type: 'section',
      children: [
        {
          id: 'components',
          title: 'Components Overview',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Component Anatomy', type: 'subtopic' },
            { id: 'co-2', title: 'Creating Components', type: 'subtopic' },
            { id: 'co-3', title: 'Component Lifecycle', type: 'subtopic' },
            { id: 'co-4', title: 'Metadata: Selector, Styles, Standalone', type: 'subtopic' },
            { id: 'co-5', title: 'Imports, Provider, Encapsulation', type: 'subtopic' },
            { id: 'co-6', title: 'Communication: Parent-Child', type: 'subtopic' },
            { id: 'co-7', title: 'ViewChild, ContentChild', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'templates-sec',
      title: 'Templates & Data Binding',
      type: 'section',
      children: [
        {
          id: 'templates',
          title: 'Templates & Data Binding',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Understand Binding', type: 'subtopic' },
            { id: 'te-2', title: 'Property / Attribute Binding', type: 'subtopic' },
            { id: 'te-3', title: 'Event / Two-way Binding', type: 'subtopic' },
            { id: 'te-4', title: 'Template Syntax: @if @else @for', type: 'subtopic' },
            { id: 'te-5', title: '@switch @defer @let', type: 'subtopic' },
            { id: 'te-6', title: 'Control Flow', type: 'subtopic' },
            { id: 'te-7', title: 'Template Ref Vars', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'directives-sec',
      title: 'Directives & Pipes',
      type: 'section',
      children: [
        {
          id: 'dir-pipes',
          title: 'Directives & Pipes',
          type: 'topic',
          children: [
            {
              id: 'directives',
              title: 'Directives',
              type: 'subgroup',
              children: [
                { id: 'di-1', title: 'Structural Directives', type: 'subtopic' },
                { id: 'di-2', title: 'Attribute Directives', type: 'subtopic' },
                { id: 'di-3', title: 'Custom Directives', type: 'subtopic' }
              ]
            },
            {
              id: 'pipes',
              title: 'Pipes',
              type: 'subgroup',
              children: [
                { id: 'pi-1', title: 'Pipes Precedence', type: 'subtopic' },
                { id: 'pi-2', title: 'Common Pipes', type: 'subtopic' },
                { id: 'pi-3', title: 'Custom Pipes', type: 'subtopic' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'routing-forms-sec',
      title: 'Routing & Forms',
      type: 'section',
      children: [
        {
          id: 'routing',
          title: 'Routing',
          type: 'topic',
          children: [
            { id: 'ro-1', title: 'Router Outlets', type: 'subtopic' },
            { id: 'ro-2', title: 'Router Links', type: 'subtopic' },
            { id: 'ro-3', title: 'Router Events', type: 'subtopic' },
            { id: 'ro-4', title: 'Guards', type: 'subtopic' }
          ]
        },
        {
          id: 'forms',
          title: 'Forms',
          type: 'topic',
          children: [
            { id: 'fo-1', title: 'Reactive Forms', type: 'subtopic' },
            { id: 'fo-2', title: 'Typed Forms', type: 'subtopic' },
            { id: 'fo-3', title: 'Template-driven Forms', type: 'subtopic' },
            { id: 'fo-4', title: 'Dynamic Forms', type: 'subtopic' },
            { id: 'fo-5', title: 'Custom Validators', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'services-sec',
      title: 'Services & HTTP',
      type: 'section',
      children: [
        {
          id: 'services',
          title: 'Services & HTTP Client',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Dependency Injection', type: 'subtopic' },
            { id: 'se-2', title: 'Setting Up the Client', type: 'subtopic' },
            { id: 'se-3', title: 'Making Requests', type: 'subtopic' },
            { id: 'se-4', title: 'Writing Interceptors', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'rxjs-state-sec',
      title: 'RxJS & State',
      type: 'section',
      children: [
        {
          id: 'rxjs',
          title: 'RxJS Basics',
          type: 'topic',
          children: [
            { id: 'rx-1', title: 'Observable Pattern', type: 'subtopic' },
            { id: 'rx-2', title: 'Operators (Filtering, Transformation)', type: 'subtopic' },
            { id: 'rx-3', title: 'RxJS vs Promises', type: 'subtopic' },
            { id: 'rx-4', title: 'RxJS Interop', type: 'subtopic' }
          ]
        },
        {
          id: 'state',
          title: 'State Management',
          type: 'topic',
          children: [
            { id: 'sm-1', title: 'Signals (Inputs, Queries, Models)', type: 'subtopic' },
            { id: 'sm-2', title: 'NgRx', type: 'subtopic' },
            { id: 'sm-3', title: 'NGXS', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-sec',
      title: 'Advanced Topics',
      type: 'section',
      children: [
        {
          id: 'advanced',
          title: 'Advanced Topics',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Zoneless Applications', type: 'subtopic' },
            { id: 'ad-2', title: 'SSR / SSG / AnalogJS', type: 'subtopic' },
            { id: 'ad-3', title: 'Security (XSS, CSRF, Sanitization)', type: 'subtopic' },
            { id: 'ad-4', title: 'Performance (Deferrable Views, Hydration)', type: 'subtopic' },
            { id: 'ad-5', title: 'Animations (Transitions, Sequences)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tooling-test-sec',
      title: 'Tooling & Testing',
      type: 'section',
      children: [
        {
          id: 'tools',
          title: 'Libraries & Tools',
          type: 'topic',
          children: [
            { id: 'tl-1', title: 'Angular CLI / DevTools', type: 'subtopic' },
            { id: 'tl-2', title: 'Creating Libraries', type: 'subtopic' },
            { id: 'tl-3', title: 'UI Components', type: 'subtopic' }
          ]
        },
        {
          id: 'testing',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'ts-1', title: 'End-to-End Testing', type: 'subtopic' },
            { id: 'ts-2', title: 'Testing Services / Pipes / Directives', type: 'subtopic' },
            { id: 'ts-3', title: 'Code Coverage', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'deployment-sec',
      title: 'Deployment',
      type: 'section',
      children: [
        { id: 'deploy', title: 'Deployment', type: 'topic' }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-2', title: 'React Roadmap', type: 'topic', link: { id: 'react', title: 'React' } },
        { id: 'related-3', title: 'Vue Roadmap', type: 'topic', link: { id: 'vue', title: 'Vue' } },
        { id: 'related-4', title: 'TypeScript Roadmap', type: 'topic', link: { id: 'typescript', title: 'TypeScript' } }
      ]
    }
  ]
};
export const apiDesignRoadmap = {
  id: 'api-design',
  title: 'API Design',
  description: 'Best practices for designing modern APIs',
  layout: 'linear',
  category: 'best-practices',
  subscriberCount: '58,900',
  faq: {
    question: 'What is API Design?',
    answer: 'API Design is the process of planning and architecting programming interfaces that allow different software systems to communicate.'
  },
  items: [
    {
      id: 'http-basics-sec',
      title: 'HTTP & Basics',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Learn the Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'What are APIs', type: 'subtopic' },
            { id: 'ba-2', title: 'Understand TCP / IP', type: 'subtopic' },
            { id: 'ba-3', title: 'Basics of DNS', type: 'subtopic' }
          ]
        },
        {
          id: 'http',
          title: 'HTTP',
          type: 'topic',
          children: [
            { id: 'ht-1', title: 'HTTP Versions / Methods', type: 'subtopic' },
            { id: 'ht-2', title: 'HTTP Status Codes', type: 'subtopic' },
            { id: 'ht-3', title: 'HTTP Headers', type: 'subtopic' },
            { id: 'ht-4', title: 'Cookies / CORS', type: 'subtopic' },
            { id: 'ht-5', title: 'HTTP Caching', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'api-styles-sec',
      title: 'API Styles',
      type: 'section',
      children: [
        {
          id: 'styles',
          title: 'Different API Styles',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'RESTful APIs', type: 'subtopic' },
            { id: 'st-2', title: 'Simple JSON APIs', type: 'subtopic' },
            { id: 'st-3', title: 'SOAP APIs', type: 'subtopic' },
            { id: 'st-4', title: 'GraphQL APIs', type: 'subtopic' },
            { id: 'st-5', title: 'gRPC APIs', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'rest-apis-sec',
      title: 'REST APIs',
      type: 'section',
      children: [
        {
          id: 'rest',
          title: 'Building JSON / RESTful APIs',
          type: 'topic',
          children: [
            { id: 're-1', title: 'URL, Query & Path Parameters', type: 'subtopic' },
            { id: 're-2', title: 'Content Negotiation', type: 'subtopic' },
            { id: 're-3', title: 'REST Principles', type: 'subtopic' },
            { id: 're-4', title: 'URI Design', type: 'subtopic' },
            { id: 're-5', title: 'Versioning Strategies', type: 'subtopic' },
            { id: 're-6', title: 'Handling CRUD Operations', type: 'subtopic' },
            { id: 're-7', title: 'Pagination / Rate Limiting', type: 'subtopic' },
            { id: 're-8', title: 'Idempotency / HATEOAS', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'auth-sec',
      title: 'Authentication & Authorization',
      type: 'section',
      children: [
        {
          id: 'auth',
          title: 'Authentication & Authz',
          type: 'topic',
          children: [
            { id: 'au-1', title: 'Authentication Methods (Basic, Token, Session)', type: 'subtopic' },
            { id: 'au-2', title: 'Authorization (RBAC, ABAC)', type: 'subtopic' },
            { id: 'au-3', title: 'JWT / OAuth 2.0', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'security-perf-sec',
      title: 'Security & Performance',
      type: 'section',
      children: [
        {
          id: 'security',
          title: 'API Security',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'API Keys & Management', type: 'subtopic' },
            { id: 'se-2', title: 'Common Vulnerabilities', type: 'subtopic' },
            { id: 'se-3', title: 'API Security Best Practices', type: 'subtopic' }
          ]
        },
        {
          id: 'performance',
          title: 'API Performance',
          type: 'topic',
          children: [
            { id: 'pe-1', title: 'Performance Metrics', type: 'subtopic' },
            { id: 'pe-2', title: 'Caching Strategies', type: 'subtopic' },
            { id: 'pe-3', title: 'Load Balancing', type: 'subtopic' },
            { id: 'pe-4', title: 'Rate Limiting / Throttling', type: 'subtopic' },
            { id: 'pe-5', title: 'Profiling and Monitoring', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-design-sec',
      title: 'Testing & Design',
      type: 'section',
      children: [
        {
          id: 'testing',
          title: 'API Testing',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Unit / Integration / Functional', type: 'subtopic' },
            { id: 'te-2', title: 'Load Testing', type: 'subtopic' },
            { id: 'te-3', title: 'Performance Testing', type: 'subtopic' },
            { id: 'te-4', title: 'Mocking APIs', type: 'subtopic' },
            { id: 'te-5', title: 'Contract Testing', type: 'subtopic' }
          ]
        },
        {
          id: 'best-prac',
          title: 'Best Practices',
          type: 'topic',
          children: [
            { id: 'bp-1', title: 'RFC 7807 (Problem Details)', type: 'subtopic' },
            { id: 'bp-2', title: 'Error Handling / Retries', type: 'subtopic' },
            { id: 'bp-3', title: 'API Documentation Tools', type: 'subtopic' },
            { id: 'bp-4', title: 'Swagger / OpenAPI / Postman', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'async-arch-sec',
      title: 'Async & Architecture',
      type: 'section',
      children: [
        {
          id: 'async',
          title: 'Sync vs Async APIs',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Event Driven Architecture', type: 'subtopic' },
            { id: 'as-2', title: 'Webhooks vs Polling', type: 'subtopic' },
            { id: 'as-3', title: 'Batch Processing', type: 'subtopic' },
            { id: 'as-4', title: 'Messaging Queues (RabbitMQ, Kafka)', type: 'subtopic' },
            { id: 'as-5', title: 'Real-time APIs (Web Sockets, SSE)', type: 'subtopic' }
          ]
        },
        {
          id: 'arch',
          title: 'Architecture & Gateways',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'API Integration Patterns', type: 'subtopic' },
            { id: 'ar-2', title: 'API Gateways', type: 'subtopic' },
            { id: 'ar-3', title: 'Microservices Architecture', type: 'subtopic' },
            { id: 'ar-4', title: 'API Lifecycle Management', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'compliance-sec',
      title: 'Compliance',
      type: 'section',
      children: [
        {
          id: 'compliance',
          title: 'Standards and Compliance',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'GDPR / CCPA', type: 'subtopic' },
            { id: 'co-2', title: 'PCI DSS', type: 'subtopic' },
            { id: 'co-3', title: 'HIPAA / PII', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-2', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } }
      ]
    }
  ]
};
export const aspnetCoreRoadmap = {
  id: 'aspnet-core',
  title: 'ASP.NET Core Developer',
  description: 'Step by step guide to becoming an ASP.NET Core Developer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '89,500',
  faq: {
    question: 'What is ASP.NET Core?',
    answer: 'ASP.NET Core is a cross-platform, high-performance framework for building modern, cloud-enabled, Internet-connected apps with C#.'
  },
  items: [
    {
      id: 'csharp-basics-sec',
      title: 'C# & General Basics',
      type: 'section',
      children: [
        { id: 'csharp', title: 'Learn C#', type: 'topic' },
        {
          id: 'general',
          title: 'General Development Skills',
          type: 'topic',
          children: [
            { id: 'gen-1', title: 'Git / GitHub / GitLab', type: 'subtopic' },
            { id: 'gen-2', title: 'HTTP / HTTPS Protocol', type: 'subtopic' },
            { id: 'gen-3', title: 'Data Structures and Algorithms', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'aspnet-basics-sec',
      title: 'ASP.NET Basics',
      type: 'section',
      children: [
        {
          id: 'aspnet',
          title: 'ASP.NET Core Basics',
          type: 'topic',
          children: [
            { id: 'asp-1', title: 'MVC / REST / Minimal APIs', type: 'subtopic' },
            { id: 'asp-2', title: 'Razor Pages / Razor Components', type: 'subtopic' },
            { id: 'asp-3', title: 'Middlewares / Filters / Attributes', type: 'subtopic' },
            { id: 'asp-4', title: 'App Settings and Configs', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'db-orm-sec',
      title: 'Database & ORM',
      type: 'section',
      children: [
        {
          id: 'db',
          title: 'Database Fundamentals',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'SQL Basics / Database Design', type: 'subtopic' },
            { id: 'db-2', title: 'Stored Procedures / Constraints / Triggers', type: 'subtopic' },
            { id: 'db-3', title: 'Relational (SQL Server, PostgreSQL, MySQL)', type: 'subtopic' },
            { id: 'db-4', title: 'NoSQL (MongoDB, Redis)', type: 'subtopic' }
          ]
        },
        {
          id: 'orm',
          title: 'Object Relational Mapping',
          type: 'topic',
          children: [
            { id: 'orm-1', title: 'Entity Framework Core / Dapper', type: 'subtopic' },
            { id: 'orm-2', title: 'Code First + Migrations', type: 'subtopic' },
            { id: 'orm-3', title: 'Change Tracker API', type: 'subtopic' },
            { id: 'orm-4', title: 'Lazy, Eager, Explicit Loading', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'caching-di-sec',
      title: 'Caching & Dependency Injection',
      type: 'section',
      children: [
        {
          id: 'caching',
          title: 'Caching',
          type: 'topic',
          children: [
            { id: 'ca-1', title: 'Memory Cache / Distributed Cache', type: 'subtopic' },
            { id: 'ca-2', title: 'Entity Framework 2nd Level Cache', type: 'subtopic' },
            { id: 'ca-3', title: 'Redis / Memcached', type: 'subtopic' }
          ]
        },
        {
          id: 'di',
          title: 'Dependency Injection',
          type: 'topic',
          children: [
            { id: 'di-1', title: 'Life Cycles (Scoped, Transient, Singleton)', type: 'subtopic' },
            { id: 'di-2', title: 'DI Containers (Microsoft.Extensions, AutoFac)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'apis-cloud-sec',
      title: 'APIs, Cloud & Search',
      type: 'section',
      children: [
        {
          id: 'apis',
          title: 'API Clients & Comm.',
          type: 'topic',
          children: [
            { id: 'api-1', title: 'REST / GraphQL / gRPC', type: 'subtopic' },
            { id: 'api-2', title: 'Web Sockets / SignalR Core', type: 'subtopic' },
            { id: 'api-3', title: 'Object Mapping (AutoMapper)', type: 'subtopic' }
          ]
        },
        {
          id: 'cloud',
          title: 'Cloud & Search Engines',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Elastic Search / Solr', type: 'subtopic' },
            { id: 'cl-2', title: 'Azure / AWS (Dynamo DB, Cosmos DB)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-cicd-sec',
      title: 'Testing & CI/CD',
      type: 'section',
      children: [
        {
          id: 'testing',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'ts-1', title: 'Unit Testing (xUnit, NUnit, MSTest)', type: 'subtopic' },
            { id: 'ts-2', title: 'Integration Testing', type: 'subtopic' },
            { id: 'ts-3', title: 'E2E Testing (Playwright, Cypress)', type: 'subtopic' },
            { id: 'ts-4', title: 'Mocking (Moq, NSubstitute)', type: 'subtopic' }
          ]
        },
        {
          id: 'cicd',
          title: 'CI / CD',
          type: 'topic',
          children: [
            { id: 'ci-1', title: 'GitHub Actions / GitLab CI', type: 'subtopic' },
            { id: 'ci-2', title: 'Azure Pipelines', type: 'subtopic' },
            { id: 'ci-3', title: 'Docker / Kubernetes', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'microservices-sec',
      title: 'Microservices & Architecture',
      type: 'section',
      children: [
        {
          id: 'microservices',
          title: 'Microservices & Arch',
          type: 'topic',
          children: [
            { id: 'ms-1', title: 'Message Brokers (RabbitMQ, Kafka)', type: 'subtopic' },
            { id: 'ms-2', title: 'Message Bus (Mass Transit)', type: 'subtopic' },
            { id: 'ms-3', title: 'API Gateway (Ocelot, YARP)', type: 'subtopic' },
            { id: 'ms-4', title: 'Background Services (Hangfire, Quartz)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'client-sec',
      title: 'Client-Side .NET',
      type: 'section',
      children: [
        {
          id: 'client',
          title: 'Client-Side .NET',
          type: 'topic',
          children: [
            { id: 'clt-1', title: 'Blazor / .NET MAUI', type: 'subtopic' },
            { id: 'clt-2', title: 'Template Engines (Razor)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-2', title: 'C# Roadmap', type: 'topic', link: { id: 'aspnet-core', title: 'C#' } }
      ]
    }
  ]
};
export const awsRoadmap = {
  id: 'aws',
  title: 'AWS Learning Path',
  description: 'Step by step guide to learning Amazon Web Services',
  layout: 'linear',
  category: 'skill',
  subscriberCount: '190,000',
  faq: {
    question: 'What is AWS?',
    answer: 'Amazon Web Services (AWS) is the world’s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.'
  },
  items: [
    {
      id: 'intro-sec',
      title: 'Introduction & Prep',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is Cloud Computing?', type: 'subtopic' },
            { id: 'in-2', title: 'IaaS vs PaaS vs SaaS', type: 'subtopic' },
            { id: 'in-3', title: 'Public vs Private vs Hybrid Cloud', type: 'subtopic' },
            { id: 'in-4', title: 'Introduction to AWS', type: 'subtopic' },
            { id: 'in-5', title: 'AWS Global Infrastructure', type: 'subtopic' }
          ]
        },
        {
          id: 'prep',
          title: 'Preparation',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Start with Essential Services', type: 'subtopic' },
            { id: 'pr-2', title: 'Shared Responsibility Model', type: 'subtopic' },
            { id: 'pr-3', title: 'Well Architected Framework', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'step1-sec',
      title: 'Step 1 - Essentials',
      type: 'section',
      children: [
        {
          id: 'iam',
          title: 'IAM - Access Control',
          type: 'topic',
          children: [
            { id: 'ia-1', title: 'Users / User Groups', type: 'subtopic' },
            { id: 'ia-2', title: 'Identity-based / Resource-based Policies', type: 'subtopic' },
            { id: 'ia-3', title: 'Roles / Assuming Roles / Instance Profiles', type: 'subtopic' },
            { id: 'ia-4', title: 'Identity Verification', type: 'subtopic' }
          ]
        },
        {
          id: 'vpc',
          title: 'VPC - Network Layer',
          type: 'topic',
          children: [
            { id: 'vp-1', title: 'CIDR Blocks / Subnets (Public/Private)', type: 'subtopic' },
            { id: 'vp-2', title: 'Route Tables / Internet Gateway', type: 'subtopic' },
            { id: 'vp-3', title: 'NAT Gateway / Security Groups / Elastic IP', type: 'subtopic' }
          ]
        },
        {
          id: 'ec2',
          title: 'EC2 - Compute',
          type: 'topic',
          children: [
            { id: 'ec-1', title: 'Instance Types / CPU Credits', type: 'subtopic' },
            { id: 'ec-2', title: 'Storage / Volumes / AMIs', type: 'subtopic' },
            { id: 'ec-3', title: 'Keypairs / User Data Scripts', type: 'subtopic' },
            { id: 'ec-4', title: 'Purchasing Options', type: 'subtopic' },
            { id: 'ec-5', title: 'Launch Templates / Auto-Scaling', type: 'subtopic' },
            { id: 'ec-6', title: 'Elastic Load Balancers', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'step2-sec',
      title: 'Step 2 - Learn these next',
      type: 'section',
      children: [
        {
          id: 's3',
          title: 'S3 - Storage',
          type: 'topic',
          children: [
            { id: 's3-1', title: 'Buckets / Objects', type: 'subtopic' },
            { id: 's3-2', title: 'Bucket / Object Lifecycle', type: 'subtopic' },
            { id: 's3-3', title: 'Storage Types (Standard, S3-IA, Glacier)', type: 'subtopic' },
            { id: 's3-4', title: 'Policies / Quotas / Events', type: 'subtopic' }
          ]
        },
        {
          id: 'ses',
          title: 'SES - Emails',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Sandbox / Sending Limits', type: 'subtopic' },
            { id: 'se-2', title: 'DKIM Setup / Configuration Sets', type: 'subtopic' },
            { id: 'se-3', title: 'Feedback Handling / Sender Reputation', type: 'subtopic' },
            { id: 'se-4', title: 'Dedicated IP', type: 'subtopic' }
          ]
        },
        {
          id: 'route53',
          title: 'Route53 - DNS',
          type: 'topic',
          children: [
            { id: 'r5-1', title: 'Hosted Zones', type: 'subtopic' },
            { id: 'r5-2', title: 'Routing Policies', type: 'subtopic' },
            { id: 'r5-3', title: 'Health Checks', type: 'subtopic' }
          ]
        },
        {
          id: 'cw',
          title: 'Cloudwatch - Monitoring',
          type: 'topic',
          children: [
            { id: 'cw-1', title: 'Metrics', type: 'subtopic' },
            { id: 'cw-2', title: 'Logs', type: 'subtopic' },
            { id: 'cw-3', title: 'Events', type: 'subtopic' }
          ]
        },
        {
          id: 'cf',
          title: 'Cloudfront - CDN',
          type: 'topic',
          children: [
            { id: 'cf-1', title: 'Distributions', type: 'subtopic' },
            { id: 'cf-2', title: 'Invalidations', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'step3-sec',
      title: 'Step 3 - Pick these after',
      type: 'section',
      children: [
        {
          id: 'rds',
          title: 'RDS - Managed Database',
          type: 'topic',
          children: [
            { id: 'rd-1', title: 'DB Instances / Capacity Settings', type: 'subtopic' },
            { id: 'rd-2', title: 'Backup / Restore', type: 'subtopic' },
            { id: 'rd-3', title: 'Storage Types (General Purpose, Provisioned IOPS, Magnetic)', type: 'subtopic' }
          ]
        },
        {
          id: 'dynamo',
          title: 'DynamoDB',
          type: 'topic',
          children: [
            { id: 'dy-1', title: 'Tables / Items / Attributes', type: 'subtopic' },
            { id: 'dy-2', title: 'Primary Keys / Secondary Indexes', type: 'subtopic' },
            { id: 'dy-3', title: 'Data Modeling / Streams', type: 'subtopic' },
            { id: 'dy-4', title: 'Limits / Backup / Restore', type: 'subtopic' },
            { id: 'dy-5', title: 'DynamoDB Local', type: 'subtopic' }
          ]
        },
        {
          id: 'elasticache',
          title: 'ElastiCache',
          type: 'topic',
          children: [
            { id: 'el-1', title: 'Redis / Memcached', type: 'subtopic' }
          ]
        },
        {
          id: 'containers',
          title: 'Containers',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'ECR', type: 'subtopic' },
            { id: 'co-2', title: 'ECS (Clusters, Container Agents, Tasks, Services)', type: 'subtopic' },
            { id: 'co-3', title: 'EKS', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'step4-sec',
      title: 'Step 4 - Serverless',
      type: 'section',
      children: [
        {
          id: 'serverless',
          title: 'Lambda & More',
          type: 'topic',
          children: [
            { id: 'sl-1', title: 'Creating / Invoking Functions', type: 'subtopic' },
            { id: 'sl-2', title: 'Layers / Custom Runtimes', type: 'subtopic' },
            { id: 'sl-3', title: 'Versioning / Aliases', type: 'subtopic' },
            { id: 'sl-4', title: 'Event Bridge / Scheduled Execution', type: 'subtopic' },
            { id: 'sl-5', title: 'Cold Start and Limitations', type: 'subtopic' },
            { id: 'sl-6', title: 'ECS Fargate', type: 'subtopic' },
            { id: 'sl-7', title: 'API Gateway / Lambda@Edge', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'System Design Roadmap', type: 'topic', link: { id: 'system-design', title: 'System Design' } }
      ]
    }
  ]
};
export const backendBeginnerRoadmap = {
  id: 'backend-beginner',
  title: 'Backend Beginner',
  description: 'A beginner-friendly guide to backend development',
  layout: 'linear',
  category: 'beginner',
  subscriberCount: '15,000',
  faq: {
    question: 'Where should I start with backend?',
    answer: 'Start by picking a language (like JavaScript/Node.js or Python), learn Git, understand basic relational databases, and learn how to build simple REST APIs.'
  },
  items: [
    {
      id: 'language-sec',
      title: 'Language',
      type: 'section',
      children: [
        {
          id: 'language',
          title: 'Pick a Language',
          type: 'topic',
          children: [
            { id: 'la-1', title: 'JavaScript / Node.js', type: 'subtopic' },
            { id: 'la-2', title: 'Go', type: 'subtopic' },
            { id: 'la-3', title: 'Python', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'vcs-sec',
      title: 'Version Control',
      type: 'section',
      children: [
        {
          id: 'vcs',
          title: 'Version Control Systems',
          type: 'topic',
          children: [
            { id: 'vc-1', title: 'Git', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'db-sec',
      title: 'Databases',
      type: 'section',
      children: [
        {
          id: 'db',
          title: 'Relational Databases',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'PostgreSQL', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'apis-sec',
      title: 'APIs',
      type: 'section',
      children: [
        {
          id: 'apis',
          title: 'Learn about APIs',
          type: 'topic',
          children: [
            { id: 'ap-1', title: 'REST', type: 'subtopic' },
            { id: 'ap-2', title: 'JSON APIs', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'auth-cache-sec',
      title: 'Auth & Caching',
      type: 'section',
      children: [
        { id: 'auth', title: 'Authentication (JWT)', type: 'topic' },
        { id: 'caching', title: 'Caching (Redis)', type: 'topic' }
      ]
    },
    {
      id: 'adv-db-sec',
      title: 'Advanced DB',
      type: 'section',
      children: [
        {
          id: 'adv-db',
          title: 'More about Databases',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'ORMs', type: 'subtopic' },
            { id: 'ad-2', title: 'ACID Transactions', type: 'subtopic' },
            { id: 'ad-3', title: 'N+1 Problem', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-sec',
      title: 'Testing',
      type: 'section',
      children: [
        {
          id: 'testing',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'ts-1', title: 'Integration Testing', type: 'subtopic' },
            { id: 'ts-2', title: 'Unit Testing', type: 'subtopic' },
            { id: 'ts-3', title: 'Functional Testing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Developer Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const backendRoadmap = {
  id: 'backend',
  title: 'Backend',
  description: 'Step by step guide to becoming a modern backend developer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '800,000',
  faq: {
    question: 'What language should I start with?',
    answer: 'JavaScript (Node.js), Python, or Go are great starting points. Pick one and master it before branching out.'
  },
  items: [
    {
      id: 'lang-internet-sec',
      title: 'Language & Internet',
      type: 'section',
      children: [
        {
          id: 'internet',
          title: 'Internet & Language',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'HTTP, DNS, Hosting, Browsers', type: 'subtopic' },
            { id: 'in-2', title: 'Pick a Language (JS, Python, Go, Java)', type: 'subtopic' },
            { id: 'in-3', title: 'Git / GitHub / GitLab / Bitbucket', type: 'subtopic' }
          ]
        },
        {
          id: 'vcs',
          title: 'Version Control & DBs',
          type: 'topic',
          children: [
            { id: 'vc-1', title: 'Relational DBs (PostgreSQL, MySQL)', type: 'subtopic' },
            { id: 'vc-2', title: 'NoSQL (MongoDB, Redis, Neo4j)', type: 'subtopic' },
            { id: 'vc-3', title: 'ORMs / N+1 Problem / Migrations', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'apis-security-sec',
      title: 'APIs & Security',
      type: 'section',
      children: [
        {
          id: 'api',
          title: 'APIs & Caching',
          type: 'topic',
          children: [
            { id: 'ap-1', title: 'REST / JSON APIs / GraphQL / gRPC', type: 'subtopic' },
            { id: 'ap-2', title: 'Authentication (JWT, OAuth, SAML)', type: 'subtopic' },
            { id: 'ap-3', title: 'Server/Client/CDN Caching', type: 'subtopic' }
          ]
        },
        {
          id: 'security',
          title: 'Security & Testing',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'HTTPS / CORS / OWASP / CSP / SSL', type: 'subtopic' },
            { id: 'se-2', title: 'Hashing (bcrypt, scrypt, SHA)', type: 'subtopic' },
            { id: 'se-3', title: 'Unit / Integration / Functional Testing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'arch-scale-sec',
      title: 'Architecture & Scale',
      type: 'section',
      children: [
        {
          id: 'arch',
          title: 'Design & Architecture',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Monolithic / Microservices / Serverless', type: 'subtopic' },
            { id: 'ar-2', title: 'Design Patterns / DDD / CQRS', type: 'subtopic' },
            { id: 'ar-3', title: 'Docker / Kubernetes / Web Servers', type: 'subtopic' }
          ]
        },
        {
          id: 'infra',
          title: 'Infrastructure & Scale',
          type: 'topic',
          children: [
            { id: 'if-1', title: 'Message Brokers (RabbitMQ, Kafka)', type: 'subtopic' },
            { id: 'if-2', title: 'Search Engines (Elasticsearch)', type: 'subtopic' },
            { id: 'if-3', title: 'WebSockets / SSE / Observability', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } }
      ]
    }
  ]
};
export const biAnalystRoadmap = {
  id: 'bi-analyst',
  title: 'BI Analyst',
  description: 'Step by step guide to becoming a Business Intelligence Analyst',
  layout: 'linear',
  category: 'role',
  subscriberCount: '48,000',
  faq: {
    question: 'What is a BI Analyst?',
    answer: 'A BI Analyst turns data into actionable insights that help organizations make business decisions, using tools like SQL, Tableau, and PowerBI.'
  },
  items: [
    {
      id: 'intro-basics-sec',
      title: 'Intro & Basics',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction to BI',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is BI? / Why BI Matters?', type: 'subtopic' },
            { id: 'in-2', title: 'BI Analyst vs Other Roles', type: 'subtopic' },
            { id: 'in-3', title: 'Skills / Responsibilities', type: 'subtopic' },
            { id: 'in-4', title: 'Stakeholder Identification', type: 'subtopic' }
          ]
        },
        {
          id: 'business',
          title: 'Business Fundamentals',
          type: 'topic',
          children: [
            { id: 'bu-1', title: 'Finance / Marketing / Operations / HR', type: 'subtopic' },
            { id: 'bu-2', title: 'Metrics and KPIs', type: 'subtopic' },
            { id: 'bu-3', title: 'Key Business Functions', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'operations-data-sec',
      title: 'BI Operations & Data',
      type: 'section',
      children: [
        {
          id: 'operations',
          title: 'BI Operations & Data Analysis',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Descriptive / Diagnostic / Predictive / Prescriptive', type: 'subtopic' },
            { id: 'op-2', title: 'Operational / Tactical / Strategic BI', type: 'subtopic' }
          ]
        },
        {
          id: 'data',
          title: 'What is Data?',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'Types (Structured, Semi, Unstructured)', type: 'subtopic' },
            { id: 'da-2', title: 'Formats (CSV, JSON, XML)', type: 'subtopic' },
            { id: 'da-3', title: 'Sources (Databases, Web, Mobile, Cloud, APIs, IoT)', type: 'subtopic' },
            { id: 'da-4', title: 'Analog vs Digital', type: 'subtopic' }
          ]
        },
        {
          id: 'stats',
          title: 'Statistics Basics',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Categorical vs Numerical / Discrete vs Continuous', type: 'subtopic' },
            { id: 'st-2', title: 'Descriptive (Central Tendency, Dispersion, Distribution)', type: 'subtopic' },
            { id: 'st-3', title: 'Inferential (Hypothesis Testing, Population/Sample)', type: 'subtopic' },
            { id: 'st-4', title: 'Linear Regression', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-skills-sec',
      title: 'BI Core Skills',
      type: 'section',
      children: [
        {
          id: 'sql',
          title: 'SQL Fundamentals',
          type: 'topic',
          children: [
            { id: 'sq-1', title: 'Basic / Advanced Queries', type: 'subtopic' },
            { id: 'sq-2', title: 'Window Functions / Performance', type: 'subtopic' },
            { id: 'sq-3', title: 'PostgreSQL, MySQL, SQLite, Oracle', type: 'subtopic' }
          ]
        },
        {
          id: 'prep',
          title: 'Data Cleaning & EDA',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Missing Values / Duplicates / Outliers', type: 'subtopic' },
            { id: 'pr-2', title: 'Standardisation', type: 'subtopic' },
            { id: 'pr-3', title: 'Tools: Excel, SQL, Pandas, dplyr', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'viz-tools-sec',
      title: 'Visualization & Tools',
      type: 'section',
      children: [
        {
          id: 'viz',
          title: 'Visualization & BI Tools',
          type: 'topic',
          children: [
            { id: 'vi-1', title: 'Charts (Bar, Line, Histogram, Scatter, Heatmap, Map)', type: 'subtopic' },
            { id: 'vi-2', title: 'Design principles / Color theory', type: 'subtopic' },
            { id: 'vi-3', title: 'Misleading charts / Accessibility', type: 'subtopic' },
            { id: 'vi-4', title: 'Power BI, Tableau, Qlik, Looker', type: 'subtopic' },
            { id: 'vi-5', title: 'Excel', type: 'subtopic' },
            { id: 'vi-6', title: 'Cloud BI Ecosystem', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tech-arch-sec',
      title: 'Tech & Architecture',
      type: 'section',
      children: [
        {
          id: 'tech',
          title: 'Tech & Data Architecture',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Cloud Computing (AWS, GCP, Azure)', type: 'subtopic' },
            { id: 'te-2', title: 'Data Warehouse / Data Lake / Data Mart', type: 'subtopic' },
            { id: 'te-3', title: 'ETL / ELT Tools (Airflow, dbt)', type: 'subtopic' },
            { id: 'te-4', title: 'Data Modeling (Star/Snowflake Schema)', type: 'subtopic' },
            { id: 'te-5', title: 'Normalization vs Denormalization', type: 'subtopic' },
            { id: 'te-6', title: 'Fact vs Dimension Tables', type: 'subtopic' },
            { id: 'te-7', title: 'Python / R', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'techniques-excellence-sec',
      title: 'BI Techniques & Excellence',
      type: 'section',
      children: [
        {
          id: 'techniques',
          title: 'BI Techniques & Apps',
          type: 'topic',
          children: [
            { id: 'tq-1', title: 'A/B Testing / Cohort Analysis', type: 'subtopic' },
            { id: 'tq-2', title: 'Forecasting / Time Series Analysis', type: 'subtopic' },
            { id: 'tq-3', title: 'Basic Machine Learning (Supervised/Unsupervised)', type: 'subtopic' },
            { id: 'tq-4', title: 'Apps: Finance, Marketing, Healthcare, Retail', type: 'subtopic' }
          ]
        },
        {
          id: 'excellence',
          title: 'Professional Excellence',
          type: 'topic',
          children: [
            { id: 'ex-1', title: 'Communication & Storytelling (Dashboard Design)', type: 'subtopic' },
            { id: 'ex-2', title: 'Data Governance & Ethics (Privacy, Bias)', type: 'subtopic' },
            { id: 'ex-3', title: 'Business Acumen / Soft Skills', type: 'subtopic' },
            { id: 'ex-4', title: 'Project / Stakeholder Management', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Data Analyst Roadmap', type: 'topic', link: { id: 'data-analyst', title: 'Data Analyst' } },
        { id: 'related-2', title: 'SQL Roadmap', type: 'topic', link: { id: 'sql', title: 'SQL' } },
        { id: 'related-3', title: 'AI & Data Scientist Roadmap', type: 'topic', link: { id: 'ai-data-scientist', title: 'AI Data Scientist' } }
      ]
    }
  ]
};
export const blockchainRoadmap = {
  id: 'blockchain',
  title: 'Blockchain Developer',
  description: 'Step by step guide to becoming a Web3 / Blockchain Developer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '133,000',
  faq: {
    question: 'What is a Blockchain Developer?',
    answer: 'A Blockchain Developer builds decentralized applications (dApps) and smart contracts on blockchain platforms like Ethereum.'
  },
  items: [
    {
      id: 'knowledge-sec',
      title: 'Blockchain Knowledge',
      type: 'section',
      children: [
        {
          id: 'basic-knowledge',
          title: 'Basic Blockchain Knowledge',
          type: 'topic',
          children: [
            { id: 'bk-1', title: 'What is Blockchain / Decentralization / Why it matters?', type: 'subtopic' },
            { id: 'bk-2', title: 'Basic Blockchain Operations / Applications and Uses', type: 'subtopic' },
            { id: 'bk-3', title: 'Decentralization vs Trust', type: 'subtopic' },
            { id: 'bk-4', title: 'Blockchain Structure (Mining and Incentive Models)', type: 'subtopic' }
          ]
        },
        {
          id: 'gen-knowledge',
          title: 'General Blockchain Knowledge',
          type: 'topic',
          children: [
            { id: 'gk-1', title: 'Cryptography / Consensus Protocols', type: 'subtopic' },
            { id: 'gk-2', title: 'Blockchain Forking / Interoperability', type: 'subtopic' },
            { id: 'gk-3', title: 'Cryptocurrencies / Cryptowallets', type: 'subtopic' },
            { id: 'gk-4', title: 'Oracles (Hybrid Smart Contracts, Chainlink, Oracle Networks)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'blockchains-contracts-sec',
      title: 'Blockchains & Smart Contracts',
      type: 'section',
      children: [
        {
          id: 'blockchains',
          title: 'Blockchains',
          type: 'topic',
          children: [
            {
              id: 'evm',
              title: 'EVM-Based',
              type: 'subgroup',
              children: [
                { id: 'evm-1', title: 'Ethereum / Polygon / Binance Smart Chain / Gnosis Chain', type: 'subtopic' },
                { id: 'evm-2', title: 'Avalanche / Fantom / Moonbeam / Moonriver', type: 'subtopic' },
                { id: 'evm-3', title: 'Huobi Eco Chain', type: 'subtopic' }
              ]
            },
            {
              id: 'tvm',
              title: 'TVM-Based',
              type: 'subgroup',
              children: [
                { id: 'tvm-1', title: 'Everscale / Gosh / Venom / TON', type: 'subtopic' }
              ]
            },
            { id: 'solana', title: 'Solana', type: 'subtopic' }
          ]
        },
        {
          id: 'sc',
          title: 'Smart Contracts',
          type: 'topic',
          children: [
            {
              id: 'lang',
              title: 'Programming Languages',
              type: 'subgroup',
              children: [
                { id: 'la-1', title: 'Solidity / Vyper / Rust', type: 'subtopic' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'frameworks-testing-sec',
      title: 'Frameworks & Testing',
      type: 'section',
      children: [
        {
          id: 'frameworks',
          title: 'Smart Contract Frameworks',
          type: 'topic',
          children: [
            { id: 'fw-1', title: 'Hardhat / Truffle / Foundry / Brownie', type: 'subtopic' }
          ]
        },
        {
          id: 'testing',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'ts-1', title: 'Unit Tests / Integration Tests / Code Coverage', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'security-infra-sec',
      title: 'Security & Infrastructure',
      type: 'section',
      children: [
        {
          id: 'security',
          title: 'Security',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Slither / Manticore / MythX / Echidna', type: 'subtopic' },
            { id: 'se-2', title: 'Fuzz Testing & Static Analysis', type: 'subtopic' },
            { id: 'se-3', title: 'Common Threat Vectors / Source of Randomness Attacks', type: 'subtopic' }
          ]
        },
        {
          id: 'practices',
          title: 'Practices',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'ERC Tokens / OpenZeppelin', type: 'subtopic' },
            { id: 'pr-2', title: 'Deployment / Monitoring / Upgrades', type: 'subtopic' }
          ]
        },
        {
          id: 'tools',
          title: 'Tools',
          type: 'topic',
          children: [
            { id: 'tl-1', title: 'Crypto Wallets / Crypto Faucets', type: 'subtopic' },
            { id: 'tl-2', title: 'Management Platforms / Decentralized Storage', type: 'subtopic' }
          ]
        },
        {
          id: 'vcs',
          title: 'Version Control Systems',
          type: 'topic',
          children: [
            { id: 'vc-1', title: 'Git / GitHub / GitLab / Bitbucket', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'dapps-l2-nodes-sec',
      title: 'dApps, L2, Nodes',
      type: 'section',
      children: [
        {
          id: 'dapps',
          title: 'dApps - Decentralized Applications',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'Supporting Languages (JavaScript, Python)', type: 'subtopic' },
            { id: 'da-2', title: 'Frontend Frameworks (React, Vue, Angular)', type: 'subtopic' },
            { id: 'da-3', title: 'Client Libraries (ethers.js, web3.js, Moralis)', type: 'subtopic' },
            { id: 'da-4', title: 'Testing / Deployment / Maintenance / Architecture / Security', type: 'subtopic' }
          ]
        },
        {
          id: 'l2',
          title: 'L2 Blockchains / On-Chain Scaling',
          type: 'topic',
          children: [
            { id: 'l2-1', title: 'State & Payment Channels / Sidechains', type: 'subtopic' },
            { id: 'l2-2', title: 'Optimistic Rollups & Fraud Proofs', type: 'subtopic' },
            { id: 'l2-3', title: 'Zk Rollups & Zero Knowledge Proof', type: 'subtopic' },
            { id: 'l2-4', title: 'Validium / Plasma', type: 'subtopic' }
          ]
        },
        {
          id: 'nodes',
          title: 'Client Nodes & Node as a Service',
          type: 'topic',
          children: [
            { id: 'no-1', title: 'Client Nodes (Geth, Besu, Nethermind, Substrate)', type: 'subtopic' },
            { id: 'no-2', title: 'Ethereum 2.0', type: 'subtopic' },
            { id: 'no-3', title: 'Node as a Service (Alchemy, Infura, Moralis, Quicknode)', type: 'subtopic' }
          ]
        },
        {
          id: 'apps',
          title: 'Applicability / Building for Scale',
          type: 'topic',
          children: [
            { id: 'ap-1', title: 'Defi / DAOs / NFTs / Payments / Insurance', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const cRoadmap = {
  id: 'c',
  title: 'C Developer',
  description: 'Step by step guide to becoming a C Developer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '52,100',
  faq: {
    question: 'Why learn C?',
    answer: 'C is a foundational programming language essential for operating systems, embedded systems, game engines, and understanding how memory works.'
  },
  items: [
    {
      id: 'intro-setup-sec',
      title: 'Intro & Setup',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'C vs Assembly', type: 'subtopic' },
            { id: 'in-2', title: 'C vs C++', type: 'subtopic' }
          ]
        },
        {
          id: 'setup',
          title: 'Setting up',
          type: 'topic',
          children: [
            { id: 'su-1', title: 'Installing C', type: 'subtopic' },
            { id: 'su-2', title: 'Running your First Program', type: 'subtopic' },
            { id: 'su-3', title: 'Code Editors / IDEs (vim/nvim, VSCode)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'basics-sec',
      title: 'Basics',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Learn the Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Variables (Declaration vs Definition, Initialization)', type: 'subtopic' },
            { id: 'ba-2', title: 'Printing Variables', type: 'subtopic' }
          ]
        },
        {
          id: 'types',
          title: 'Data Types',
          type: 'topic',
          children: [
            { id: 'ty-1', title: 'Basic (integers, float, double, char)', type: 'subtopic' },
            { id: 'ty-2', title: 'Extended (booleans, Fixed-width integers)', type: 'subtopic' },
            { id: 'ty-3', title: 'Type Conversion / Type Qualifiers (const, volatile, restrict, _Atomic)', type: 'subtopic' }
          ]
        },
        {
          id: 'operators',
          title: 'Operators',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Arithmetic / Comparison', type: 'subtopic' },
            { id: 'op-2', title: 'Logical / Ternary / Bitwise', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'flow-functions-sec',
      title: 'Flow & Functions',
      type: 'section',
      children: [
        {
          id: 'flow',
          title: 'Control Flow',
          type: 'topic',
          children: [
            { id: 'fl-1', title: 'if else / switch', type: 'subtopic' },
            { id: 'fl-2', title: 'for / while / do while loops', type: 'subtopic' },
            { id: 'fl-3', title: 'break / continue', type: 'subtopic' }
          ]
        },
        {
          id: 'functions',
          title: 'Functions',
          type: 'topic',
          children: [
            { id: 'fu-1', title: 'main Function', type: 'subtopic' },
            { id: 'fu-2', title: 'Recursive Functions', type: 'subtopic' },
            { id: 'fu-3', title: 'Variable Scopes', type: 'subtopic' },
            { id: 'fu-4', title: 'Variadic Functions', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-c-sec',
      title: 'Core C',
      type: 'section',
      children: [
        {
          id: 'pointers',
          title: 'Pointers & Memory',
          type: 'topic',
          children: [
            { id: 'pt-1', title: 'Memory Model (Stack vs Heap)', type: 'subtopic' },
            { id: 'pt-2', title: 'Lifetime of Objects', type: 'subtopic' },
            { id: 'pt-3', title: 'Pointer Mechanics (Basics & Syntax)', type: 'subtopic' },
            { id: 'pt-4', title: 'Pointer Arithmetic', type: 'subtopic' },
            { id: 'pt-5', title: 'Null / void Pointers', type: 'subtopic' }
          ]
        },
        {
          id: 'arrays',
          title: 'Arrays / Strings',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Dynamic Arrays', type: 'subtopic' },
            { id: 'ar-2', title: 'Common Data Structures (Hash Maps, Linked Lists, Ring Buffers / FIFO Queues)', type: 'subtopic' }
          ]
        },
        {
          id: 'udt',
          title: 'User-Defined Types',
          type: 'topic',
          children: [
            { id: 'ud-1', title: 'Structs', type: 'subtopic' },
            { id: 'ud-2', title: 'Unions', type: 'subtopic' },
            { id: 'ud-3', title: 'Enums', type: 'subtopic' },
            { id: 'ud-4', title: 'Typedef', type: 'subtopic' }
          ]
        },
        {
          id: 'memory',
          title: 'Memory Management',
          type: 'topic',
          children: [
            { id: 'me-1', title: 'Dynamic Memory Allocation (malloc, calloc, realloc, free)', type: 'subtopic' },
            { id: 'me-2', title: 'Memory Leakage / Dangling Pointers', type: 'subtopic' },
            { id: 'me-3', title: 'Undefined Behavior / Buffer Overflow', type: 'subtopic' }
          ]
        },
        {
          id: 'headers',
          title: 'Header Files / Structuring',
          type: 'topic',
          children: [
            { id: 'he-1', title: 'Linkage (static, extern)', type: 'subtopic' }
          ]
        },
        {
          id: 'error',
          title: 'Error Handling',
          type: 'topic',
          children: [
            { id: 'er-1', title: 'errno', type: 'subtopic' },
            { id: 'er-2', title: 'Exit Codes', type: 'subtopic' },
            { id: 'er-3', title: 'setjmp / longjmp', type: 'subtopic' }
          ]
        },
        {
          id: 'io',
          title: 'Input / Output (File I/O)',
          type: 'topic',
          children: [
            { id: 'io-1', title: 'Streams / File Pointers', type: 'subtopic' },
            { id: 'io-2', title: 'Binary vs Text Mode', type: 'subtopic' }
          ]
        },
        {
          id: 'stdlib',
          title: 'Standard Library',
          type: 'topic',
          children: [
            { id: 'sl-1', title: 'Data Utilities / Text Processing', type: 'subtopic' },
            { id: 'sl-2', title: 'Math & Time', type: 'subtopic' },
            { id: 'sl-3', title: 'Diagnostics & Limits', type: 'subtopic' },
            { id: 'sl-4', title: 'OS & Signal Interfaces', type: 'subtopic' }
          ]
        },
        {
          id: 'preproc',
          title: 'Preprocessors',
          type: 'topic',
          children: [
            { id: 'pp-1', title: 'Macros / Predefined Macros', type: 'subtopic' },
            { id: 'pp-2', title: 'Conditional Compilation', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tools-advanced-sec',
      title: 'Tools & Advanced',
      type: 'section',
      children: [
        {
          id: 'build',
          title: 'Build & Compilation',
          type: 'topic',
          children: [
            { id: 'bd-1', title: 'Compilers (GCC / Clang, TinyCC)', type: 'subtopic' },
            { id: 'bd-2', title: 'Optimization Levels / Symbol Tables / Linking / ABI', type: 'subtopic' },
            { id: 'bd-3', title: 'Build Systems (GNU Make, CMake, Ninja, Meson)', type: 'subtopic' },
            { id: 'bd-4', title: 'Package Managers (vcpkg, Conan)', type: 'subtopic' },
            { id: 'bd-5', title: 'C Standards (C89, C99, C11, C17, C23)', type: 'subtopic' }
          ]
        },
        {
          id: 'debug',
          title: 'Debugging & Testing',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'GDB / LLDB / WinDbg', type: 'subtopic' },
            { id: 'db-2', title: 'Valgrind / strace', type: 'subtopic' },
            { id: 'db-3', title: 'ASan & LSan', type: 'subtopic' },
            { id: 'db-4', title: 'assert.h', type: 'subtopic' },
            { id: 'db-5', title: 'Testing (Unity, CMocka, Check)', type: 'subtopic' }
          ]
        },
        {
          id: 'advanced',
          title: 'Advanced C',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Function pointers & Callbacks', type: 'subtopic' },
            { id: 'ad-2', title: 'Opaque Pointers', type: 'subtopic' },
            { id: 'ad-3', title: 'Idioms & Design Patterns', type: 'subtopic' },
            { id: 'ad-4', title: 'Object-Oriented C (RAII-Simulated Cleanup)', type: 'subtopic' },
            { id: 'ad-5', title: 'Concurrency (POSIX Threads, Mutexes, IPC)', type: 'subtopic' },
            { id: 'ad-6', title: 'Process Management', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'C++ Roadmap', type: 'topic', link: { id: 'c', title: 'C++' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const claudeCodeRoadmap = {
  id: 'claude-code',
  title: 'Claude Code',
  description: 'Master the Claude Code CLI tool',
  layout: 'linear',
  category: 'skill',
  subscriberCount: '19,500',
  faq: {
    question: 'What is Claude Code?',
    answer: 'Claude Code is a CLI tool by Anthropic that brings Claude directly into your terminal to write, debug, and understand code.'
  },
  items: [
    {
      id: 'intro-basics-sec',
      title: 'Intro & Basics',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is Vibe Coding?', type: 'subtopic' },
            { id: 'in-2', title: 'What is a Coding Agent?', type: 'subtopic' },
            { id: 'in-3', title: 'What is Agentic Loop?', type: 'subtopic' },
            { id: 'in-4', title: 'Ways to use Claude (Claude CLI, Desktop App, Editor Extensions, Community Tools)', type: 'subtopic' }
          ]
        },
        {
          id: 'basics',
          title: 'Understand the Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Setting up Claude (Subscription, API usage)', type: 'subtopic' },
            { id: 'ba-2', title: 'Understand the Differences (Models, Tools, MCP, Plugins, Hooks, Subagents)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'usage-workflows-sec',
      title: 'Usage & Workflows',
      type: 'section',
      children: [
        {
          id: 'usage',
          title: 'Usage Best Practices',
          type: 'topic',
          children: [
            { id: 'us-1', title: 'Common Usecases', type: 'subtopic' },
            { id: 'us-2', title: 'When to use what model? (Opus, Sonnet, Haiku)', type: 'subtopic' },
            { id: 'us-3', title: 'Permission Modes', type: 'subtopic' }
          ]
        },
        {
          id: 'workflow',
          title: 'Claude Workflow',
          type: 'topic',
          children: [
            { id: 'wf-1', title: 'Plan Mode', type: 'subtopic' },
            { id: 'wf-2', title: 'How to Structure .CLAUDE.md (Locations)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'using-claude-sec',
      title: 'Using Claude Code',
      type: 'section',
      children: [
        {
          id: 'cli',
          title: 'Claude CLI Commands',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Shortcuts & Prefixes (Ctrl+C, Ctrl+R, Esc, Esc+Esc, Shift+Tab, Slash Commands, !, \\, @)', type: 'subtopic' },
            { id: 'cl-2', title: 'claude / claude -r / claude "query" / claude -p / claude -c / claude --add-dir', type: 'subtopic' },
            { id: 'cl-3', title: 'Claude Commands (/help, /usage, /clear, /cost, /exit, /export, /status, /rewind, /plan, /doctor)', type: 'subtopic' }
          ]
        },
        {
          id: 'sessions',
          title: 'Manage Sessions',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Resume', type: 'subtopic' },
            { id: 'se-2', title: 'Rewind', type: 'subtopic' },
            { id: 'se-3', title: 'Session Commands (/init, /memory)', type: 'subtopic' }
          ]
        },
        {
          id: 'context',
          title: 'Context & Memory',
          type: 'topic',
          children: [
            { id: 'cx-1', title: 'Manage Context', type: 'subtopic' },
            { id: 'cx-2', title: '/context /compact', type: 'subtopic' },
            { id: 'cx-3', title: 'Context management strategies', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'config-advanced-sec',
      title: 'Configuration & Advanced',
      type: 'section',
      children: [
        {
          id: 'config',
          title: 'Configuration',
          type: 'topic',
          children: [
            { id: 'cg-1', title: '/config /permissions', type: 'subtopic' },
            { id: 'cg-2', title: '/model /agents', type: 'subtopic' },
            { id: 'cg-3', title: '/hooks /mcp', type: 'subtopic' }
          ]
        },
        {
          id: 'mcp',
          title: 'MCP & Skills',
          type: 'topic',
          children: [
            { id: 'mc-1', title: 'Connecting Tools with MCP', type: 'subtopic' },
            { id: 'mc-2', title: 'Skills (Creating Skills, Skill Best Practices)', type: 'subtopic' },
            { id: 'mc-3', title: 'Subagents (Creating Subagents)', type: 'subtopic' }
          ]
        },
        {
          id: 'hooks',
          title: 'Hooks',
          type: 'topic',
          children: [
            { id: 'hk-1', title: 'Hook Events & Matchers', type: 'subtopic' },
            { id: 'hk-2', title: 'Hook Types (SessionStart, SessionEnd, PreToolUse, PostToolUse, UserPrompt, Submit, Stop)', type: 'subtopic' },
            { id: 'hk-3', title: 'Hook Inputs & Outputs', type: 'subtopic' }
          ]
        },
        {
          id: 'advanced',
          title: 'Advanced Claude Code',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Understand Claude Pricing (Use /compact and /clear, Be mindful of extensions, Use subagents and hooks)', type: 'subtopic' },
            { id: 'ad-2', title: 'Thinking modes & Effort', type: 'subtopic' },
            { id: 'ad-3', title: 'Prompt Caching', type: 'subtopic' },
            { id: 'ad-4', title: 'Customize Status Line', type: 'subtopic' },
            { id: 'ad-5', title: 'Model Configuration', type: 'subtopic' },
            { id: 'ad-6', title: 'Headless mode', type: 'subtopic' },
            { id: 'ad-7', title: 'Git Worktrees', type: 'subtopic' },
            { id: 'ad-8', title: 'Agent Team', type: 'subtopic' },
            { id: 'ad-9', title: 'Security Best Practices', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AI Agents Roadmap', type: 'topic', link: { id: 'ai-agents', title: 'AI Agents' } },
        { id: 'related-2', title: 'AI Engineer Roadmap', type: 'topic', link: { id: 'ai-engineer', title: 'AI Engineer' } },
        { id: 'related-3', title: 'Prompt Engineering Roadmap', type: 'topic', link: { id: 'prompt-engineering', title: 'Prompt Engineering' } }
      ]
    }
  ]
};
export const cloudflareRoadmap = {
  id: 'cloudflare',
  title: 'Cloudflare Developer',
  description: 'Master Cloudflare services like Workers, Pages, and Security',
  layout: 'linear',
  category: 'skill',
  subscriberCount: '27,000',
  faq: {
    question: 'Why learn Cloudflare?',
    answer: 'Cloudflare offers a powerful edge computing platform (Workers), fast static hosting (Pages), and robust security services (WAF/DDoS).'
  },
  items: [
    {
      id: 'basics-sec',
      title: 'Basics',
      type: 'section',
      children: [
        {
          id: 'dns',
          title: 'DNS & CDN Basics',
          type: 'topic',
          children: [
            { id: 'dn-1', title: 'Domain Registration', type: 'subtopic' },
            { id: 'dn-2', title: 'DNS Records (A, CNAME)', type: 'subtopic' },
            { id: 'dn-3', title: 'Caching Rules', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'edge-compute-sec',
      title: 'Edge Compute',
      type: 'section',
      children: [
        {
          id: 'compute',
          title: 'Edge Compute (Workers)',
          type: 'topic',
          children: [
            { id: 'ec-1', title: 'V8 Isolates', type: 'subtopic' },
            { id: 'ec-2', title: 'Wrangler CLI', type: 'subtopic' },
            { id: 'ec-3', title: 'Routing / Fetch API', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'storage-sec',
      title: 'Storage',
      type: 'section',
      children: [
        {
          id: 'storage',
          title: 'Edge Storage',
          type: 'topic',
          children: [
            { id: 'kv', title: 'Workers KV', type: 'subtopic' },
            { id: 'r2', title: 'R2 (Object Storage)', type: 'subtopic' },
            { id: 'd1', title: 'D1 (SQL)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'hosting-security-sec',
      title: 'Hosting & Security',
      type: 'section',
      children: [
        { id: 'pages', title: 'Cloudflare Pages', type: 'topic' },
        {
          id: 'security',
          title: 'Security & Access',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'WAF (Web App Firewall)', type: 'subtopic' },
            { id: 'se-2', title: 'DDoS Protection', type: 'subtopic' },
            { id: 'se-3', title: 'Zero Trust / Tunnels', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AWS Roadmap', type: 'topic', link: { id: 'aws', title: 'AWS' } },
        { id: 'related-2', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const computerScienceRoadmap = {
  id: 'computer-science',
  title: 'Computer Science',
  description: 'A comprehensive guide to computer science fundamentals',
  layout: 'linear',
  category: 'best-practices',
  subscriberCount: '185,000',
  faq: {
    question: 'Why learn Computer Science?',
    answer: 'Computer Science fundamentals give you a deep understanding of how computers process information, making you a stronger, language-agnostic software engineer.'
  },
  items: [
    {
      id: 'programming-dsa-sec',
      title: 'Programming & Basic DSA',
      type: 'section',
      children: [
        {
          id: 'lang',
          title: 'Pick a Language',
          type: 'topic',
          children: [
            { id: 'la-1', title: 'Python / Go / C# / C++ / C / Java / Rust', type: 'subtopic' }
          ]
        },
        {
          id: 'ds',
          title: 'Data Structures',
          type: 'topic',
          children: [
            { id: 'ds-1', title: 'Array / Linked List / Stack / Queue', type: 'subtopic' },
            { id: 'ds-2', title: 'Hash Table / Tree (Binary, BST, Full, Complete, Balanced)', type: 'subtopic' },
            { id: 'ds-3', title: 'Graph (Directed, Undirected, Spanning, Adjacency List/Matrix)', type: 'subtopic' }
          ]
        },
        {
          id: 'asym',
          title: 'Asymptotic Notation',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Common Runtimes (Constant, Logarithmic, Linear, Polynomial, Exponential, Factorial)', type: 'subtopic' },
            { id: 'as-2', title: 'Big O / Big-Theta / Big Omega', type: 'subtopic' }
          ]
        },
        {
          id: 'algos',
          title: 'Common Algorithms',
          type: 'topic',
          children: [
            { id: 'al-1', title: 'Recursion (Tail, Non-Tail)', type: 'subtopic' },
            { id: 'al-2', title: 'Sorting (Bubble, Selection, Insertion, Heap, Quick, Merge)', type: 'subtopic' },
            { id: 'al-3', title: 'Searching (Binary, Linear)', type: 'subtopic' },
            { id: 'al-4', title: 'Graphs (BFS, DFS, Bellman Ford, Dijkstra, A*)', type: 'subtopic' },
            { id: 'al-5', title: 'Tree Traversal (Pre-Order, In-Order, Post-Order, BFS, DFS)', type: 'subtopic' },
            { id: 'al-6', title: 'Greedy Algorithms (Huffman, Kruskal, Ford-Fulkerson, Prim)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'math-adv-dsa-sec',
      title: 'Math & Advanced DSA',
      type: 'section',
      children: [
        {
          id: 'math',
          title: 'Basic Math Skills',
          type: 'topic',
          children: [
            { id: 'ma-1', title: 'Floating Point Math / Endianess (Big, Little)', type: 'subtopic' },
            { id: 'ma-2', title: 'Character Encodings (Unicode, ASCII)', type: 'subtopic' },
            { id: 'ma-3', title: 'Bitwise Operators', type: 'subtopic' },
            { id: 'ma-4', title: 'Probability / Combinatorics', type: 'subtopic' }
          ]
        },
        {
          id: 'strings',
          title: 'String Search & Manipulations',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Substring Search (Brute Force, Robin-Karp, Knuth-Morris Pratt, Boyer-Moore)', type: 'subtopic' },
            { id: 'st-2', title: 'Search Pattern in Text (Rabin-Karp Algorithm)', type: 'subtopic' },
            { id: 'st-3', title: 'Suffix Arrays / Tries', type: 'subtopic' }
          ]
        },
        {
          id: 'adv-trees',
          title: 'Balanced Search Trees',
          type: 'topic',
          children: [
            { id: 'at-1', title: 'AVL Trees / Red Black Trees', type: 'subtopic' },
            { id: 'at-2', title: '2 3 Search Trees / 2 3 4 Trees', type: 'subtopic' },
            { id: 'at-3', title: 'K-ary / M-ary Tree / B-Tree', type: 'subtopic' },
            { id: 'at-4', title: 'K-D Trees / Skip Lists', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'sys-arch-sec',
      title: 'Systems & Architecture',
      type: 'section',
      children: [
        {
          id: 'systems',
          title: 'How Computers Work',
          type: 'topic',
          children: [
            { id: 'sy-1', title: 'How CPU Executes Programs (Registers, RAM, Instructions)', type: 'subtopic' },
            { id: 'sy-2', title: 'CPU Cache / CPU Interrupts', type: 'subtopic' },
            { id: 'sy-3', title: 'How Computers Calculate', type: 'subtopic' }
          ]
        },
        {
          id: 'os',
          title: 'Operating Systems',
          type: 'topic',
          children: [
            { id: 'os-1', title: 'Processes and Threads (Processes vs Threads, Concurrency)', type: 'subtopic' },
            { id: 'os-2', title: 'Process Forking / Memory Management', type: 'subtopic' },
            { id: 'os-3', title: 'Scheduling Algorithms', type: 'subtopic' },
            { id: 'os-4', title: 'Lock / Mutex / Semaphore', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'net-db-sec-sec',
      title: 'Network, DB, Security',
      type: 'section',
      children: [
        {
          id: 'network',
          title: 'Networking',
          type: 'topic',
          children: [
            { id: 'ne-1', title: 'OSI Model / TCP/IP Model', type: 'subtopic' },
            { id: 'ne-2', title: 'DNS / HTTP / TLS & HTTPS', type: 'subtopic' },
            { id: 'ne-3', title: 'Sockets / Web Sockets / SSE', type: 'subtopic' },
            { id: 'ne-4', title: 'Long Polling / Short Polling', type: 'subtopic' }
          ]
        },
        {
          id: 'db',
          title: 'Databases',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'SQL vs NoSQL Databases', type: 'subtopic' },
            { id: 'db-2', title: 'Normalization / Denormalization', type: 'subtopic' },
            { id: 'db-3', title: 'Entity-Relationship Model (DDL, DML, DQL, DCL)', type: 'subtopic' },
            { id: 'db-4', title: 'ACID Model / Locking / Indexes', type: 'subtopic' },
            { id: 'db-5', title: 'Transactions / Views / Stored Procedures', type: 'subtopic' },
            { id: 'db-6', title: 'Database Federation / Replication / Sharding', type: 'subtopic' },
            { id: 'db-7', title: 'CAP Theorem / PACELC', type: 'subtopic' }
          ]
        },
        {
          id: 'security',
          title: 'Security',
          type: 'topic',
          children: [
            { id: 'sec-1', title: 'Hashing / Encryption / Encoding', type: 'subtopic' },
            { id: 'sec-2', title: 'Hashing Algorithms', type: 'subtopic' },
            { id: 'sec-3', title: 'OWASP Top 10', type: 'subtopic' },
            { id: 'sec-4', title: 'Public Key Cryptography', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'sysdesign-adv-sec',
      title: 'System Design & Advanced Topics',
      type: 'section',
      children: [
        {
          id: 'sysdesign',
          title: 'System Design',
          type: 'topic',
          children: [
            { id: 'sd-1', title: 'Horizontal vs Vertical Scaling / Load Balancing', type: 'subtopic' },
            { id: 'sd-2', title: 'Clustering / Caching (CDN, Proxy, Queues)', type: 'subtopic' },
            { id: 'sd-3', title: 'Architectural Styles (REST, GraphQL, gRPC)', type: 'subtopic' },
            { id: 'sd-4', title: 'Cloud Design Patterns', type: 'subtopic' },
            { id: 'sd-5', title: 'Caches (MFU, LRU, LFU)', type: 'subtopic' }
          ]
        },
        {
          id: 'patterns',
          title: 'Design Patterns',
          type: 'topic',
          children: [
            { id: 'pa-1', title: 'GoF Design Patterns / Architectural Patterns', type: 'subtopic' },
            { id: 'pa-2', title: 'Dependency Injection', type: 'subtopic' },
            { id: 'pa-3', title: 'Null Object / Type Object Pattern', type: 'subtopic' },
            { id: 'pa-4', title: 'Common UML Diagrams (Class, Usecase, Activity, Statemachine, Sequence)', type: 'subtopic' }
          ]
        },
        {
          id: 'theory',
          title: 'Complexity Classes',
          type: 'topic',
          children: [
            { id: 'th-1', title: 'P / NP / P = NP', type: 'subtopic' },
            { id: 'th-2', title: 'Co-NP / NP Hard / NP Complete', type: 'subtopic' },
            { id: 'th-3', title: 'Travelling Salesman Problem / Knapsack Problem', type: 'subtopic' },
            { id: 'th-4', title: 'Longest Path Problem / Back Tracking', type: 'subtopic' },
            { id: 'th-5', title: 'Solving N Queen Problem / Maze Solving Problem', type: 'subtopic' },
            { id: 'th-6', title: 'The Knight\'s Tour Problem', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Data Structures & Algorithms', type: 'topic', link: { id: 'datastructures-and-algorithms', title: 'DSA' } },
        { id: 'related-2', title: 'API Design Roadmap', type: 'topic', link: { id: 'api-design', title: 'API Design' } }
      ]
    }
  ]
};
export const cppRoadmap = {
  id: 'cpp',
  title: 'C++ Developer',
  description: 'Step by step guide to becoming a C++ Developer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '135,000',
  faq: {
    question: 'Why learn C++?',
    answer: 'C++ is a high-performance language used in game development, quantitative finance, embedded systems, and resource-intensive applications.'
  },
  items: [
    {
      id: 'intro-basics-sec',
      title: 'Intro & Basics',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction to Language',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is C++? / Why use C++', type: 'subtopic' },
            { id: 'in-2', title: 'C vs C++', type: 'subtopic' }
          ]
        },
        {
          id: 'setup',
          title: 'Setting up your Environment',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Installing C++', type: 'subtopic' },
            { id: 'se-2', title: 'Code Editors / IDEs', type: 'subtopic' },
            { id: 'se-3', title: 'Running your First Program', type: 'subtopic' }
          ]
        },
        {
          id: 'basic-ops',
          title: 'Basic Operations',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Arithmetic Operators', type: 'subtopic' },
            { id: 'op-2', title: 'Logical Operators', type: 'subtopic' },
            { id: 'op-3', title: 'Bitwise Operators', type: 'subtopic' }
          ]
        },
        {
          id: 'control',
          title: 'Control Flow & Statements',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'if else / switch / goto', type: 'subtopic' },
            { id: 'co-2', title: 'for / while / do while loops', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-syntax-sec',
      title: 'Core Syntax & Types',
      type: 'section',
      children: [
        {
          id: 'types',
          title: 'Data Types',
          type: 'topic',
          children: [
            { id: 'ty-1', title: 'Static Typing', type: 'subtopic' },
            { id: 'ty-2', title: 'Dynamic Typing', type: 'subtopic' }
          ]
        },
        {
          id: 'functions',
          title: 'Functions',
          type: 'topic',
          children: [
            { id: 'fn-1', title: 'Operator Overloading', type: 'subtopic' },
            { id: 'fn-2', title: 'Lambdas', type: 'subtopic' },
            { id: 'fn-3', title: 'Static Polymorphism (Function Overloading)', type: 'subtopic' }
          ]
        },
        {
          id: 'pointers',
          title: 'Pointers and References',
          type: 'topic',
          children: [
            { id: 'pt-1', title: 'References', type: 'subtopic' },
            { id: 'pt-2', title: 'Raw Pointers', type: 'subtopic' },
            { id: 'pt-3', title: 'Smart Pointers (weak_ptr, shared_ptr, unique_ptr)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'lang-concepts-sec',
      title: 'Language Concepts & Memory',
      type: 'section',
      children: [
        {
          id: 'memory',
          title: 'Memory Model',
          type: 'topic',
          children: [
            { id: 'me-1', title: 'Lifetime of Objects', type: 'subtopic' },
            { id: 'me-2', title: 'New/Delete Operators', type: 'subtopic' },
            { id: 'me-3', title: 'Memory Leakage', type: 'subtopic' }
          ]
        },
        {
          id: 'lang-concepts',
          title: 'Language Concepts',
          type: 'topic',
          children: [
            { id: 'lc-1', title: 'auto (Automatic Type Deduction)', type: 'subtopic' },
            { id: 'lc-2', title: 'Type Traits', type: 'subtopic' },
            { id: 'lc-3', title: 'Type Casting (static_cast, const_cast, dynamic_cast, reinterpret_cast)', type: 'subtopic' },
            { id: 'lc-4', title: 'Undefined Behavior (UB)', type: 'subtopic' },
            { id: 'lc-5', title: 'Argument Dependent Lookup (ADL)', type: 'subtopic' },
            { id: 'lc-6', title: 'Name Mangling', type: 'subtopic' },
            { id: 'lc-7', title: 'Macros', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'adv-constructs-sec',
      title: 'Advanced Constructs',
      type: 'section',
      children: [
        {
          id: 'headers',
          title: 'Headers / CPP Files',
          type: 'topic',
          children: [
            { id: 'hd-1', title: 'Namespaces', type: 'subtopic' },
            { id: 'hd-2', title: 'Scope', type: 'subtopic' }
          ]
        },
        {
          id: 'oop',
          title: 'Object Oriented Programming',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'RTTI', type: 'subtopic' },
            { id: 'op-2', title: 'Forward Declaration', type: 'subtopic' },
            { id: 'op-3', title: 'Virtual Methods', type: 'subtopic' },
            { id: 'op-4', title: 'Virtual Tables', type: 'subtopic' },
            { id: 'op-5', title: 'Dynamic Polymorphism', type: 'subtopic' },
            { id: 'op-6', title: 'Multiple Inheritance', type: 'subtopic' },
            { id: 'op-7', title: 'Diamond Inheritance', type: 'subtopic' }
          ]
        },
        { id: 'structs', title: 'Structures and Classes', type: 'topic' },
        {
          id: 'exceptions',
          title: 'Exception Handling',
          type: 'topic',
          children: [
            { id: 'ex-1', title: 'Exit Codes', type: 'subtopic' },
            { id: 'ex-2', title: 'Exceptions', type: 'subtopic' },
            { id: 'ex-3', title: 'Access Violations', type: 'subtopic' }
          ]
        },
        {
          id: 'stl',
          title: 'Standard Library + STL',
          type: 'topic',
          children: [
            { id: 'sl-1', title: 'Iterators / Algorithms / Containers', type: 'subtopic' },
            { id: 'sl-2', title: 'iostream', type: 'subtopic' },
            { id: 'sl-3', title: 'Date / Time', type: 'subtopic' }
          ]
        },
        {
          id: 'templates',
          title: 'Templates',
          type: 'topic',
          children: [
            { id: 'tm-1', title: 'SFINAE', type: 'subtopic' },
            { id: 'tm-2', title: 'Template Specialization', type: 'subtopic' },
            { id: 'tm-3', title: 'Full Template Specialization', type: 'subtopic' },
            { id: 'tm-4', title: 'Partial Template Specialization', type: 'subtopic' },
            { id: 'tm-5', title: 'Variadic Templates', type: 'subtopic' }
          ]
        },
        { id: 'multithread', title: 'Multithreading', type: 'topic' }
      ]
    },
    {
      id: 'tools-ecosystem-sec',
      title: 'Tools & Ecosystem',
      type: 'section',
      children: [
        {
          id: 'debug',
          title: 'Debugging',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'WinDBg / GDB', type: 'subtopic' },
            { id: 'db-2', title: 'Debugging Symbols', type: 'subtopic' },
            { id: 'db-3', title: 'Understanding Debugger Messages', type: 'subtopic' },
            { id: 'db-4', title: 'Debuggers', type: 'subtopic' }
          ]
        },
        {
          id: 'compilers',
          title: 'Compilers',
          type: 'topic',
          children: [
            { id: 'cm-1', title: 'Compiler Stages', type: 'subtopic' },
            { id: 'cm-2', title: 'Compilers and Features', type: 'subtopic' },
            { id: 'cm-3', title: 'Clang++ / LLVM', type: 'subtopic' },
            { id: 'cm-4', title: 'Intel C++ / GCC', type: 'subtopic' },
            { id: 'cm-5', title: 'MSVS C++ / MinGW', type: 'subtopic' }
          ]
        },
        {
          id: 'build',
          title: 'Build Systems',
          type: 'topic',
          children: [
            { id: 'bu-1', title: 'CMAKE', type: 'subtopic' },
            { id: 'bu-2', title: 'Makefile', type: 'subtopic' },
            { id: 'bu-3', title: 'Ninja', type: 'subtopic' }
          ]
        },
        {
          id: 'pkg',
          title: 'Package Managers',
          type: 'topic',
          children: [
            { id: 'pk-1', title: 'vcpkg', type: 'subtopic' },
            { id: 'pk-2', title: 'Spack', type: 'subtopic' },
            { id: 'pk-3', title: 'Conan', type: 'subtopic' },
            { id: 'pk-4', title: 'NuGet', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'principles-adv-sec',
      title: 'Principles & Advanced',
      type: 'section',
      children: [
        {
          id: 'standards',
          title: 'Standards',
          type: 'topic',
          children: [
            { id: 'sd-1', title: 'C++ 11 / 14', type: 'subtopic' },
            { id: 'sd-2', title: 'C++ 17 / C++ 20', type: 'subtopic' },
            { id: 'sd-3', title: 'Newest / C++ 0x', type: 'subtopic' }
          ]
        },
        {
          id: 'idioms',
          title: 'Idioms',
          type: 'topic',
          children: [
            { id: 'id-1', title: 'Non-Copyable / Non-Moveable', type: 'subtopic' },
            { id: 'id-2', title: 'Erase-Remove', type: 'subtopic' },
            { id: 'id-3', title: 'Copy and Swap', type: 'subtopic' },
            { id: 'id-4', title: 'Copy on Write', type: 'subtopic' },
            { id: 'id-5', title: 'RAII / Pimpl / CRTP', type: 'subtopic' },
            { id: 'id-6', title: 'Rule of Zero, Five, Three', type: 'subtopic' }
          ]
        },
        {
          id: 'libraries',
          title: 'Working with Libraries',
          type: 'topic',
          children: [
            { id: 'li-1', title: 'Library Inclusion', type: 'subtopic' },
            { id: 'li-2', title: 'Boost / OpenCV', type: 'subtopic' },
            { id: 'li-3', title: 'POCO / Tensorflow', type: 'subtopic' },
            { id: 'li-4', title: 'protobuf / spdlog', type: 'subtopic' },
            { id: 'li-5', title: 'gRPC / pybind11', type: 'subtopic' },
            { id: 'li-6', title: 'fmt / opencl', type: 'subtopic' },
            { id: 'li-7', title: 'gtest / gmock', type: 'subtopic' },
            { id: 'li-8', title: 'ranges_v3 / Catch2 / Qt', type: 'subtopic' },
            { id: 'li-9', title: 'Orbit Profiler / PyTorch C++', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'C Roadmap', type: 'topic', link: { id: 'c', title: 'C' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const cssRoadmap = {
  id: 'css',
  title: 'CSS Developer',
  description: 'Master Cascading Style Sheets to build beautiful web interfaces',
  layout: 'linear',
  category: 'skill',
  subscriberCount: '160,000',
  faq: {
    question: 'Why learn CSS deeply?',
    answer: 'Understanding CSS beyond the basics allows you to build responsive, accessible, and performant layouts without relying heavily on JS frameworks.'
  },
  items: [
    {
      id: 'intro-basics-sec',
      title: 'Intro & Basics',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Inline / Internal / External CSS', type: 'subtopic' },
            { id: 'in-2', title: 'Syntax Basics (Selector, Declaration, Properties & Values)', type: 'subtopic' },
            { id: 'in-3', title: 'Cascading order', type: 'subtopic' },
            { id: 'in-4', title: 'Rules / Comments', type: 'subtopic' }
          ]
        },
        { id: 'basics', title: 'CSS Basics', type: 'topic' },
        {
          id: 'selectors',
          title: 'Selectors',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Attribute selectors', type: 'subtopic' },
            { id: 'se-2', title: 'Simple selectors (class, id, universal, grouping)', type: 'subtopic' },
            { id: 'se-3', title: 'Combinator selectors (descendant, child, element, Next Sibling, Subsequent Sibling)', type: 'subtopic' },
            { id: 'se-4', title: 'Pseudo Classes / Pseudo Elements', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'typography-visuals-sec',
      title: 'Typography & Visuals',
      type: 'section',
      children: [
        {
          id: 'fonts',
          title: 'Fonts',
          type: 'topic',
          children: [
            { id: 'ft-1', title: 'Font families / Font style / Size', type: 'subtopic' },
            { id: 'ft-2', title: 'Font Shorthand / Font Variant', type: 'subtopic' },
            { id: 'ft-3', title: 'Google Fonts', type: 'subtopic' }
          ]
        },
        {
          id: 'text',
          title: 'Text Styling',
          type: 'topic',
          children: [
            { id: 'tx-1', title: 'Color / Direction / Text Alignment / Text Decoration', type: 'subtopic' },
            { id: 'tx-2', title: 'Text Transform / Text Spacing / Line Height', type: 'subtopic' },
            { id: 'tx-3', title: 'Text Shadows / Opacity', type: 'subtopic' }
          ]
        },
        {
          id: 'colors',
          title: 'Colors',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'rgb, hsl, hex / rgba, hsla', type: 'subtopic' },
            { id: 'cl-2', title: 'Named Colors', type: 'subtopic' }
          ]
        },
        {
          id: 'bg',
          title: 'Background',
          type: 'topic',
          children: [
            { id: 'bg-1', title: 'Background Color / Image', type: 'subtopic' },
            { id: 'bg-2', title: 'Background Gradient / Position / Attachment', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'box-model-layouts-sec',
      title: 'Box Model & Layouts',
      type: 'section',
      children: [
        {
          id: 'box',
          title: 'Box Model',
          type: 'topic',
          children: [
            { id: 'bx-1', title: 'Padding / Margin', type: 'subtopic' },
            { id: 'bx-2', title: 'Width / Height', type: 'subtopic' },
            { id: 'bx-3', title: 'Border / Outline', type: 'subtopic' },
            { id: 'bx-4', title: 'Box Shadows', type: 'subtopic' }
          ]
        },
        {
          id: 'display',
          title: 'Display',
          type: 'topic',
          children: [
            { id: 'dp-1', title: 'inline / block / inline-block', type: 'subtopic' },
            { id: 'dp-2', title: 'none / visibility', type: 'subtopic' }
          ]
        },
        {
          id: 'position',
          title: 'Position',
          type: 'topic',
          children: [
            { id: 'ps-1', title: 'Relative / Absolute', type: 'subtopic' },
            { id: 'ps-2', title: 'Sticky / Fixed / Static', type: 'subtopic' },
            { id: 'ps-3', title: 'Z-Index / Stacking Context', type: 'subtopic' }
          ]
        },
        {
          id: 'units',
          title: 'CSS Units',
          type: 'topic',
          children: [
            { id: 'un-1', title: 'Absolute vs Relative', type: 'subtopic' },
            { id: 'un-2', title: 'Units with functions', type: 'subtopic' }
          ]
        },
        { id: 'specificity', title: 'CSS Specificity', type: 'topic' }
      ]
    },
    {
      id: 'ui-elements-sec',
      title: 'UI Elements',
      type: 'section',
      children: [
        { id: 'tables', title: 'Tables', type: 'topic' },
        { id: 'lists', title: 'Lists', type: 'topic' },
        { id: 'images', title: 'Images and Filters', type: 'topic' }
      ]
    },
    {
      id: 'layout-systems-sec',
      title: 'Layout Systems',
      type: 'section',
      children: [
        {
          id: 'layouts',
          title: 'Layouts',
          type: 'topic',
          children: [
            { id: 'ly-1', title: 'Floating Elements / Multicolumn layout', type: 'subtopic' },
            { id: 'ly-2', title: 'Layouting Techniques (Flow Layout)', type: 'subtopic' },
            { id: 'ly-3', title: 'Flexbox / Grid', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-ui-sec',
      title: 'Advanced UI & Interaction',
      type: 'section',
      children: [
        {
          id: 'responsive',
          title: 'Reponsiveness',
          type: 'topic',
          children: [
            { id: 'rs-1', title: 'Media Queries / Container Queries', type: 'subtopic' },
            { id: 'rs-2', title: 'Responsive typography', type: 'subtopic' }
          ]
        },
        { id: 'transforms', title: 'Transforms', type: 'topic' },
        { id: 'transitions', title: 'Transitions', type: 'topic' },
        {
          id: 'animations',
          title: 'Animations',
          type: 'topic',
          children: [
            { id: 'an-1', title: 'Keyframe Animations', type: 'subtopic' }
          ]
        },
        { id: 'vars', title: 'CSS Variables / CSS Functions', type: 'topic' }
      ]
    },
    {
      id: 'ecosystem-sec',
      title: 'Ecosystem',
      type: 'section',
      children: [
        {
          id: 'practices',
          title: 'Best Practices',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Performance / Accessibility', type: 'subtopic' },
            { id: 'pr-2', title: 'Methodologies (BEM)', type: 'subtopic' }
          ]
        },
        {
          id: 'arch',
          title: 'CSS Architecture',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Sass / PostCSS', type: 'subtopic' },
            { id: 'ar-2', title: 'CSS Modules / CSS-in-JS', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-2', title: 'HTML Roadmap', type: 'topic', link: { id: 'html', title: 'HTML' } },
        { id: 'related-3', title: 'JavaScript Roadmap', type: 'topic', link: { id: 'javascript', title: 'JavaScript' } }
      ]
    }
  ]
};
export const cyberSecurityRoadmap = {
  id: 'cyber-security',
  title: 'Cyber Security Expert',
  description: 'Step by step guide to becoming a Cyber Security Expert',
  layout: 'linear',
  category: 'role',
  subscriberCount: '198,000',
  faq: {
    question: 'How do I start in Cyber Security?',
    answer: 'Start by building a strong foundation in networking, operating systems, and scripting before diving into security concepts like cryptography and penetration testing.'
  },
  items: [
    {
      id: 'foundations-sec',
      title: 'Foundations',
      type: 'section',
      children: [
        {
          id: 'foundations',
          title: 'Fundamental IT Skills',
          type: 'topic',
          children: [
            {
              id: 'hardware',
              title: 'Computer Hardware Components',
              type: 'subgroup',
              children: [
                { id: 'hw-1', title: 'Connection Types', type: 'subtopic' },
                { id: 'hw-2', title: 'NFC / Bluetooth / WiFi / Infrared', type: 'subtopic' },
                { id: 'hw-3', title: 'OS-Independent Troubleshooting', type: 'subtopic' }
              ]
            },
            {
              id: 'suites',
              title: 'Understand Basics of Popular Suites',
              type: 'subgroup',
              children: [
                { id: 'su-1', title: 'MS Office Suite', type: 'subtopic' },
                { id: 'su-2', title: 'iCloud', type: 'subtopic' },
                { id: 'su-3', title: 'Google Suite', type: 'subtopic' }
              ]
            },
            {
              id: 'os',
              title: 'Operating Systems',
              type: 'subgroup',
              children: [
                { id: 'os-1', title: 'Windows / Linux / MacOS', type: 'subtopic' },
                { id: 'os-2', title: 'Installation and Configuration', type: 'subtopic' },
                { id: 'os-3', title: 'Navigating using GUI and CLI', type: 'subtopic' },
                { id: 'os-4', title: 'Understand Permissions', type: 'subtopic' },
                { id: 'os-5', title: 'Installing Software', type: 'subtopic' },
                { id: 'os-6', title: 'Performing CRUD on Files', type: 'subtopic' },
                { id: 'os-7', title: 'Troubleshooting', type: 'subtopic' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'virt-networking-sec',
      title: 'Virtualization & Networking',
      type: 'section',
      children: [
        {
          id: 'virt',
          title: 'Basics of Virtualization',
          type: 'topic',
          children: [
            { id: 'vt-1', title: 'Hypervisor / GuestOS / HostOS / VM', type: 'subtopic' },
            { id: 'vt-2', title: 'Common Virtualization Technologies (VMWare, VirtualBox, esxi, proxmox)', type: 'subtopic' }
          ]
        },
        {
          id: 'networking',
          title: 'Basics of Computer Networking',
          type: 'topic',
          children: [
            { id: 'nw-1', title: 'Basics of Subnetting (Public vs Private IP, CIDR, subnet mask, default gateway)', type: 'subtopic' },
            { id: 'nw-2', title: 'VLAN / DMZ / ARP / DHCP / DNS / NAT', type: 'subtopic' },
            { id: 'nw-3', title: 'Router / Switch / VPN / MAN / LAN / WAN', type: 'subtopic' },
            { id: 'nw-4', title: 'Network Topologies (Star, Ring, Mesh, Bus)', type: 'subtopic' },
            { id: 'nw-5', title: 'OSI Model / Networking Protocols', type: 'subtopic' },
            { id: 'nw-6', title: 'Common Ports and their Uses', type: 'subtopic' },
            { id: 'nw-7', title: 'SSL and TLS Basics', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'cloud-sec',
      title: 'Cloud',
      type: 'section',
      children: [
        {
          id: 'cloud',
          title: 'Cloud Skills and Knowledge',
          type: 'topic',
          children: [
            { id: 'cd-1', title: 'Understand Cloud Services (SaaS, PaaS, IaaS)', type: 'subtopic' },
            { id: 'cd-2', title: 'Understand Concept of Security in the Cloud', type: 'subtopic' },
            { id: 'cd-3', title: 'Cloud vs on-premises', type: 'subtopic' },
            { id: 'cd-4', title: 'Cloud Models (Private, Public, Hybrid)', type: 'subtopic' },
            { id: 'cd-5', title: 'Infrastructure as Code / Serverless', type: 'subtopic' },
            { id: 'cd-6', title: 'Common Cloud Environments (AWS, GCP, Azure)', type: 'subtopic' },
            { id: 'cd-7', title: 'Common Cloud Storage', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'security-concepts-sec',
      title: 'Security Concepts',
      type: 'section',
      children: [
        {
          id: 'security',
          title: 'Security Skills and Knowledge',
          type: 'topic',
          children: [
            { id: 'sc-1', title: 'Understand Common Standards (ISO, NIST, CIS CSF)', type: 'subtopic' },
            { id: 'sc-2', title: 'Core Concepts of Zero Trust', type: 'subtopic' },
            { id: 'sc-3', title: 'Roles of Compliance and Auditors', type: 'subtopic' },
            { id: 'sc-4', title: 'Understand Definition of Risk', type: 'subtopic' },
            { id: 'sc-5', title: 'Understand Concept of Runbooks', type: 'subtopic' },
            { id: 'sc-6', title: 'Blue / Red / Purple Teams', type: 'subtopic' },
            { id: 'sc-7', title: 'False/True Negative/Positive', type: 'subtopic' },
            { id: 'sc-8', title: 'Basics of Threat Intel, OSINT', type: 'subtopic' },
            { id: 'sc-9', title: 'Threat Hunting / Honeypots', type: 'subtopic' },
            { id: 'sc-10', title: 'Vulnerability Management / OS Hardening', type: 'subtopic' },
            { id: 'sc-11', title: 'Penetration Testing Rules of Engagement', type: 'subtopic' },
            { id: 'sc-12', title: 'Perimeter vs DMZ vs Segmentation', type: 'subtopic' },
            { id: 'sc-13', title: 'Basics of IDS and IPS', type: 'subtopic' },
            { id: 'sc-14', title: 'Authentication vs Authorization', type: 'subtopic' },
            { id: 'sc-15', title: 'Basics of Cryptography (Salting, Hashing, Key Exchange, PKI)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'programming-sec',
      title: 'Programming & Scripts',
      type: 'section',
      children: [
        {
          id: 'programming',
          title: 'Programming Skills',
          type: 'topic',
          children: [
            { id: 'pg-1', title: 'Python / C++ / Bash', type: 'subtopic' },
            { id: 'pg-2', title: 'Go / JavaScript / Power Shell', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'hacking-sec',
      title: 'Hacking Concepts',
      type: 'section',
      children: [
        {
          id: 'hacking',
          title: 'Hacking Concepts & Attacks',
          type: 'topic',
          children: [
            { id: 'hk-1', title: 'Web Based Attacks (OWASP10)', type: 'subtopic' },
            { id: 'hk-2', title: 'Understand Common Hacking Tools', type: 'subtopic' },
            { id: 'hk-3', title: 'Malware Types', type: 'subtopic' },
            { id: 'hk-4', title: 'Attack Types (Phishing, Whaling, Smishing)', type: 'subtopic' },
            { id: 'hk-5', title: 'Social Engineering / Zero day', type: 'subtopic' },
            { id: 'hk-6', title: 'Brute Force vs Password Spray', type: 'subtopic' },
            { id: 'hk-7', title: 'DoS vs DDoS / MITM / CSRF / Spoofing', type: 'subtopic' },
            { id: 'hk-8', title: 'SQL Injection / XSS / Evil Twin', type: 'subtopic' },
            { id: 'hk-9', title: 'Buffer Overflow / Directory Traversal', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'incident-response-sec',
      title: 'Incident Response',
      type: 'section',
      children: [
        {
          id: 'ir',
          title: 'Incident Response',
          type: 'topic',
          children: [
            { id: 'ir-1', title: 'Tools for Incident Response and Discovery', type: 'subtopic' },
            { id: 'ir-2', title: 'Understand the Incident Response Process (Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'certs-ctfs-sec',
      title: 'Certs & CTFs',
      type: 'section',
      children: [
        {
          id: 'certs',
          title: 'Certifications',
          type: 'topic',
          children: [
            { id: 'ce-1', title: 'Beginner (CompTIA A+, Linux+, Network+, Security+, CCNA)', type: 'subtopic' },
            { id: 'ce-2', title: 'Advanced (CEH, CISA, CISM, GSEC, OSCP, CISSP)', type: 'subtopic' }
          ]
        },
        {
          id: 'ctfs',
          title: 'CTFs (Capture the Flag)',
          type: 'topic',
          children: [
            { id: 'ct-1', title: 'HackTheBox / TryHackMe', type: 'subtopic' },
            { id: 'ct-2', title: 'VulnHub / picoCTF / SANS Holiday Hack', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AI Red Teaming Roadmap', type: 'topic', link: { id: 'ai-red-teaming', title: 'AI Red Teaming' } },
        { id: 'related-2', title: 'DevSecOps Roadmap', type: 'topic', link: { id: 'devsecops', title: 'DevSecOps' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const dataAnalystRoadmap = {
  id: 'data-analyst',
  title: 'Data Analyst',
  description: 'Step by step guide to becoming a Data Analyst',
  layout: 'linear',
  category: 'role',
  subscriberCount: '210,000',
  faq: {
    question: 'What is a Data Analyst?',
    answer: 'A Data Analyst collects, processes, and performs statistical analyses of data to help companies make better business decisions.'
  },
  items: [
    {
      id: 'foundation-excel-sec',
      title: 'Foundation & Excel',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'What is Data Analytics',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Introduction', type: 'subtopic' },
            { id: 'in-2', title: 'Types of Data Analytics (Descriptive, Diagnostic, Predictive, Prescriptive)', type: 'subtopic' }
          ]
        },
        {
          id: 'concepts',
          title: 'Key Concepts of Data',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Collection / Cleanup', type: 'subtopic' },
            { id: 'co-2', title: 'Exploration / Visualisation', type: 'subtopic' },
            { id: 'co-3', title: 'Statistical Analysis', type: 'subtopic' },
            { id: 'co-4', title: 'Machine Learning', type: 'subtopic' }
          ]
        },
        { id: 'foundation', title: 'Building a Strong Foundation', type: 'topic' },
        {
          id: 'excel',
          title: 'Analysis / Reporting with Excel',
          type: 'topic',
          children: [
            { id: 'ex-1', title: 'IF / DATEDIF / VLOOKUP / HLOOKUP', type: 'subtopic' },
            { id: 'ex-2', title: 'REPLACE / SUBSTITUTE', type: 'subtopic' },
            { id: 'ex-3', title: 'UPPER / LOWER / PROPER', type: 'subtopic' },
            { id: 'ex-4', title: 'CONCAT / TRIM / AVERAGE / COUNT', type: 'subtopic' },
            { id: 'ex-5', title: 'SUM / MIN / MAX', type: 'subtopic' },
            { id: 'ex-6', title: 'Pivot Tables / Charting', type: 'subtopic' },
            { id: 'ex-7', title: 'Learn Common Functions', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'programming-sql-sec',
      title: 'Programming & SQL',
      type: 'section',
      children: [
        {
          id: 'prog',
          title: 'Gain Programming Skills',
          type: 'topic',
          children: [
            { id: 'pg-1', title: '1. Learn a Programming Lang (Python, R)', type: 'subtopic' },
            { id: 'pg-2', title: '2. Data Manipulation Libraries (Pandas, Dplyr)', type: 'subtopic' },
            { id: 'pg-3', title: '3. Data Visualisation Libraries (Matplotlib, Ggplot2)', type: 'subtopic' }
          ]
        },
        { id: 'sql', title: 'Learn SQL', type: 'topic' }
      ]
    },
    {
      id: 'data-handling-sec',
      title: 'Data Handling & Collection',
      type: 'section',
      children: [
        { id: 'handling', title: 'Mastering Data Handling', type: 'topic' },
        {
          id: 'collect',
          title: 'Data Collection',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Databases', type: 'subtopic' },
            { id: 'cl-2', title: 'CSV Files', type: 'subtopic' },
            { id: 'cl-3', title: 'APIs', type: 'subtopic' },
            { id: 'cl-4', title: 'Web Scraping', type: 'subtopic' }
          ]
        },
        {
          id: 'cleanup',
          title: 'Data Cleanup',
          type: 'topic',
          children: [
            { id: 'cu-1', title: 'Handling Missing Data', type: 'subtopic' },
            { id: 'cu-2', title: 'Removing Duplicates', type: 'subtopic' },
            { id: 'cu-3', title: 'Finding Outliers', type: 'subtopic' },
            { id: 'cu-4', title: 'Data Transformation', type: 'subtopic' },
            { id: 'cu-5', title: 'Using Libraries for Cleanup (Pandas, Dplyr)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'stats-analysis-sec',
      title: 'Stats & Analysis',
      type: 'section',
      children: [
        {
          id: 'stats',
          title: 'Statistical Analysis',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Dispersion (Range, Variance, Standard Deviation)', type: 'subtopic' },
            { id: 'st-2', title: 'Central Tendency (Mean, Median, Mode, Average)', type: 'subtopic' },
            { id: 'st-3', title: 'Distribution Space (Skewness, Kurtosis)', type: 'subtopic' },
            { id: 'st-4', title: 'Generating Statistics', type: 'subtopic' },
            { id: 'st-5', title: 'Visualizing Distributions', type: 'subtopic' },
            { id: 'st-6', title: 'Hypothesis Testing', type: 'subtopic' },
            { id: 'st-7', title: 'Correlation Analysis', type: 'subtopic' },
            { id: 'st-8', title: 'Regression', type: 'subtopic' }
          ]
        },
        {
          id: 'analysis',
          title: 'Data Analysis Techniques',
          type: 'topic',
          children: [
            { id: 'an-1', title: 'Descriptive Analysis', type: 'subtopic' },
            { id: 'an-2', title: 'Learn to analyze relationships and make data driven decisions', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'visualisation-sec',
      title: 'Data Visualisation',
      type: 'section',
      children: [
        { id: 'vis', title: 'Data Visualisation', type: 'topic' },
        {
          id: 'vis-tools',
          title: 'Tools',
          type: 'topic',
          children: [
            { id: 'tl-1', title: 'Tableau', type: 'subtopic' },
            { id: 'tl-2', title: 'Power BI', type: 'subtopic' }
          ]
        },
        {
          id: 'vis-libs',
          title: 'Libraries',
          type: 'topic',
          children: [
            { id: 'lb-1', title: 'Matplotlib', type: 'subtopic' },
            { id: 'lb-2', title: 'ggplot2', type: 'subtopic' },
            { id: 'lb-3', title: 'Seaborn', type: 'subtopic' }
          ]
        },
        {
          id: 'vis-tech',
          title: 'Learn Different Techniques',
          type: 'topic',
          children: [
            { id: 'tc-1', title: 'Bar Charts / Line Chart / Scatter Plot', type: 'subtopic' },
            { id: 'tc-2', title: 'Funnel Charts / Pie Charts', type: 'subtopic' },
            { id: 'tc-3', title: 'Histograms / Stacked Charts / Heatmap', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-sec',
      title: 'Advanced Topics',
      type: 'section',
      children: [
        { id: 'adv', title: 'Advanced Topics', type: 'topic' },
        {
          id: 'ml',
          title: 'Machine Learning',
          type: 'topic',
          children: [
            { id: 'ml-1', title: 'Types (Reinforcement, Unsupervised, Supervised)', type: 'subtopic' },
            { id: 'ml-2', title: 'Model Evaluation Techniques', type: 'subtopic' },
            { id: 'ml-3', title: 'Algorithms (Decision Trees, Naive Byes, KNN, K-Means, Logistic Regression)', type: 'subtopic' },
            { id: 'ml-4', title: 'Deep Learning (CNNs, RNN, Neural Networks, Tensorflow, Pytorch)', type: 'subtopic' }
          ]
        },
        {
          id: 'bigdata',
          title: 'Big Data Technologies',
          type: 'topic',
          children: [
            { id: 'bd-1', title: 'Big Data Concepts', type: 'subtopic' },
            { id: 'bd-2', title: 'Data Storage Solutions', type: 'subtopic' },
            { id: 'bd-3', title: 'Processing Frameworks (Hadoop, Spark)', type: 'subtopic' },
            { id: 'bd-4', title: 'Data Processing Techniques (Parallel Processing, MPI, MapReduce)', type: 'subtopic' }
          ]
        },
        {
          id: 'practice',
          title: 'Practice Training Models',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Build a portfolio (Predicting sales, Customer Segmentation)', type: 'subtopic' },
            { id: 'pr-2', title: 'Participate in Kaggle Competitions', type: 'subtopic' },
            { id: 'pr-3', title: 'Online Courses and Certifications', type: 'subtopic' },
            { id: 'pr-4', title: 'Stay Updated and Network', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AI and Data Scientist Roadmap', type: 'topic', link: { id: 'data-scientist', title: 'Data Scientist' } }
      ]
    }
  ]
};
export const dataEngineerRoadmap = {
  id: 'data-engineer',
  title: 'Data Engineer',
  description: 'Step by step guide to becoming a Data Engineer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '190,000',
  faq: {
    question: 'What is a Data Engineer?',
    answer: 'A Data Engineer builds systems that collect, manage, and convert raw data into usable information for data scientists and business analysts to interpret.'
  },
  items: [
    {
      id: 'intro-basics-sec',
      title: 'Intro & Basics',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is Data Engineering?', type: 'subtopic' },
            { id: 'in-2', title: 'Data Engineering vs Data Science', type: 'subtopic' },
            { id: 'in-3', title: 'Data Engineering Lifecycle', type: 'subtopic' },
            { id: 'in-4', title: 'Choosing the Right Technologies', type: 'subtopic' }
          ]
        },
        { id: 'skills', title: 'Skills and Responsibilities', type: 'topic' },
        {
          id: 'prog',
          title: 'Programming Skills',
          type: 'topic',
          children: [
            { id: 'pg-1', title: 'Python (recommended) / Java / Scala / Go', type: 'subtopic' },
            { id: 'pg-2', title: 'Data Structures and Algorithms', type: 'subtopic' }
          ]
        },
        {
          id: 'basics',
          title: 'Learn the Basics',
          type: 'topic',
          children: [
            { id: 'bs-1', title: 'Git and GitHub', type: 'subtopic' },
            { id: 'bs-2', title: 'Linux Basics', type: 'subtopic' },
            { id: 'bs-3', title: 'Networking Fundamentals', type: 'subtopic' },
            { id: 'bs-4', title: 'Distributed Systems Basics', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'lifecycle-steps-sec',
      title: 'Lifecycle Steps',
      type: 'section',
      children: [
        {
          id: 'steps',
          title: 'Understand Different Steps',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Data Generation', type: 'subtopic' },
            { id: 'st-2', title: 'Data Storage', type: 'subtopic' },
            { id: 'st-3', title: 'Data Ingestion', type: 'subtopic' },
            { id: 'st-4', title: 'Data Serving', type: 'subtopic' }
          ]
        },
        {
          id: 'gen',
          title: 'Data Generation',
          type: 'topic',
          children: [
            { id: 'gn-1', title: 'Sources of Data (APIs, Logs, Mobile Apps, IoT)', type: 'subtopic' },
            { id: 'gn-2', title: 'Data Collection Considerations', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'dbs-storage-sec',
      title: 'DBs & Storage',
      type: 'section',
      children: [
        {
          id: 'db-fund',
          title: 'Database Fundamentals',
          type: 'topic',
          children: [
            { id: 'df-1', title: 'Database Normalization', type: 'subtopic' },
            { id: 'df-2', title: 'Data Modelling Techniques', type: 'subtopic' },
            { id: 'df-3', title: 'CAP Theorem / OLTP vs OLAP', type: 'subtopic' },
            { id: 'df-4', title: 'Learn SQL / Indexing / Transactions', type: 'subtopic' },
            { id: 'df-5', title: 'Slowly Changing Dimension (SCD)', type: 'subtopic' },
            { id: 'df-6', title: 'Horizontal vs Vertical Scaling', type: 'subtopic' },
            { id: 'df-7', title: 'Star vs Snowflake Schema', type: 'subtopic' }
          ]
        },
        { id: 'storage', title: 'Data Storage', type: 'topic' },
        {
          id: 'relational',
          title: 'Relational Databases',
          type: 'topic',
          children: [
            { id: 'rl-1', title: 'MySQL / PostgreSQL / MariaDB', type: 'subtopic' },
            { id: 'rl-2', title: 'Aurora DB / Oracle / MS SQL', type: 'subtopic' }
          ]
        },
        {
          id: 'nosql',
          title: 'NoSQL Databases',
          type: 'topic',
          children: [
            { id: 'ns-1', title: 'Document (MongoDB, CouchDB)', type: 'subtopic' },
            { id: 'ns-2', title: 'Column (Cassandra, HBase)', type: 'subtopic' },
            { id: 'ns-3', title: 'Graph (Neo4j, Neptune)', type: 'subtopic' },
            { id: 'ns-4', title: 'Key-Value (Redis, Memcached, DynamoDB, CosmosDB, BigTable)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'warehousing-arch-sec',
      title: 'Warehousing & Arch',
      type: 'section',
      children: [
        {
          id: 'dwh',
          title: 'Data Warehousing',
          type: 'topic',
          children: [
            { id: 'dw-1', title: 'What is Data Warehouse?', type: 'subtopic' },
            { id: 'dw-2', title: 'Data Warehousing Architectures', type: 'subtopic' },
            { id: 'dw-3', title: 'Data Mart / Data Mesh', type: 'subtopic' },
            { id: 'dw-4', title: 'Google BigQuery / Snowflake / Amazon Redshift', type: 'subtopic' }
          ]
        },
        {
          id: 'datalake',
          title: 'Data Lake',
          type: 'topic',
          children: [
            { id: 'dl-1', title: 'Databricks Delta Lake / Snowflake / Onehouse', type: 'subtopic' },
            { id: 'dl-2', title: 'Other Data Architectures (Data Fabric, Data Hub)', type: 'subtopic' },
            { id: 'dl-3', title: 'Metadata-first Architecture', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ingestion-sec',
      title: 'Ingestion',
      type: 'section',
      children: [
        {
          id: 'ingestion',
          title: 'Data Ingestion',
          type: 'topic',
          children: [
            { id: 'ig-1', title: 'Types of Data Ingestion', type: 'subtopic' },
            { id: 'ig-2', title: 'Batch / Hybrid / Streaming / Realtime', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'cloud-sec',
      title: 'Cloud',
      type: 'section',
      children: [
        {
          id: 'cloud',
          title: 'Cloud Computing',
          type: 'topic',
          children: [
            { id: 'cc-1', title: 'Serverless Options', type: 'subtopic' },
            { id: 'cc-2', title: 'Cloud Architectures', type: 'subtopic' }
          ]
        },
        {
          id: 'cloud-aws',
          title: 'AWS',
          type: 'topic',
          children: [
            { id: 'aw-1', title: 'Amazon EC2 (Compute)', type: 'subtopic' },
            { id: 'aw-2', title: 'S3 (Storage)', type: 'subtopic' },
            { id: 'aw-3', title: 'Amazon RDS (Database)', type: 'subtopic' },
            { id: 'aw-4', title: 'Glue (ETL)', type: 'subtopic' }
          ]
        },
        {
          id: 'cloud-azure',
          title: 'Azure',
          type: 'topic',
          children: [
            { id: 'az-1', title: 'Azure Virtual Machines', type: 'subtopic' },
            { id: 'az-2', title: 'Azure Blob Storage', type: 'subtopic' },
            { id: 'az-3', title: 'Azure SQL Database', type: 'subtopic' },
            { id: 'az-4', title: 'Data Factory (ETL)', type: 'subtopic' }
          ]
        },
        {
          id: 'cloud-gcp',
          title: 'Google Cloud',
          type: 'topic',
          children: [
            { id: 'gc-1', title: 'Compute Engine', type: 'subtopic' },
            { id: 'gc-2', title: 'Google Cloud Storage', type: 'subtopic' },
            { id: 'gc-3', title: 'Cloud SQL (Database)', type: 'subtopic' },
            { id: 'gc-4', title: 'Dataflow', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'pipelines-processing-sec',
      title: 'Pipelines & Processing',
      type: 'section',
      children: [
        {
          id: 'pipelines',
          title: 'Data Pipelines',
          type: 'topic',
          children: [
            { id: 'dp-1', title: 'ETL Process (Extract, Transform, Load)', type: 'subtopic' }
          ]
        },
        {
          id: 'pipeline-tools',
          title: 'Data Pipeline Tools',
          type: 'topic',
          children: [
            { id: 'pt-1', title: 'Apache Airflow / dbt / Luigi / Perfect', type: 'subtopic' }
          ]
        },
        {
          id: 'cluster',
          title: 'Cluster Computing Basics',
          type: 'topic',
          children: [
            { id: 'cc-1', title: 'What is Cluster Computing', type: 'subtopic' },
            { id: 'cc-2', title: 'Distributed File Systems (HDFS)', type: 'subtopic' },
            { id: 'cc-3', title: 'Job Scheduling', type: 'subtopic' },
            { id: 'cc-4', title: 'Cluster Management Tools (Kubernetes, Apache Hadoop YARN)', type: 'subtopic' }
          ]
        },
        {
          id: 'bigdata-tools',
          title: 'Big Data Tools',
          type: 'topic',
          children: [
            { id: 'bd-1', title: 'Apache Spark', type: 'subtopic' },
            { id: 'bd-2', title: 'Hadoop Ecosystem (HDFS, YARN, MapReduce)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'cicd-testing-messaging-sec',
      title: 'CI/CD, Testing, Messaging',
      type: 'section',
      children: [
        {
          id: 'containers',
          title: 'Containers & Orchestration',
          type: 'topic',
          children: [
            { id: 'cn-1', title: 'Docker / Kubernetes', type: 'subtopic' },
            { id: 'cn-2', title: 'Google Cloud GKE', type: 'subtopic' },
            { id: 'cn-3', title: 'AWS EKS', type: 'subtopic' }
          ]
        },
        {
          id: 'cicd',
          title: 'CI/CD',
          type: 'topic',
          children: [
            { id: 'ci-1', title: 'GitHub Actions / Circle CI', type: 'subtopic' },
            { id: 'ci-2', title: 'GitLab CI / ArgoCD', type: 'subtopic' }
          ]
        },
        {
          id: 'monitoring',
          title: 'Monitoring',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Prometheus', type: 'subtopic' },
            { id: 'mo-2', title: 'Datadog / Sentry / New Relic', type: 'subtopic' }
          ]
        },
        {
          id: 'testing',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'ts-1', title: 'Unit Testing / Integration Testing', type: 'subtopic' },
            { id: 'ts-2', title: 'End-to-End Testing / Functional Testing', type: 'subtopic' },
            { id: 'ts-3', title: 'A/B Testing / Load Testing / Smoke Testing', type: 'subtopic' }
          ]
        },
        {
          id: 'messaging',
          title: 'Messaging Systems',
          type: 'topic',
          children: [
            { id: 'ms-1', title: 'What and why use them?', type: 'subtopic' },
            { id: 'ms-2', title: 'Async vs Sync Communication', type: 'subtopic' },
            { id: 'ms-3', title: 'Messages vs Streams / Best Practices', type: 'subtopic' },
            { id: 'ms-4', title: 'Common Tools (Apache Kafka, RabbitMQ, AWS SQS, AWS SNS)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'iac-serving-sec',
      title: 'IaC & Serving',
      type: 'section',
      children: [
        {
          id: 'iac',
          title: 'Infrastructure as Code - IaC',
          type: 'topic',
          children: [
            { id: 'ic-1', title: 'Declarative vs Imperative', type: 'subtopic' },
            { id: 'ic-2', title: 'Idempotency / Reusability', type: 'subtopic' },
            { id: 'ic-3', title: 'Environmental Management', type: 'subtopic' },
            { id: 'ic-4', title: 'Common Tools (Terraform, OpenTofu, AWS CDK, Google Deployment Mgr.)', type: 'subtopic' }
          ]
        },
        {
          id: 'serving',
          title: 'Data Serving',
          type: 'topic',
          children: [
            { id: 'sv-1', title: 'Data Analytics', type: 'subtopic' },
            { id: 'sv-2', title: 'Business Intelligence', type: 'subtopic' },
            { id: 'sv-3', title: 'BI Tools (Microsoft Power BI, Streamlit, Tableu, Looker)', type: 'subtopic' }
          ]
        },
        {
          id: 'reverse-etl',
          title: 'Reverse ETL',
          type: 'topic',
          children: [
            { id: 're-1', title: 'ETL vs Reverse ETL', type: 'subtopic' },
            { id: 're-2', title: 'Reverse ETL Usecases', type: 'subtopic' },
            { id: 're-3', title: 'Tools (Hightouch, Census, Segment)', type: 'subtopic' }
          ]
        },
        {
          id: 'security',
          title: 'Security & Governance',
          type: 'topic',
          children: [
            { id: 'sg-1', title: 'Authentication vs Authorization', type: 'subtopic' },
            { id: 'sg-2', title: 'Encryption / Tokenization / Data Masking / Data Obfuscation', type: 'subtopic' },
            { id: 'sg-3', title: 'Data Lineage / Metadata Management / Data Interoperability', type: 'subtopic' },
            { id: 'sg-4', title: 'Data Quality / Data Governance', type: 'subtopic' },
            { id: 'sg-5', title: 'Data and AI Regulations (GDPR, Privacy, ECPA, EU AI Act)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ml-mlops-sec',
      title: 'ML & MLOps',
      type: 'section',
      children: [
        { id: 'ml', title: 'Machine Learning', type: 'topic' },
        { id: 'mlops', title: 'MLOps', type: 'topic' }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Python Roadmap', type: 'topic', link: { id: 'python', title: 'Python' } },
        { id: 'related-2', title: 'Data Analyst Roadmap', type: 'topic', link: { id: 'data-analyst', title: 'Data Analyst' } }
      ]
    }
  ]
};
export const designSystemRoadmap = {
  id: 'design-system',
  title: 'Design System',
  description: 'Step by step guide to creating and maintaining a Design System',
  layout: 'linear',
  category: 'skill',
  subscriberCount: '150,000',
  faq: {
    question: 'What is a Design System?',
    answer: 'A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.'
  },
  items: [
    {
      id: 'basics-sec',
      title: 'Basics',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'What is a Design System?',
          type: 'topic',
          children: [
            { id: 'bs-1', title: 'Need of Design System', type: 'subtopic' },
            { id: 'bs-2', title: 'Design System vs Component Library', type: 'subtopic' },
            { id: 'bs-3', title: 'What is Atomic Design', type: 'subtopic' },
            { id: 'bs-4', title: 'Component / Pattern / Token', type: 'subtopic' },
            { id: 'bs-5', title: 'Design Language / Guidelines / UI Kit', type: 'subtopic' },
            { id: 'bs-6', title: 'Stakeholders Involved', type: 'subtopic' },
            { id: 'bs-7', title: 'Design System Examples', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'making-it-sec',
      title: 'Making it',
      type: 'section',
      children: [
        { id: 'making', title: 'Making a Design System', type: 'topic' },
        {
          id: 'scratch',
          title: 'Making it from Scratch',
          type: 'topic',
          children: [
            { id: 'ms-1', title: 'A/B Tests & Experiments', type: 'subtopic' },
            { id: 'ms-2', title: 'Regional Requirements', type: 'subtopic' }
          ]
        },
        {
          id: 'existing',
          title: 'Making it from Existing Design',
          type: 'topic',
          children: [
            {
              id: 'existing-audit',
              title: 'Performing a Visual Audit',
              type: 'subgroup',
              children: [
                { id: 'ea-1', title: 'Identify Existing Design Process', type: 'subtopic' },
                { id: 'ea-2', title: 'Identify Design Elements', type: 'subtopic' },
                { id: 'ea-3', title: 'Existing Design Analysis', type: 'subtopic' },
                { id: 'ea-4', title: 'Icons / Sizing / Visual Forms', type: 'subtopic' },
                { id: 'ea-5', title: 'Color / Spaces / Typography', type: 'subtopic' }
              ]
            },
            {
              id: 'existing-comps',
              title: 'Identify Components',
              type: 'subgroup',
              children: [
                { id: 'ec-1', title: 'Avatar / Banners / Badges', type: 'subtopic' },
                { id: 'ec-2', title: 'Cards / Forms / Buttons', type: 'subtopic' },
                { id: 'ec-3', title: 'Dropdowns / ...other', type: 'subtopic' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'design-language-sec',
      title: 'Design Language',
      type: 'section',
      children: [
        { id: 'lang', title: 'Creating Design Language', type: 'topic' },
        {
          id: 'brand',
          title: 'Brand & Guidelines',
          type: 'topic',
          children: [
            { id: 'bg-1', title: 'Writing Guidelines (Tone of Voice, Terminology)', type: 'subtopic' },
            { id: 'bg-2', title: 'Design Principles (Vision)', type: 'subtopic' }
          ]
        },
        {
          id: 'logo',
          title: 'Logo & Colors',
          type: 'topic',
          children: [
            { id: 'lc-1', title: 'Monochrome Version', type: 'subtopic' },
            { id: 'lc-2', title: 'Small Use Guidance / Placement Guidance', type: 'subtopic' },
            { id: 'lc-3', title: 'Usage Guidance / File Formats', type: 'subtopic' },
            { id: 'lc-4', title: 'Colors (Functional Colors, Dark Mode)', type: 'subtopic' }
          ]
        },
        {
          id: 'layout',
          title: 'Layout & Typography',
          type: 'topic',
          children: [
            { id: 'lt-1', title: 'Units / Grid (Breakpoints, Spacking, Responsiveness, Grid Relation)', type: 'subtopic' },
            { id: 'lt-2', title: 'Typography (Readability, Performance, Guidelines)', type: 'subtopic' },
            { id: 'lt-3', title: 'Iconography (Accessibility, Style, Naming, Grid Relation, Sizes, Keywords)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-components-sec',
      title: 'Core Components',
      type: 'section',
      children: [
        { id: 'core', title: 'Creating Core Components', type: 'topic' },
        {
          id: 'core-design',
          title: 'Design',
          type: 'topic',
          children: [
            { id: 'cd-1', title: 'Design Editor / Plugins', type: 'subtopic' },
            { id: 'cd-2', title: 'Version Control', type: 'subtopic' },
            { id: 'cd-3', title: 'Contribution Guidelines', type: 'subtopic' }
          ]
        },
        {
          id: 'core-dev',
          title: 'Development',
          type: 'topic',
          children: [
            { id: 'cv-1', title: 'Component Catalog / Documentation', type: 'subtopic' },
            { id: 'cv-2', title: 'Code Style / Unit Testing', type: 'subtopic' },
            { id: 'cv-3', title: 'Accessibility Testing / Semantic Versioning', type: 'subtopic' },
            { id: 'cv-4', title: 'Task Management / Release Strategy', type: 'subtopic' },
            { id: 'cv-5', title: 'Commit Guidelines / PR Templates', type: 'subtopic' },
            { id: 'cv-6', title: 'Contribution Guidelines', type: 'subtopic' }
          ]
        },
        {
          id: 'components',
          title: 'Common Components',
          type: 'topic',
          children: [
            { id: 'cm-1', title: 'Avatar / Banner / Badge / Button / Card', type: 'subtopic' },
            { id: 'cm-2', title: 'Carousel / Dropdown / Icon / Select', type: 'subtopic' },
            { id: 'cm-3', title: 'Textarea / Input Text / Input Checkbox', type: 'subtopic' },
            { id: 'cm-4', title: 'Input Radio / Input Switch / Tooling', type: 'subtopic' },
            { id: 'cm-5', title: 'List / Loading Indicator / Modal', type: 'subtopic' },
            { id: 'cm-6', title: 'Tabs / Toast / Tooltip', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'analytics-comms-sec',
      title: 'Analytics & Comms',
      type: 'section',
      children: [
        {
          id: 'analytics',
          title: 'Analytics',
          type: 'topic',
          children: [
            { id: 'an-1', title: 'Component Analytics', type: 'subtopic' },
            { id: 'an-2', title: 'Tooling Analytics', type: 'subtopic' },
            { id: 'an-3', title: 'Service and Health Metrics', type: 'subtopic' }
          ]
        },
        {
          id: 'comms',
          title: 'Communications',
          type: 'topic',
          children: [
            { id: 'cm-1', title: 'Community Meetings', type: 'subtopic' },
            { id: 'cm-2', title: 'Communication Channel', type: 'subtopic' },
            { id: 'cm-3', title: 'Open Hours / FAQs', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-2', title: 'UX Design Roadmap', type: 'topic', link: { id: 'ux-design', title: 'UX Design' } }
      ]
    }
  ]
};
export const dsaRoadmap = {
  id: 'datastructures-and-algorithms',
  title: 'Data Structures & Algorithms',
  description: 'Master core CS concepts to write efficient code and ace technical interviews',
  layout: 'linear',
  category: 'best-practices',
  subscriberCount: '345,000',
  faq: {
    question: 'Why learn DSA?',
    answer: 'DSA helps you solve complex computational problems efficiently and is universally required for technical interviews at top tech companies.'
  },
  items: [
    {
      id: 'programming-fundamentals-sec',
      title: 'Programming Fundamentals',
      type: 'section',
      children: [
        {
          id: 'fundamentals',
          title: 'Programming Fundamentals',
          type: 'topic',
          children: [
            { id: 'pf-1', title: 'Language Syntax / Control Structures', type: 'subtopic' },
            { id: 'pf-2', title: 'Pseudo Code / Functions / OOP Basics', type: 'subtopic' },
            { id: 'pf-3', title: 'Pick a Language: C# / JavaScript / C++ / Java / Python / Go / Rust / Ruby', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ds-intro-sec',
      title: 'Data Structures Intro',
      type: 'section',
      children: [
        {
          id: 'ds-intro',
          title: 'What are Data Structures?',
          type: 'topic',
          children: [
            { id: 'di-1', title: 'Why are Data Structures Important?', type: 'subtopic' },
            { id: 'di-2', title: 'Basic Data Structures (Array, Linked Lists, Queues, Stacks, Hash Tables)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'asymptotic-sec',
      title: 'Asymptotic Notation',
      type: 'section',
      children: [
        {
          id: 'asymptotic',
          title: 'Asymptotic Notation',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Time vs Space Complexity', type: 'subtopic' },
            { id: 'as-2', title: 'How to Calculate Complexity?', type: 'subtopic' },
            { id: 'as-3', title: 'Algorithmic Complexity / Big-O / Big-θ / Big-Ω', type: 'subtopic' },
            { id: 'as-4', title: 'Common Runtimes: Constant / Logarithmic / Linear / Polynomial / Exponential / Factorial', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'algorithms-sec',
      title: 'Algorithms',
      type: 'section',
      children: [
        {
          id: 'search',
          title: 'Search Algorithms',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Linear Search', type: 'subtopic' },
            { id: 'se-2', title: 'Binary Search', type: 'subtopic' }
          ]
        },
        {
          id: 'sorting',
          title: 'Sorting Algorithms',
          type: 'topic',
          children: [
            { id: 'so-1', title: 'Bubble Sort / Insertion Sort / Selection Sort', type: 'subtopic' },
            { id: 'so-2', title: 'Heap Sort / Merge Sort / Quick Sort', type: 'subtopic' }
          ]
        },
        {
          id: 'path',
          title: 'Shortest Path Algorithms',
          type: 'topic',
          children: [
            { id: 'sp-1', title: "Dijkstra's Algorithm", type: 'subtopic' },
            { id: 'sp-2', title: 'Bellman-Ford Algoritm', type: 'subtopic' },
            { id: 'sp-3', title: 'A* Algorithm', type: 'subtopic' }
          ]
        },
        {
          id: 'mst',
          title: 'Minimum Spanning Tree',
          type: 'topic',
          children: [
            { id: 'ms-1', title: "Prim's Algorithm", type: 'subtopic' },
            { id: 'ms-2', title: "Kruskal's Algorithm", type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-structures-sec',
      title: 'Data Structures',
      type: 'section',
      children: [
        {
          id: 'graphs',
          title: 'Graph Data Structures',
          type: 'topic',
          children: [
            { id: 'gr-1', title: 'Directed Graph', type: 'subtopic' },
            { id: 'gr-2', title: 'Undirected Graph', type: 'subtopic' }
          ]
        },
        {
          id: 'trees',
          title: 'Tree Data Structures',
          type: 'topic',
          children: [
            { id: 'tr-1', title: 'Binary Trees / Binary Search Trees', type: 'subtopic' },
            { id: 'tr-2', title: 'AVL Trees / B-Trees / Heap / Trie', type: 'subtopic' },
            { id: 'tr-3', title: 'Segment Trees / Fenwick Trees', type: 'subtopic' }
          ]
        },
        {
          id: 'traversal',
          title: 'Tree Traversal',
          type: 'topic',
          children: [
            { id: 'tv-1', title: 'In-Order / Pre-Order / Post-Order Traversal', type: 'subtopic' },
            { id: 'tv-2', title: 'Breadth First Search / Depth First Search', type: 'subtopic' }
          ]
        },
        {
          id: 'adv-ds',
          title: 'Advanced Data Structures',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Disjoint Set (Union-Find)', type: 'subtopic' },
            { id: 'ad-2', title: 'Suffix Trees and Arrays', type: 'subtopic' },
            { id: 'ad-3', title: '2-3 Trees / B/B+ Trees / Skip List', type: 'subtopic' }
          ]
        },
        {
          id: 'complex-ds',
          title: 'Complex Data Structures',
          type: 'topic',
          children: [
            { id: 'cx-1', title: 'Indexing', type: 'subtopic' },
            { id: 'cx-2', title: 'ISAM', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'problem-solving-sec',
      title: 'Problem Solving',
      type: 'section',
      children: [
        {
          id: 'problem-solving',
          title: 'Problem Solving Techniques',
          type: 'topic',
          children: [
            { id: 'ps-1', title: 'Brute Force / Backtracking / Greedy Algorithms', type: 'subtopic' },
            { id: 'ps-2', title: 'Randomised Algorithms / Divide and Conquer', type: 'subtopic' },
            { id: 'ps-3', title: 'Recursion / Dynamic Programming', type: 'subtopic' },
            { id: 'ps-4', title: 'Two Pointer Technique / Sliding Window Technique', type: 'subtopic' },
            { id: 'ps-5', title: 'Island traversal / Multi-threaded / Two Heaps', type: 'subtopic' },
            { id: 'ps-6', title: 'Merge Intervals / Cyclic Sort / Fast and Slow Pointers', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'platforms-sec',
      title: 'Platforms to Practice',
      type: 'section',
      children: [
        {
          id: 'platforms',
          title: 'Platforms to Practice',
          type: 'topic',
          children: [
            { id: 'pl-1', title: 'Leetcode', type: 'subtopic' },
            { id: 'pl-2', title: 'Edabit', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Computer Science Roadmap', type: 'topic', link: { id: 'computer-science', title: 'Computer Science' } },
        { id: 'related-2', title: 'System Design Roadmap', type: 'topic', link: { id: 'system-design', title: 'System Design' } }
      ]
    }
  ]
};
export const devopsBeginnerRoadmap = {
  id: 'devops-beginner',
  title: 'DevOps Beginner',
  description: 'Beginner friendly version of the DevOps roadmap focusing on automation, infrastructure and monitoring',
  layout: 'linear',
  category: 'beginner',
  subscriberCount: '150,000',
  faq: {
    question: 'What is DevOps?',
    answer: 'DevOps is all about bringing developers and operations teams together to improve software delivery. The key focus areas are automation, infrastructure and monitoring.'
  },
  items: [
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals',
      type: 'section',
      children: [
        {
          id: 'language',
          title: 'Programming Language',
          type: 'topic',
          children: [
            { id: 'la-1', title: 'Pick any Programming Language: Python / Go / Ruby etc.', type: 'subtopic' },
            { id: 'la-2', title: 'Goal is to write automation scripts', type: 'subtopic' }
          ]
        },
        {
          id: 'os',
          title: 'Operating System',
          type: 'topic',
          children: [
            {
              id: 'linux',
              title: 'Linux',
              type: 'subgroup',
              children: [
                { id: 'lx-1', title: 'Pick Ubuntu if you have no experience', type: 'subtopic' },
                { id: 'lx-2', title: 'Learn file system, package managers, bash scripting', type: 'subtopic' },
                { id: 'lx-3', title: 'permissions, process monitoring', type: 'subtopic' }
              ]
            }
          ]
        },
        {
          id: 'networking',
          title: 'Networking & Protocols',
          type: 'topic',
          children: [
            { id: 'nw-1', title: 'Learn about DNS, TCP/IP Protocols, SSH', type: 'subtopic' },
            { id: 'nw-2', title: 'Ports, Gateways, Routing, IP Addressing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'infrastructure-tools-sec',
      title: 'Infrastructure & Tools',
      type: 'section',
      children: [
        {
          id: 'docker',
          title: 'Docker',
          type: 'topic',
          children: [
            { id: 'dk-1', title: 'Learn containerization', type: 'subtopic' },
            { id: 'dk-2', title: 'Writing dockerfiles / troubleshooting', type: 'subtopic' },
            { id: 'dk-3', title: 'Learn networking, storage, and security', type: 'subtopic' }
          ]
        },
        {
          id: 'git',
          title: 'Git / GitHub',
          type: 'topic',
          children: [
            { id: 'gt-1', title: 'Practice "git ops"', type: 'subtopic' },
            { id: 'gt-2', title: 'Learn about git, create GitHub profile', type: 'subtopic' }
          ]
        },
        {
          id: 'cloud',
          title: 'Cloud Provider',
          type: 'topic',
          children: [
            {
              id: 'aws',
              title: 'AWS (or others)',
              type: 'subgroup',
              children: [
                { id: 'aw-1', title: 'Pick AWS, GCP or Azure', type: 'subtopic' },
                { id: 'aw-2', title: 'Start with core services (VPC, EC2, S3, IAM)', type: 'subtopic' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'automation-cicd-sec',
      title: 'Automation & CI/CD',
      type: 'section',
      children: [
        {
          id: 'iac',
          title: 'Terraform',
          type: 'topic',
          children: [
            { id: 'ia-1', title: 'Learn what IaC means', type: 'subtopic' },
            { id: 'ia-2', title: 'Automate infrastructure creation', type: 'subtopic' }
          ]
        },
        {
          id: 'ansible',
          title: 'Ansible',
          type: 'topic',
          children: [
            { id: 'an-1', title: 'Learn configuration management', type: 'subtopic' },
            { id: 'an-2', title: 'Understand roles, playbooks, inventory', type: 'subtopic' },
            { id: 'an-3', title: 'Write some automation scripts', type: 'subtopic' }
          ]
        },
        {
          id: 'cicd',
          title: 'CI/CD (GitHub Actions)',
          type: 'topic',
          children: [
            { id: 'ci-1', title: 'Learn concepts of CI/CD', type: 'subtopic' },
            { id: 'ci-2', title: 'Integrate CI/CD into your app', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'web-servers-sec',
      title: 'Web Servers',
      type: 'section',
      children: [
        {
          id: 'nginx',
          title: 'Nginx',
          type: 'topic',
          children: [
            { id: 'ng-1', title: 'Web servings, reverse proxying, caching', type: 'subtopic' },
            { id: 'ng-2', title: 'Basic config options, TLS setup', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const devopsRoadmap = {
  id: 'devops',
  title: 'DevOps Engineer',
  description: 'Master the tools and processes that bridge development and operations',
  layout: 'linear',
  category: 'role',
  subscriberCount: '295,000',
  faq: {
    question: 'How does DevOps differ from DevOps Beginner?',
    answer: 'This roadmap covers advanced orchestration (Kubernetes), Infrastructure as Code (Terraform), and complex CI/CD pipelines, going beyond the basics.'
  },
  items: [
    {
      id: 'programming-language-sec',
      title: 'Programming Language',
      type: 'section',
      children: [
        {
          id: 'lang',
          title: 'Learn a Programming Language',
          type: 'topic',
          children: [
            { id: 'la-1', title: 'Python / Ruby / Go / Rust', type: 'subtopic' },
            { id: 'la-2', title: 'JavaScript / Node.js / Scripting', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'os-terminal-sec',
      title: 'OS & Terminal',
      type: 'section',
      children: [
        {
          id: 'os',
          title: 'Operating System',
          type: 'topic',
          children: [
            {
              id: 'linux',
              title: 'Linux',
              type: 'subgroup',
              children: [
                { id: 'lx-1', title: 'Ubuntu / Debian / RHEL / Derivatives / SUSE Linux', type: 'subtopic' },
                { id: 'lx-2', title: 'Windows / Unix / FreeBSD / OpenBSD / NetBSD', type: 'subtopic' }
              ]
            }
          ]
        },
        {
          id: 'terminal',
          title: 'Terminal Knowledge',
          type: 'topic',
          children: [
            { id: 'tk-1', title: 'Bash / Power Shell', type: 'subtopic' },
            { id: 'tk-2', title: 'Process Monitoring / Performance Monitoring', type: 'subtopic' },
            { id: 'tk-3', title: 'Networking Tools / Text Manipulation', type: 'subtopic' },
            { id: 'tk-4', title: 'Editors (Vim / Nano / Emacs)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'vcs-hosting-sec',
      title: 'VCS & Hosting',
      type: 'section',
      children: [
        {
          id: 'vcs',
          title: 'Version Control Systems',
          type: 'topic',
          children: [
            { id: 'vs-1', title: 'Git', type: 'subtopic' }
          ]
        },
        {
          id: 'vcs-hosting',
          title: 'VCS Hosting',
          type: 'topic',
          children: [
            { id: 'vh-1', title: 'GitHub / GitLab / Bitbucket', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'networking-webserver-sec',
      title: 'Networking & Web Server',
      type: 'section',
      children: [
        {
          id: 'networking',
          title: 'Networking & Protocols',
          type: 'topic',
          children: [
            { id: 'nw-1', title: 'DNS / HTTP / HTTPS / SSL / TLS / SSH / OSI Model', type: 'subtopic' },
            { id: 'nw-2', title: 'Email Protocols: SMTP / IMAP / POP3S', type: 'subtopic' },
            { id: 'nw-3', title: 'Domain Keys / DMARC / SPF / White / Grey Listing', type: 'subtopic' }
          ]
        },
        {
          id: 'webserver',
          title: 'Web Server',
          type: 'topic',
          children: [
            { id: 'ws-1', title: 'Nginx / Caddy / Apache / Tomcat / IIS', type: 'subtopic' },
            { id: 'ws-2', title: 'Forward Proxy / Reverse Proxy', type: 'subtopic' },
            { id: 'ws-3', title: 'Caching Server / Firewall / Load Balancer', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'cloud-serverless-sec',
      title: 'Cloud & Serverless',
      type: 'section',
      children: [
        {
          id: 'cloud',
          title: 'Cloud Providers',
          type: 'topic',
          children: [
            { id: 'cp-1', title: 'AWS / Azure / Google Cloud', type: 'subtopic' },
            { id: 'cp-2', title: 'Digital Ocean / Alibaba Cloud', type: 'subtopic' },
            { id: 'cp-3', title: 'Hetzner / Contabo / Heroku', type: 'subtopic' }
          ]
        },
        {
          id: 'serverless',
          title: 'Serverless',
          type: 'topic',
          children: [
            { id: 'sl-1', title: 'AWS Lambda / Azure Functions / GCP Functions', type: 'subtopic' },
            { id: 'sl-2', title: 'Cloudflare / Vercel / Netlify', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'infrastructure-as-code-sec',
      title: 'Infrastructure as Code',
      type: 'section',
      children: [
        {
          id: 'provision',
          title: 'Provisioning',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Terraform / Pulumi', type: 'subtopic' },
            { id: 'pr-2', title: 'AWS CDK / CloudFormation', type: 'subtopic' }
          ]
        },
        {
          id: 'config',
          title: 'Configuration Management',
          type: 'topic',
          children: [
            { id: 'cf-1', title: 'Ansible / Chef / Puppet', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'cicd-artifacts-sec',
      title: 'CI/CD & Artifacts',
      type: 'section',
      children: [
        {
          id: 'cicd',
          title: 'CI / CD Tools',
          type: 'topic',
          children: [
            { id: 'ci-1', title: 'GitLab CI / GitHub Actions', type: 'subtopic' },
            { id: 'ci-2', title: 'Jenkins / Circle CI', type: 'subtopic' },
            { id: 'ci-3', title: 'Team City / Octopus Deploy', type: 'subtopic' }
          ]
        },
        {
          id: 'secrets',
          title: 'Secret Management',
          type: 'topic',
          children: [
            { id: 'sm-1', title: 'Sealed Secrets / Vault / SOPs', type: 'subtopic' }
          ]
        },
        {
          id: 'artifacts',
          title: 'Artifact Management',
          type: 'topic',
          children: [
            { id: 'am-1', title: 'Artifactory / Nexus / Cloud Smith', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'containers-orchestration-sec',
      title: 'Containers & Orchestration',
      type: 'section',
      children: [
        {
          id: 'containers',
          title: 'Containers',
          type: 'topic',
          children: [
            { id: 'ct-1', title: 'Docker / LXC', type: 'subtopic' }
          ]
        },
        {
          id: 'orchestration',
          title: 'Container Orchestration',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Kubernetes / Docker Swarm', type: 'subtopic' },
            { id: 'co-2', title: 'AWS ECS / Fargate', type: 'subtopic' },
            { id: 'co-3', title: 'GKE / EKS / AKS', type: 'subtopic' }
          ]
        },
        {
          id: 'gitops',
          title: 'GitOps',
          type: 'topic',
          children: [
            { id: 'go-1', title: 'Argo CD / Flux CD', type: 'subtopic' }
          ]
        },
        {
          id: 'mesh',
          title: 'Service Mesh',
          type: 'topic',
          children: [
            { id: 'sm-1', title: 'Istio / Consul', type: 'subtopic' },
            { id: 'sm-2', title: 'Linkerd / Envoy', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'monitoring-logs-sec',
      title: 'Monitoring & Logs',
      type: 'section',
      children: [
        {
          id: 'app-mon',
          title: 'Application Monitoring',
          type: 'topic',
          children: [
            { id: 'am-1', title: 'Jaeger / New Relic', type: 'subtopic' },
            { id: 'am-2', title: 'Datadog / Prometheus / OpenTelemetry', type: 'subtopic' }
          ]
        },
        {
          id: 'infra-mon',
          title: 'Infrastructure Monitoring',
          type: 'topic',
          children: [
            { id: 'im-1', title: 'Prometheus / Grafana', type: 'subtopic' },
            { id: 'im-2', title: 'Zabbix / Datadog', type: 'subtopic' }
          ]
        },
        {
          id: 'logs',
          title: 'Logs Management',
          type: 'topic',
          children: [
            { id: 'lm-1', title: 'Papertrail / Splunk', type: 'subtopic' },
            { id: 'lm-2', title: 'Loki / Elastic Stack / Graylog', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'design-patterns-sec',
      title: 'Design Patterns',
      type: 'section',
      children: [
        {
          id: 'patterns',
          title: 'Cloud Design Patterns',
          type: 'topic',
          children: [
            { id: 'dp-1', title: 'Availability / Data Management', type: 'subtopic' },
            { id: 'dp-2', title: 'Design and Implementation', type: 'subtopic' },
            { id: 'dp-3', title: 'Management and Monitoring', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-2', title: 'Docker Roadmap', type: 'topic', link: { id: 'docker', title: 'Docker' } },
        { id: 'related-3', title: 'Kubernetes Roadmap', type: 'topic', link: { id: 'kubernetes', title: 'Kubernetes' } },
        { id: 'related-4', title: 'Linux Roadmap', type: 'topic', link: { id: 'linux', title: 'Linux' } }
      ]
    }
  ]
};
export const devrelRoadmap = {
  id: 'devrel',
  title: 'DevRel',
  description: 'Learn how to become a Developer Advocate and manage technical communities',
  layout: 'linear',
  category: 'role',
  subscriberCount: '15,000',
  faq: {
    question: 'What is DevRel?',
    answer: 'Developer Relations (DevRel) encompasses advocacy, education, community support, content creation, and developer marketing to build bridges between companies and developer communities.'
  },
  items: [
    {
      id: 'core-concepts-sec',
      title: 'Core Concepts',
      type: 'section',
      children: [
        {
          id: 'concepts',
          title: 'Key Concepts & Evolution',
          type: 'topic',
          children: [
            { id: 'cc-1', title: 'History and Evolution', type: 'subtopic' },
            { id: 'cc-2', title: 'Importance of DevRel', type: 'subtopic' },
            { id: 'cc-3', title: 'Developer Experience (DX)', type: 'subtopic' },
            { id: 'cc-4', title: 'Developer Journey / Feedback Loop', type: 'subtopic' },
            { id: 'cc-5', title: 'Developer Marketing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'basic-skills-sec',
      title: 'Basic Skills',
      type: 'section',
      children: [
        {
          id: 'prog',
          title: 'Basic Programming Skills',
          type: 'topic',
          children: [
            { id: 'bp-1', title: 'JavaScript / Node.js', type: 'subtopic' },
            { id: 'bp-2', title: 'Go / Rust / Python', type: 'subtopic' }
          ]
        },
        {
          id: 'comm',
          title: 'Communication Skills',
          type: 'topic',
          children: [
            { id: 'cm-1', title: 'Public Speaking / Presentation Techniques', type: 'subtopic' },
            { id: 'cm-2', title: 'Writing Skills / Rules of Three', type: 'subtopic' },
            { id: 'cm-3', title: 'PechaKucha / Storytelling', type: 'subtopic' },
            { id: 'cm-4', title: 'Visualization / Mind Mapping', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'documentation-sec',
      title: 'Technical Documentation',
      type: 'section',
      children: [
        {
          id: 'docs',
          title: 'Technical Documentation',
          type: 'topic',
          children: [
            { id: 'td-1', title: 'Blog Posts / Technical Skills', type: 'subtopic' },
            { id: 'td-2', title: 'IDEs (JetBrains, VS Code)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'engagement-building-sec',
      title: 'Engagement & Building',
      type: 'section',
      children: [
        {
          id: 'engage',
          title: 'Community Engagement',
          type: 'topic',
          children: [
            { id: 'ce-1', title: 'Networking / Online Communities', type: 'subtopic' },
            { id: 'ce-2', title: 'Event Participation', type: 'subtopic' },
            { id: 'ce-3', title: 'Managing Discussions', type: 'subtopic' },
            { id: 'ce-4', title: 'Issues & Pull Requests', type: 'subtopic' },
            { id: 'ce-5', title: 'Labelling and Cleanup', type: 'subtopic' },
            { id: 'ce-6', title: 'Milestones & Releases / Public Backlog', type: 'subtopic' }
          ]
        },
        {
          id: 'build',
          title: 'Community Building',
          type: 'topic',
          children: [
            { id: 'cb-1', title: 'Identifying Audience / Platform Selection', type: 'subtopic' },
            { id: 'cb-2', title: 'Initial Outreach / Community Guidelines', type: 'subtopic' },
            { id: 'cb-3', title: 'Code of Conduct / Rules and Policies', type: 'subtopic' },
            { id: 'cb-4', title: 'Promotion / Collaborations / Cross-Promotion', type: 'subtopic' },
            { id: 'cb-5', title: 'Guest Blogging / Event Management', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'apis-sdks-sec',
      title: 'APIs & SDKs',
      type: 'section',
      children: [
        {
          id: 'apis',
          title: 'APIs & SDKs',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Understanding APIs', type: 'subtopic' },
            { id: 'as-2', title: 'Building SDKs', type: 'subtopic' },
            { id: 'as-3', title: 'API Design', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'public-speaking-sec',
      title: 'Public Speaking',
      type: 'section',
      children: [
        { id: 'speaking', title: 'Public Speaking', type: 'topic' },
        {
          id: 'sp-aud',
          title: 'Engaging Audience',
          type: 'topic',
          children: [
            { id: 'ea-1', title: 'The Hook / Contrast Principle', type: 'subtopic' },
            { id: 'ea-2', title: 'Handouts', type: 'subtopic' },
            { id: 'ea-3', title: 'Repetition & Reinforcement', type: 'subtopic' }
          ]
        },
        {
          id: 'sp-qa',
          title: 'Handling Q&A',
          type: 'topic',
          children: [
            { id: 'hq-1', title: 'Active Listening', type: 'subtopic' },
            { id: 'hq-2', title: 'Anticipate Questions', type: 'subtopic' },
            { id: 'hq-3', title: 'Be Concise', type: 'subtopic' },
            { id: 'hq-4', title: 'Managing Difficult Questions', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'content-creation-sec',
      title: 'Content Creation',
      type: 'section',
      children: [
        {
          id: 'creation',
          title: 'Content Creation',
          type: 'topic',
          children: [
            { id: 'cc-1', title: 'Blogging / Live Streaming', type: 'subtopic' },
            { id: 'cc-2', title: 'Video Production (YouTube, Twitch/Streamyard)', type: 'subtopic' },
            { id: 'cc-3', title: 'Technical Setup (Video/Audio, Animations & Graphics)', type: 'subtopic' },
            { id: 'cc-4', title: 'Recording / Editing', type: 'subtopic' },
            { id: 'cc-5', title: 'SEO Basics / Writing Process / Topic Selection', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'developer-onboarding-sec',
      title: 'Developer Onboarding',
      type: 'section',
      children: [
        {
          id: 'onboard',
          title: 'Developer Onboarding',
          type: 'topic',
          children: [
            { id: 'do-1', title: 'Tutorials / API References', type: 'subtopic' },
            { id: 'do-2', title: 'User Guides / Code Samples', type: 'subtopic' },
            { id: 'do-3', title: 'Example Apps / Use Case Based', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'social-media-support-sec',
      title: 'Social Media & Support',
      type: 'section',
      children: [
        {
          id: 'social',
          title: 'Social Media',
          type: 'topic',
          children: [
            { id: 'sm-1', title: 'Facebook / Instagram / X / LinkedIn', type: 'subtopic' },
            { id: 'sm-2', title: 'Consistent Posting / Engaging Content', type: 'subtopic' },
            { id: 'sm-3', title: 'Content Strategy / Analytics and Optimization', type: 'subtopic' }
          ]
        },
        {
          id: 'support',
          title: 'Support',
          type: 'topic',
          children: [
            { id: 'su-1', title: 'Forums / Issue Tracking', type: 'subtopic' },
            { id: 'su-2', title: 'FAQs / Office Hours', type: 'subtopic' },
            { id: 'su-3', title: 'Webinars / Live Support', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'metrics-career-sec',
      title: 'Metrics & Career',
      type: 'section',
      children: [
        {
          id: 'metrics',
          title: 'Metrics & Analytics',
          type: 'topic',
          children: [
            { id: 'ma-1', title: 'Tracking Engagement / Data-Driven Strategy Shift', type: 'subtopic' },
            { id: 'ma-2', title: 'Platform Specific Analytics / Social Media Analytics', type: 'subtopic' },
            { id: 'ma-3', title: 'Google Analytics / Key Metrics', type: 'subtopic' },
            { id: 'ma-4', title: 'Reporting / Regular Reports', type: 'subtopic' },
            { id: 'ma-5', title: 'Data Visualization / Insights & Recommendations', type: 'subtopic' }
          ]
        },
        {
          id: 'career',
          title: 'Career Development',
          type: 'topic',
          children: [
            { id: 'cd-1', title: 'Thought Leadership / Publishing', type: 'subtopic' },
            { id: 'cd-2', title: 'Media Appearances / Meetups', type: 'subtopic' },
            { id: 'cd-3', title: 'Building a Personal Brand / Conference Speaking', type: 'subtopic' },
            { id: 'cd-4', title: 'Networking Strategies / Continuous Learning', type: 'subtopic' },
            { id: 'cd-5', title: 'Open-Source / Online Communities', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Engineering Manager Roadmap', type: 'topic', link: { id: 'engineering-manager', title: 'Engineering Manager' } },
        { id: 'related-2', title: 'Product Manager Roadmap', type: 'topic', link: { id: 'product-manager', title: 'Product Manager' } }
      ]
    }
  ]
};
export const devsecopsRoadmap = {
  id: 'devsecops',
  title: 'DevSecOps',
  description: 'Integrate security practices into the DevOps process',
  layout: 'linear',
  category: 'role',
  subscriberCount: '78,000',
  faq: {
    question: 'What is DevSecOps?',
    answer: 'DevSecOps shifts security left, meaning security checks (SAST, DAST, SCA) are integrated directly into the CI/CD pipeline rather than tested at the end.'
  },
  items: [
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals',
      type: 'section',
      children: [
        {
          id: 'prog',
          title: 'Learn a Programming Language',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Ruby / Python / Rust / Go', type: 'subtopic' },
            { id: 'pr-2', title: 'Bash / JavaScript / Node.js', type: 'subtopic' },
            { id: 'pr-3', title: 'PowerShell', type: 'subtopic' }
          ]
        },
        {
          id: 'found',
          title: 'Learn the Foundations',
          type: 'topic',
          children: [
            { id: 'fd-1', title: 'DevSecOps vs DevOps / Scripting Knowledge', type: 'subtopic' },
            { id: 'fd-2', title: 'Editors (Vim / Nano / Emacs)', type: 'subtopic' },
            { id: 'fd-3', title: 'CIA Triad / Authentication / Authorization', type: 'subtopic' },
            { id: 'fd-4', title: 'OWASP Top 10', type: 'subtopic' }
          ]
        },
        {
          id: 'net',
          title: 'Networking Basics',
          type: 'topic',
          children: [
            { id: 'nt-1', title: 'Firewalls / VLANs / ACLs', type: 'subtopic' },
            { id: 'nt-2', title: 'Network Segmentation', type: 'subtopic' },
            { id: 'nt-3', title: 'DNS / HTTP / TLS', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-security-sec',
      title: 'Core Security',
      type: 'section',
      children: [
        {
          id: 'coding',
          title: 'Secure Coding',
          type: 'topic',
          children: [
            { id: 'sc-1', title: 'SQL Injection Prevention', type: 'subtopic' },
            { id: 'sc-2', title: 'XSS Prevention', type: 'subtopic' },
            { id: 'sc-3', title: 'Input Validation Patterns', type: 'subtopic' }
          ]
        },
        {
          id: 'id',
          title: 'Identity Basics',
          type: 'topic',
          children: [
            { id: 'id-1', title: 'IAM / Least Privilege', type: 'subtopic' },
            { id: 'id-2', title: 'Role Based Access', type: 'subtopic' }
          ]
        },
        {
          id: 'threat',
          title: 'Threat Modeling',
          type: 'topic',
          children: [
            { id: 'tm-1', title: 'STRIDE / PASTA', type: 'subtopic' },
            { id: 'tm-2', title: 'Threat Modeling Workflows', type: 'subtopic' },
            { id: 'tm-3', title: 'Attack Surface Mapping', type: 'subtopic' }
          ]
        },
        {
          id: 'cont',
          title: 'Container Security',
          type: 'topic',
          children: [
            { id: 'cs-1', title: 'Docker / Kubernetes', type: 'subtopic' },
            { id: 'cs-2', title: 'Image Scanning', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tools-operations-sec',
      title: 'Tools & Operations',
      type: 'section',
      children: [
        {
          id: 'tools',
          title: 'DevSecOps Tools',
          type: 'topic',
          children: [
            { id: 'tl-1', title: 'Burp Suite / Nmap / Wireshark', type: 'subtopic' },
            { id: 'tl-2', title: 'SIEM / Log Analysis / Nessus', type: 'subtopic' },
            { id: 'tl-3', title: 'IAM / CSPM', type: 'subtopic' },
            { id: 'tl-4', title: 'Vulnerability Scanning (OpenVAS, Qualys)', type: 'subtopic' }
          ]
        },
        {
          id: 'manage',
          title: 'Managing Threats & Risks',
          type: 'topic',
          children: [
            { id: 'mt-1', title: 'Automated Patching', type: 'subtopic' },
            { id: 'mt-2', title: 'SOAR Concepts', type: 'subtopic' },
            { id: 'mt-3', title: 'Automating Security', type: 'subtopic' }
          ]
        },
        {
          id: 'cloud',
          title: 'Cloud Security',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Key Management Service', type: 'subtopic' },
            { id: 'cl-2', title: 'Zero Trust Concepts', type: 'subtopic' },
            { id: 'cl-3', title: 'Defense in Depth Concepts', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-security-sec',
      title: 'Advanced Security',
      type: 'section',
      children: [
        {
          id: 'crypto',
          title: 'Cryptographic Hashing',
          type: 'topic',
          children: [
            { id: 'cr-1', title: 'SHA 256 / bcrypt', type: 'subtopic' },
            { id: 'cr-2', title: 'Symmetric / Asymmetric', type: 'subtopic' },
            { id: 'cr-3', title: 'Advanced Crypto / PKI Design and Failover', type: 'subtopic' },
            { id: 'cr-4', title: 'Certificate Lifecycle', type: 'subtopic' }
          ]
        },
        {
          id: 'arch',
          title: 'Secure Architecture',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Secure API Design', type: 'subtopic' },
            { id: 'ar-2', title: 'Multi Region Security Planning', type: 'subtopic' },
            { id: 'ar-3', title: 'DDoS Mitigation Strategy', type: 'subtopic' },
            { id: 'ar-4', title: 'Secure Network Zoning', type: 'subtopic' }
          ]
        },
        {
          id: 'ir',
          title: 'Incident Response',
          type: 'topic',
          children: [
            { id: 'ir-1', title: 'IR Lifecycle / Response Strategy', type: 'subtopic' },
            { id: 'ir-2', title: 'Forensics Containment / Root Cause Analysis', type: 'subtopic' },
            { id: 'ir-3', title: 'EDR Strategy / SOAR Automation', type: 'subtopic' },
            { id: 'ir-4', title: 'Endpoint Detection', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'enterprise-governance-sec',
      title: 'Enterprise & Governance',
      type: 'section',
      children: [
        {
          id: 'scs',
          title: 'Supply Chain Security',
          type: 'topic',
          children: [
            { id: 'sc-1', title: 'Dependency Risk Management', type: 'subtopic' },
            { id: 'sc-2', title: 'SBOMs', type: 'subtopic' }
          ]
        },
        {
          id: 'ops',
          title: 'Enterprise Operations',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Build Pipeline Hardening', type: 'subtopic' }
          ]
        },
        {
          id: 'gov',
          title: 'Governance',
          type: 'topic',
          children: [
            { id: 'gv-1', title: 'Risk Quantification', type: 'subtopic' },
            { id: 'gv-2', title: 'SOC 2 / ISO 27001', type: 'subtopic' },
            { id: 'gv-3', title: 'Audit & Compliance Mapping', type: 'subtopic' },
            { id: 'gv-4', title: 'Cybersecurity Frameworks (NIST)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Cyber Security Roadmap', type: 'topic', link: { id: 'cyber-security', title: 'Cyber Security' } },
        { id: 'related-2', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } }
      ]
    }
  ]
};
export const djangoRoadmap = {
  id: 'django',
  title: 'Django',
  description: 'Master the Django web framework for Python',
  layout: 'linear',
  category: 'skill',
  subscriberCount: '145,000',
  faq: {
    question: 'Why Django?',
    answer: 'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. "The framework for perfectionists with deadlines."'
  },
  items: [
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals & Setup',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Virtual envs / Installing Django', type: 'subtopic' },
            { id: 'in-2', title: 'How the Web Works', type: 'subtopic' },
            { id: 'in-3', title: 'Why use web frameworks', type: 'subtopic' },
            { id: 'in-4', title: 'The MVC Model', type: 'subtopic' }
          ]
        },
        {
          id: 'project',
          title: 'Your First Project',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Projects & Apps / Running your Project', type: 'subtopic' },
            { id: 'pr-2', title: 'Project Structure (manage.py, settings.py, urls.py)', type: 'subtopic' },
            { id: 'pr-3', title: 'App Structure (models.py, views.py, tests.py, admin.py)', type: 'subtopic' },
            { id: 'pr-4', title: 'Migrations / Other Files (static, media, templates)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-concepts-sec',
      title: 'Core Concepts',
      type: 'section',
      children: [
        {
          id: 'routing',
          title: 'Routing',
          type: 'topic',
          children: [
            { id: 'rt-1', title: 'Routing Fundamentals / URL patterns', type: 'subtopic' },
            { id: 'rt-2', title: 'Path converters / Grouping URLs / Regex Paths', type: 'subtopic' },
            { id: 'rt-3', title: 'Request Response Flow / Named URLs', type: 'subtopic' },
            { id: 'rt-4', title: 'Reverse URL / Routing Middleware', type: 'subtopic' }
          ]
        },
        {
          id: 'views',
          title: 'Views',
          type: 'topic',
          children: [
            { id: 'vi-1', title: 'Function-based views / Class-based views', type: 'subtopic' },
            { id: 'vi-2', title: 'Customizing Views / Rendering Templates', type: 'subtopic' },
            { id: 'vi-3', title: 'Generic views (ListView, DetailView, CreateView, UpdateView, DeleteView)', type: 'subtopic' }
          ]
        },
        {
          id: 'templates',
          title: 'Templates',
          type: 'topic',
          children: [
            { id: 'tp-1', title: 'DTL Syntax / Variables', type: 'subtopic' },
            { id: 'tp-2', title: 'Filters & custom filters', type: 'subtopic' },
            { id: 'tp-3', title: 'Tags & custom tags (for, if)', type: 'subtopic' },
            { id: 'tp-4', title: 'Comments / Template Inheritance', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-management-sec',
      title: 'Data Management',
      type: 'section',
      children: [
        {
          id: 'models',
          title: 'Models, Databases & ORM',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Models (Fields, types, options, custom)', type: 'subtopic' },
            { id: 'mo-2', title: 'Model relationships & methods & inheritance', type: 'subtopic' },
            { id: 'mo-3', title: 'Supported DBs (SQLite, PostgreSQL, MySQL, MariaDB)', type: 'subtopic' },
            { id: 'mo-4', title: 'Setting up the Database / Migrations', type: 'subtopic' },
            { id: 'mo-5', title: 'Django ORM (Querying data, CRUD, Aggregations)', type: 'subtopic' },
            { id: 'mo-6', title: 'Filtering & lookups / Raw SQL / Query Optimization', type: 'subtopic' }
          ]
        },
        {
          id: 'forms',
          title: 'Django Forms',
          type: 'topic',
          children: [
            { id: 'fm-1', title: 'Model Forms / Form Validation', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'middle-components-sec',
      title: 'Middle Components',
      type: 'section',
      children: [
        { id: 'msg', title: 'Message Framework', type: 'topic' },
        { id: 'shell', title: 'Django Shell', type: 'topic' },
        {
          id: 'admin',
          title: 'Django Admin',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Admin Customization', type: 'subtopic' }
          ]
        },
        { id: 'middleware', title: 'Middleware', type: 'topic' }
      ]
    },
    {
      id: 'advanced-features-sec',
      title: 'Advanced Features',
      type: 'section',
      children: [
        {
          id: 'users',
          title: 'Users & Permissions',
          type: 'topic',
          children: [
            { id: 'us-1', title: 'Authentication (Built-in user model, Custom user model)', type: 'subtopic' },
            { id: 'us-2', title: 'Authorization (Protecting views)', type: 'subtopic' },
            { id: 'us-3', title: 'django-allauth', type: 'subtopic' }
          ]
        },
        {
          id: 'api',
          title: 'API Development',
          type: 'topic',
          children: [
            { id: 'ap-1', title: 'Django REST Framework', type: 'subtopic' },
            { id: 'ap-2', title: 'Serializers / Views & ViewSets / Routers', type: 'subtopic' }
          ]
        },
        {
          id: 'testing',
          title: 'Logging, Debugging & Testing',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Logging framework (Loggers, Handlers, Filters, Formatters)', type: 'subtopic' },
            { id: 'te-2', title: 'Debugging (Error Pages, debug_toolbar, PDB/IPDB, django_silk)', type: 'subtopic' },
            { id: 'te-3', title: 'Django Test Framework (pytest, unittest & TestCase)', type: 'subtopic' }
          ]
        },
        {
          id: 'advanced',
          title: 'Advanced Topics',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Caching / Asynchronous Django', type: 'subtopic' },
            { id: 'ad-2', title: 'Background Tasks / Localization / Signals', type: 'subtopic' }
          ]
        },
        {
          id: 'deploy',
          title: 'Deployment',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'Production Checklist / Validation', type: 'subtopic' },
            { id: 'de-2', title: 'Static Files / Whitenoise', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Python Roadmap', type: 'topic', link: { id: 'python', title: 'Python' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const dockerRoadmap = {
  id: 'docker',
  title: 'Docker',
  description: 'Docker Beginner to Pro',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '190,000',
  faq: {
    question: 'Why learn Docker?',
    answer: 'Docker eliminates the "it works on my machine" problem by packaging applications with all their dependencies into a standardized unit for software development.'
  },
  items: [
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What are Containers?', type: 'subtopic' },
            { id: 'in-2', title: 'Why do we need Containers?', type: 'subtopic' },
            { id: 'in-3', title: 'Bare Metal vs VMs vs Containers', type: 'subtopic' },
            { id: 'in-4', title: 'Docker and OCI', type: 'subtopic' }
          ]
        },
        {
          id: 'linux',
          title: 'Linux Fundamentals',
          type: 'topic',
          children: [
            { id: 'lx-1', title: 'Package Managers', type: 'subtopic' },
            { id: 'lx-2', title: 'Users / Groups Permissions', type: 'subtopic' },
            { id: 'lx-3', title: 'Shell Commands / Shell Scripting', type: 'subtopic' },
            { id: 'lx-4', title: 'Underlying Technologies (Namespaces, cgroups, Union Filesystems)', type: 'subtopic' }
          ]
        },
        {
          id: 'prereq',
          title: 'Prerequisites',
          type: 'topic',
          children: [
            { id: 'pq-1', title: 'Programming Languages / Application Architecture', type: 'subtopic' },
            { id: 'pq-2', title: 'Web Development / Databases', type: 'subtopic' },
            { id: 'pq-3', title: 'Command Line Utilities', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-docker-sec',
      title: 'Core Docker Concepts',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Basics of Docker',
          type: 'topic',
          children: [
            { id: 'bs-1', title: 'Installation / Setup (Docker Desktop, Docker Engine)', type: 'subtopic' },
            { id: 'bs-2', title: 'Using 3rd Party Container Images', type: 'subtopic' }
          ]
        },
        {
          id: 'running',
          title: 'Running Containers',
          type: 'topic',
          children: [
            { id: 'rc-1', title: 'docker run', type: 'subtopic' }
          ]
        },
        {
          id: 'data',
          title: 'Data Persistence',
          type: 'topic',
          children: [
            { id: 'dp-1', title: 'Ephemeral Container Filesystem', type: 'subtopic' },
            { id: 'dp-2', title: 'Volume Mounts / Bind Mounts', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'building-images-sec',
      title: 'Building & Security',
      type: 'section',
      children: [
        {
          id: 'build',
          title: 'Building Container Images',
          type: 'topic',
          children: [
            { id: 'bc-1', title: 'Dockerfiles', type: 'subtopic' },
            { id: 'bc-2', title: 'Efficient Layer Caching', type: 'subtopic' },
            { id: 'bc-3', title: 'Image Size and Security', type: 'subtopic' },
            { id: 'bc-4', title: 'Image Tagging Best Practices', type: 'subtopic' }
          ]
        },
        {
          id: 'sec',
          title: 'Image Security',
          type: 'topic',
          children: [
            { id: 'is-1', title: 'Runtime Security', type: 'subtopic' },
            { id: 'is-2', title: 'Container Security', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'workflow-deployment-sec',
      title: 'Workflow & Deployment',
      type: 'section',
      children: [
        {
          id: 'reg',
          title: 'Container Registries',
          type: 'topic',
          children: [
            { id: 'cr-1', title: 'Dockerhub', type: 'subtopic' },
            { id: 'cr-2', title: 'Others (ghcr, ecr, gcr, acr, etc)', type: 'subtopic' }
          ]
        },
        {
          id: 'dx',
          title: 'Developer Experience',
          type: 'topic',
          children: [
            { id: 'dx-1', title: 'docker compose / Hot Reloading', type: 'subtopic' },
            { id: 'dx-2', title: 'Debuggers / Tests / Continuous Integration', type: 'subtopic' }
          ]
        },
        {
          id: 'deploy',
          title: 'Deploying Containers',
          type: 'topic',
          children: [
            { id: 'dc-1', title: 'Runtime Configuration Options / PaaS Options', type: 'subtopic' },
            { id: 'dc-2', title: 'Docker Swarm / Nomad / Kubernetes', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Kubernetes Roadmap', type: 'topic', link: { id: 'kubernetes', title: 'Kubernetes' } },
        { id: 'related-2', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const elasticsearchRoadmap = {
  id: 'elasticsearch',
  title: 'Elasticsearch',
  description: 'Master full-text search and analytics with Elasticsearch',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '58,000',
  faq: {
    question: 'What is Elasticsearch used for?',
    answer: 'Elasticsearch is a distributed, RESTful search and analytics engine capable of addressing a growing number of use cases like log analytics, full-text search, and operational intelligence.'
  },
  items: [
    {
      id: 'fundamentals-setup-sec',
      title: 'Fundamentals & Setup',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is Elasticsearch', type: 'subtopic' },
            { id: 'in-2', title: 'Search Engines vs Relational DBs', type: 'subtopic' },
            { id: 'in-3', title: 'Elasticsearch Usecases', type: 'subtopic' },
            { id: 'in-4', title: 'The ELK Stack', type: 'subtopic' }
          ]
        },
        {
          id: 'setup',
          title: 'Environment Setup',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Running with Docker', type: 'subtopic' },
            { id: 'se-2', title: 'Elastic Cloud / Kibana Console', type: 'subtopic' }
          ]
        },
        {
          id: 'arch',
          title: 'Core Architecture',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Logical (Cluster, Node, Index, Document, ID)', type: 'subtopic' },
            { id: 'ar-2', title: 'Physical Layout / Split Brain Problem', type: 'subtopic' },
            { id: 'ar-3', title: 'Master-Elegible / Data / Coordinating Nodes', type: 'subtopic' },
            { id: 'ar-4', title: 'Sharding & Scaling (Primary & Replica)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-management-sec',
      title: 'Data Management',
      type: 'section',
      children: [
        {
          id: 'model',
          title: 'Data Modelling & Types',
          type: 'topic',
          children: [
            { id: 'dm-1', title: 'Explicit vs Dynamic / Mapping Explosion', type: 'subtopic' },
            { id: 'dm-2', title: 'Core Types (Numeric, Boolean, Dates, Geo)', type: 'subtopic' },
            { id: 'dm-3', title: 'Text vs Keyword / Object, Nested, Flattened', type: 'subtopic' }
          ]
        },
        {
          id: 'crud',
          title: 'Data CRUD Operations',
          type: 'topic',
          children: [
            { id: 'cr-1', title: 'Ingestion (Index/Update/Delete docs & indices)', type: 'subtopic' },
            { id: 'cr-2', title: 'Bulk Operations & Optimizing', type: 'subtopic' },
            { id: 'cr-3', title: 'Migrations & Repair (Update/Delete by Query)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'search-querying-sec',
      title: 'Search & Querying',
      type: 'section',
      children: [
        {
          id: 'lang',
          title: 'Query Languages',
          type: 'topic',
          children: [
            { id: 'ql-1', title: 'Query DSL / ES|QL / EQL / SQL / Lucene', type: 'subtopic' }
          ]
        },
        {
          id: 'search',
          title: 'Search Fundamentals',
          type: 'topic',
          children: [
            { id: 'sf-1', title: 'Search Contexts (Query, Filter)', type: 'subtopic' },
            { id: 'sf-2', title: 'Leaf vs Compound Queries', type: 'subtopic' },
            { id: 'sf-3', title: 'Match, Term, Range, Exists, Prefix, Wildcard', type: 'subtopic' },
            { id: 'sf-4', title: 'Bool Queries (must, should, filter, must_not)', type: 'subtopic' }
          ]
        },
        {
          id: 'control',
          title: 'Results & Text Analysis',
          type: 'topic',
          children: [
            { id: 'rt-1', title: 'Pagination, Sorting, Filtering, Highlighting', type: 'subtopic' },
            { id: 'rt-2', title: 'How Search Works (Inverted Index)', type: 'subtopic' },
            { id: 'rt-3', title: 'Search Analyzer / Analyze API', type: 'subtopic' },
            { id: 'rt-4', title: 'Standard & Custom Analyzers', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-features-sec',
      title: 'Advanced Features',
      type: 'section',
      children: [
        {
          id: 'aggs',
          title: 'Aggregations',
          type: 'topic',
          children: [
            { id: 'ag-1', title: 'Metric Aggregations (Avg, Sum, Min, Max, Count)', type: 'subtopic' },
            { id: 'ag-2', title: 'Bucket Aggs (Terms, Range, Histogram)', type: 'subtopic' },
            { id: 'ag-3', title: 'Filter / Advanced Aggregations (Pipeline, Nested)', type: 'subtopic' }
          ]
        },
        {
          id: 'scoring',
          title: 'Scoring & Relevance',
          type: 'topic',
          children: [
            { id: 'sr-1', title: 'Understanding Similarity / BM25 algorithm', type: 'subtopic' },
            { id: 'sr-2', title: 'Improve Precision / Boosting / Function Score', type: 'subtopic' },
            { id: 'sr-3', title: 'Match Phrase / Synonyms Graph', type: 'subtopic' }
          ]
        },
        {
          id: 'admin',
          title: 'Admin, Ops & Advanced',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Transformations (Pivot, Latest)', type: 'subtopic' },
            { id: 'ad-2', title: 'Cluster Mgmt (CAT API, Merging, Monitoring)', type: 'subtopic' },
            { id: 'ad-3', title: 'Data Life Cycle (ILM, Tiers)', type: 'subtopic' },
            { id: 'ad-4', title: 'Security & Data Safety (Snapshots, SLM, Auth)', type: 'subtopic' },
            { id: 'ad-5', title: 'AI-Powered (Vector, Semantic, Hybrid Search)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Data Engineer Roadmap', type: 'topic', link: { id: 'data-engineer', title: 'Data Engineer' } },
        { id: 'related-2', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } }
      ]
    }
  ]
};
export const engineeringManagerRoadmap = {
  id: 'engineering-manager',
  title: 'Engineering Manager',
  description: 'Guide to transitioning from IC (Individual Contributor) to Engineering Manager',
  layout: 'linear',
  category: 'role',
  subscriberCount: '120,000',
  faq: {
    question: 'What does an Engineering Manager do?',
    answer: 'An Engineering Manager focuses on team health, career growth of engineers, delivery processes, and aligning technical work with business goals, rather than writing code daily.'
  },
  items: [
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals & Focus',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is EM? (People, Product, Process)', type: 'subtopic' },
            { id: 'in-2', title: 'EM vs Tech Lead vs IC', type: 'subtopic' }
          ]
        },
        {
          id: 'focus',
          title: 'Key Focus Areas',
          type: 'topic',
          children: [
            { id: 'fo-1', title: 'Quality and Process / Incident Management', type: 'subtopic' },
            { id: 'fo-2', title: 'System Monitoring & Performance / CI/CD', type: 'subtopic' },
            { id: 'fo-3', title: 'Dev & Release Workflow / Testing Strategies', type: 'subtopic' },
            { id: 'fo-4', title: 'Tech Standards / Security / Legacy Retirement', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'leadership-management-sec',
      title: 'Leadership & Management',
      type: 'section',
      children: [
        {
          id: 'tech-lead',
          title: 'Technical Leadership',
          type: 'topic',
          children: [
            { id: 'tl-1', title: 'Foundational (SE Background, System Design, Tech Debt)', type: 'subtopic' },
            { id: 'tl-2', title: 'Tech Strategy & Roadmapping / Arch Decisions', type: 'subtopic' },
            { id: 'tl-3', title: 'Build vs Buy / Risk Assessment / Scaling', type: 'subtopic' },
            { id: 'tl-4', title: 'Code Review Best Practices / Documentation', type: 'subtopic' }
          ]
        },
        {
          id: 'people',
          title: 'People Management',
          type: 'topic',
          children: [
            { id: 'pe-1', title: 'Leadership Skills (Hiring, Team Structure, Performance, Career Dev, Mentoring) / Delegation / Conflict', type: 'subtopic' },
            { id: 'pe-2', title: 'Feedback / Motivation / Trust / EQ', type: 'subtopic' },
            { id: 'pe-3', title: 'Communication (1:1s, Team Meetings, Status, Stakeholder Mgmt, Cross-functional)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'execution-business-sec',
      title: 'Execution & Business',
      type: 'section',
      children: [
        {
          id: 'exec',
          title: 'Execution',
          type: 'topic',
          children: [
            { id: 'ex-1', title: 'Project Planning (Agile, Tracking, Milestones, Scope, Time)', type: 'subtopic' },
            { id: 'ex-2', title: 'Resource Allocation / Sprint Planning', type: 'subtopic' },
            { id: 'ex-3', title: 'Release Mgmt / Risk Mgmt / Dependency Mgmt', type: 'subtopic' }
          ]
        },
        {
          id: 'measure',
          title: 'Measurement',
          type: 'topic',
          children: [
            { id: 'me-1', title: 'Business Acumen (Strategy alignment, Business Case, KPIs, Velocity, Quality, Team Health, Postmortems, Cost)', type: 'subtopic' },
            { id: 'me-2', title: 'ROI analysis / Market awareness / Competitors', type: 'subtopic' },
            { id: 'me-3', title: 'Budget Planning / Resource forecasting / Vendor Mgmt', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'culture-stakeholders-sec',
      title: 'Culture & Stakeholders',
      type: 'section',
      children: [
        {
          id: 'culture',
          title: 'Culture Building',
          type: 'topic',
          children: [
            { id: 'cu-1', title: 'Team Culture (Values, Eng Culture, Rituals, Learning, Bias)', type: 'subtopic' },
            { id: 'cu-2', title: 'Company Culture (Change, Org structure, Politics, Cross-dept, Inclusion, Innovation)', type: 'subtopic' },
            { id: 'cu-3', title: 'Knowledge sharing / Tech excellence / Blameless Post-mortems', type: 'subtopic' }
          ]
        },
        {
          id: 'crisis',
          title: 'Crisis Management',
          type: 'topic',
          children: [
            { id: 'cr-1', title: 'Risk Mitigation (Contingency, Disaster, Continuity, Sec)', type: 'subtopic' },
            { id: 'cr-2', title: 'Incident Response (Protocols, War Room, Recovery)', type: 'subtopic' }
          ]
        },
        {
          id: 'stake',
          title: 'Stakeholder Management',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Partner Mgmt (Vendors, Tech, Integrations, API, Ext)', type: 'subtopic' },
            { id: 'st-2', title: 'Customer Relations (Feedback, Support, Success, Features)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'knowledge-change-sec',
      title: 'Knowledge & Change',
      type: 'section',
      children: [
        {
          id: 'knowledge',
          title: 'Knowledge & Change',
          type: 'topic',
          children: [
            { id: 'kn-1', title: 'Documentation (Arch, Process, Decisions, Best Practices)', type: 'subtopic' },
            { id: 'kn-2', title: 'Executive Communication (Board, Proposals, Budgets)', type: 'subtopic' },
            { id: 'kn-3', title: 'Knowledge Transfer (Mentoring, Tech Talks)', type: 'subtopic' },
            { id: 'kn-4', title: 'Change Mgmt (Tech Change, Org Change, Team Change)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Software Architect Roadmap', type: 'topic', link: { id: 'software-architect', title: 'Software Architect' } },
        { id: 'related-2', title: 'System Design Roadmap', type: 'topic', link: { id: 'system-design', title: 'System Design' } }
      ]
    }
  ]
};
export const flutterRoadmap = {
  id: 'flutter',
  title: 'Flutter',
  description: 'Learn Flutter for cross-platform app development',
  layout: 'linear',
  category: 'framework',
  subscriberCount: '210,000',
  faq: {
    question: 'Why learn Flutter?',
    answer: 'Flutter is Google\'s UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.'
  },
  items: [
    {
      id: 'dart-basics-sec',
      title: 'Dart Basics & Setup',
      type: 'section',
      children: [
        {
          id: 'dart-basics',
          title: 'Basics of Dart',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'Dart Pad / Variables / Built-in Types', type: 'subtopic' },
            { id: 'db-2', title: 'Functions / Operators / Control Flow Statements', type: 'subtopic' }
          ]
        },
        {
          id: 'dev-env',
          title: 'Development Environment',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'IDEs: VS Code / Android Studio / IntelliJ Idea', type: 'subtopic' },
            { id: 'de-2', title: 'Tools: Flutter CLI / FVM', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ui-design-sec',
      title: 'UI Design & Assets',
      type: 'section',
      children: [
        {
          id: 'widgets',
          title: 'Widgets',
          type: 'topic',
          children: [
            { id: 'wi-1', title: 'Responsive / Inherited / Styled Widgets', type: 'subtopic' },
            { id: 'wi-2', title: 'Stateless / Stateful Widgets', type: 'subtopic' },
            { id: 'wi-3', title: 'Material / Cupertino Widgets', type: 'subtopic' }
          ]
        },
        {
          id: 'assets',
          title: 'Working with Assets',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Fonts / Images / Other File Types', type: 'subtopic' }
          ]
        },
        {
          id: 'animations',
          title: 'Animations',
          type: 'topic',
          children: [
            { id: 'an-1', title: 'Animation Controller / Animated Builder / Animated Widget', type: 'subtopic' },
            { id: 'an-2', title: 'Curved Animation / Hero / Opacity', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'architecture-logic-sec',
      title: 'Architecture & Business Logic',
      type: 'section',
      children: [
        {
          id: 'design-principles',
          title: 'Design Principles',
          type: 'topic',
          children: [
            { id: 'dp-1', title: 'Dependency Injection / Design Patterns', type: 'subtopic' },
            { id: 'dp-2', title: 'SOLID Principles / OOP', type: 'subtopic' }
          ]
        },
        {
          id: 'advanced-dart',
          title: 'Advanced Dart',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Core Libraries / Streams / Futures', type: 'subtopic' },
            { id: 'ad-2', title: 'Lists / Collections / Lambdas', type: 'subtopic' },
            { id: 'ad-3', title: 'Functional Programming / Isolates / Async / Await', type: 'subtopic' }
          ]
        },
        {
          id: 'state-mgmt',
          title: 'State Management',
          type: 'topic',
          children: [
            { id: 'sm-1', title: 'ChangeNotifier / ValueNotifier', type: 'subtopic' },
            { id: 'sm-2', title: 'Redux / Riverpod / BLoC / Provider / GetX', type: 'subtopic' }
          ]
        },
        {
          id: 'reactive-prog',
          title: 'Reactive Programming',
          type: 'topic',
          children: [
            { id: 'rp-1', title: 'RxDart', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-services-sec',
      title: 'Data & External Services',
      type: 'section',
      children: [
        {
          id: 'vcs',
          title: 'Version Control Systems',
          type: 'topic',
          children: [
            { id: 'vc-1', title: 'Git / GitHub', type: 'subtopic' }
          ]
        },
        {
          id: 'packages',
          title: 'Package Managers',
          type: 'topic',
          children: [
            { id: 'pm-1', title: 'pub.dev / flutter pub / dart pub', type: 'subtopic' }
          ]
        },
        {
          id: 'apis',
          title: 'Working with APIs',
          type: 'topic',
          children: [
            { id: 'api-1', title: 'JSON Serialize / Deserialize', type: 'subtopic' },
            { id: 'api-2', title: 'Web Sockets / GraphQL / RESTful APIs', type: 'subtopic' }
          ]
        },
        {
          id: 'storage',
          title: 'Storage & Firebase',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'SQLite / Shared Preferences', type: 'subtopic' },
            { id: 'st-2', title: 'Firebase (Auth, Storage, Firestore, Push Notifications, Remote Config, Cloud Functions)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'internals-deployment-sec',
      title: 'Internals & Deployment',
      type: 'section',
      children: [
        {
          id: 'internals',
          title: 'Flutter Internals',
          type: 'topic',
          children: [
            { id: 'int-1', title: 'Render Objects / 3 Trees / Immutability', type: 'subtopic' }
          ]
        },
        {
          id: 'devtools',
          title: 'Dev Tools',
          type: 'topic',
          children: [
            { id: 'dt-1', title: 'Flutter Inspector / Flutter Outline / Memory Allocation', type: 'subtopic' }
          ]
        },
        {
          id: 'testing',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'tst-1', title: 'Integration Testing / Unit Testing / Widget Testing / TDD / BDD', type: 'subtopic' }
          ]
        },
        {
          id: 'cicd',
          title: 'CI / CD',
          type: 'topic',
          children: [
            { id: 'ci-1', title: 'Fast Lane / Codemagic / Bitrise / GitHub Actions / Firebase App Dist', type: 'subtopic' }
          ]
        },
        {
          id: 'analytics',
          title: 'Analytics',
          type: 'topic',
          children: [
            { id: 'ana-1', title: 'Segment / Mix Panel / Firebase Analytics / Google Analytics', type: 'subtopic' }
          ]
        },
        {
          id: 'deploy',
          title: 'Deployment',
          type: 'topic',
          children: [
            { id: 'dep-1', title: 'Guidelines & Protocols / AppStore / Playstore', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'React Native Roadmap', type: 'topic', link: { id: 'react-native', title: 'React Native' } },
        { id: 'related-2', title: 'Android Roadmap', type: 'topic', link: { id: 'android', title: 'Android' } },
        { id: 'related-3', title: 'iOS Roadmap', type: 'topic', link: { id: 'ios', title: 'iOS' } }
      ]
    }
  ]
};

export const forwardDeployedEngineerRoadmap = {
  id: 'forward-deployed-engineer',
  title: 'FDE Roadmap',
  description: 'Forward Deployed Engineer (FDE) learning path.',
  layout: 'linear',
  category: 'role',
  subscriberCount: '15,000',
  faq: {
    question: 'What is a Forward Deployed Engineer?',
    answer: 'An FDE combines full-stack development, AI/DevOps skills, and strong customer-facing abilities to deliver complete applications and infrastructure directly to enterprise clients.'
  },
  items: [
    {
      id: 'fde-intro-sec',
      title: 'Introduction',
      type: 'section',
      children: [
        {
          id: 'fde-intro',
          title: 'FDE Role',
          type: 'topic',
          children: [
            { id: 'fi-1', title: 'From X to FDE', type: 'subtopic' },
            { id: 'fi-2', title: 'Roles & Responsibilities', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'fde-tech-sec',
      title: 'Core Technical Skills',
      type: 'section',
      children: [
        { id: 'fde-fe', title: 'Frontend Skills', type: 'topic', link: { id: 'frontend', title: 'Frontend Roadmap' } },
        { id: 'fde-be', title: 'Backend Skills', type: 'topic', link: { id: 'backend', title: 'Backend Roadmap' } },
        { id: 'fde-lx', title: 'Linux Skills', type: 'topic', link: { id: 'linux', title: 'Linux Roadmap' } },
        { id: 'fde-dsa', title: 'DSA & System Design', type: 'topic', link: { id: 'system-design', title: 'System Design Roadmap' } },
        { id: 'fde-ai', title: 'AI Engineering Skills', type: 'topic', link: { id: 'ai-engineer', title: 'AI Engineer Roadmap' } },
        { id: 'fde-do', title: 'DevOps Skills', type: 'topic', link: { id: 'devops', title: 'DevOps Roadmap' } }
      ]
    },
    {
      id: 'fde-field-sec',
      title: 'Customer Delivery & Field Skills',
      type: 'section',
      children: [
        {
          id: 'fde-disc',
          title: 'Discovery & Scoping',
          type: 'topic',
          children: [
            { id: 'fd-1', title: 'Requirements Gathering', type: 'subtopic' },
            { id: 'fd-2', title: 'Technical Scoping & Sequencing', type: 'subtopic' },
            { id: 'fd-3', title: 'Tradeoffs: Scope, Speed, Quality', type: 'subtopic' }
          ]
        },
        {
          id: 'fde-bus',
          title: 'Business Acumen',
          type: 'topic',
          children: [
            { id: 'fb-1', title: 'Enterprise Workflow', type: 'subtopic' },
            { id: 'fb-2', title: 'ROI & AI Impact', type: 'subtopic' },
            { id: 'fb-3', title: 'Stakeholder Management', type: 'subtopic' },
            { id: 'fb-4', title: 'Product Feedback Loop', type: 'subtopic' }
          ]
        },
        {
          id: 'fde-comm',
          title: 'Communication',
          type: 'topic',
          children: [
            { id: 'fc-1', title: 'Technical Writing', type: 'subtopic' }
          ]
        }
      ]
    }
  ]
};

export const frontendBeginnerRoadmap = {
  id: 'frontend-beginner',
  title: 'Frontend Beginner',
  description: 'Absolute beginner guide to Frontend development',
  layout: 'linear',
  category: 'beginner',
  subscriberCount: '250,000',
  faq: {
    question: 'How to start Frontend?',
    answer: 'Start with HTML, CSS, and JavaScript. Once comfortable, pick up a framework like React and tools like Git and npm.'
  },
  items: [
    {
      id: 'fe-beg-core-sec',
      title: 'Core Technologies',
      type: 'section',
      children: [
        { id: 'feb-html', title: 'HTML', type: 'topic' },
        { id: 'feb-css', title: 'CSS', type: 'topic' },
        { id: 'feb-js', title: 'JavaScript', type: 'topic' }
      ]
    },
    {
      id: 'fe-beg-tools-sec',
      title: 'Tools & Workflows',
      type: 'section',
      children: [
        {
          id: 'feb-vcs',
          title: 'Version Control',
          type: 'topic',
          children: [
            { id: 'feb-git', title: 'Git', type: 'subtopic' },
            { id: 'feb-github', title: 'GitHub', type: 'subtopic' }
          ]
        },
        { id: 'feb-npm', title: 'npm', type: 'topic' }
      ]
    },
    {
      id: 'fe-beg-framework-sec',
      title: 'Frameworks & Testing',
      type: 'section',
      children: [
        { id: 'feb-react', title: 'React', type: 'topic' },
        { id: 'feb-tailwind', title: 'Tailwind', type: 'topic' },
        { id: 'feb-vitest', title: 'Vitest', type: 'topic' }
      ]
    },
    {
      id: 'fe-beg-end-sec',
      title: 'Next Steps',
      type: 'section',
      children: [
        { id: 'feb-end', title: 'Detailed Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend Roadmap' } }
      ]
    }
  ]
};

export const frontendRoadmap = {
  id: 'frontend',
  title: 'Frontend',
  description: 'Step by step guide to becoming a modern front-end developer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '900,000',
  faq: {
    question: 'Which framework should I learn first?',
    answer: 'React is the most popular and has the largest job market. Vue is easier to learn. Angular is preferred in enterprise. Pick one and master it.'
  },
  items: [
    {
      id: 'fundamentals-sec',
      title: 'Fundamentals',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'HTML, CSS & Internet',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Semantic HTML / Forms / Accessibility', type: 'subtopic' },
            { id: 'ba-2', title: 'CSS Layouts / Responsive Design / SEO', type: 'subtopic' },
            { id: 'ba-3', title: 'HTTP, DNS, Browsers / Internet Basics', type: 'subtopic' }
          ]
        },
        {
          id: 'js-vcs',
          title: 'JavaScript & VCS',
          type: 'topic',
          children: [
            { id: 'js-1', title: 'DOM Manipulation / Fetch API / Ajax', type: 'subtopic' },
            { id: 'js-2', title: 'Git / GitHub / npm, pnpm, yarn', type: 'subtopic' },
            { id: 'js-3', title: 'Package Managers', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'frameworks-tooling-sec',
      title: 'Frameworks & Tooling',
      type: 'section',
      children: [
        {
          id: 'framework-css',
          title: 'Frameworks & CSS',
          type: 'topic',
          children: [
            { id: 'fc-1', title: 'React / Vue / Angular / Svelte / Solid', type: 'subtopic' },
            { id: 'fc-2', title: 'Tailwind CSS / CSS Architecture (BEM)', type: 'subtopic' },
            { id: 'fc-3', title: 'Sass / PostCSS / CSS Preprocessors', type: 'subtopic' }
          ]
        },
        {
          id: 'build-testing',
          title: 'Build Tools & Testing',
          type: 'topic',
          children: [
            { id: 'bt-1', title: 'Vite / Webpack / esbuild / Rollup', type: 'subtopic' },
            { id: 'bt-2', title: 'TypeScript / Linters (ESLint, Prettier)', type: 'subtopic' },
            { id: 'bt-3', title: 'Vitest / Jest / Playwright / Cypress', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-sec',
      title: 'Advanced & Beyond',
      type: 'section',
      children: [
        {
          id: 'ssr-advanced',
          title: 'SSR & Advanced Concepts',
          type: 'topic',
          children: [
            { id: 'sa-1', title: 'Next.js / Nuxt / Astro / SvelteKit', type: 'subtopic' },
            { id: 'sa-2', title: 'Web Security (CORS, HTTPS, OWASP)', type: 'subtopic' },
            { id: 'sa-3', title: 'Authentication (JWT, OAuth, SSO)', type: 'subtopic' }
          ]
        },
        {
          id: 'web-apis-beyond',
          title: 'Web APIs & Beyond',
          type: 'topic',
          children: [
            { id: 'wb-1', title: 'PWAs / Web Components / GraphQL', type: 'subtopic' },
            { id: 'wb-2', title: 'Performance (Lighthouse, DevTools)', type: 'subtopic' },
            { id: 'wb-3', title: 'Mobile (React Native) / Desktop (Electron)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'TypeScript Roadmap', type: 'topic', link: { id: 'typescript', title: 'TypeScript' } },
        { id: 'related-2', title: 'Full Stack Roadmap', type: 'topic', link: { id: 'full-stack', title: 'Full Stack' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const fullStackRoadmap = {
  id: 'full-stack',
  title: 'Full Stack',
  description: 'Step by step guide to becoming a full stack developer from absolute beginner',
  layout: 'linear',
  category: 'role',
  subscriberCount: '600,000',
  faq: {
    question: 'Should I learn frontend or backend first?',
    answer: 'Start with HTML, CSS, JavaScript to build static pages. Then learn a frontend framework (React). Finally add backend (Node.js) and databases (PostgreSQL).'
  },
  items: [
    {
      id: 'frontend-basics-sec',
      title: 'Frontend Basics',
      type: 'section',
      children: [
        {
          id: 'fe-foundations',
          title: 'Frontend Foundations',
          type: 'topic',
          children: [
            { id: 'ff-1', title: 'HTML / CSS / JavaScript', type: 'subtopic' },
            { id: 'ff-2', title: 'Static Webpages / Interactivity', type: 'subtopic' },
            { id: 'ff-3', title: 'npm / Git / GitHub', type: 'subtopic' }
          ]
        },
        {
          id: 'fe-tools',
          title: 'Tools & Frameworks',
          type: 'topic',
          children: [
            { id: 'ft-1', title: 'React / Tailwind CSS', type: 'subtopic' },
            { id: 'ft-2', title: 'Frontend Apps Checkpoint', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'backend-sec',
      title: 'Backend',
      type: 'section',
      children: [
        {
          id: 'be-db',
          title: 'Backend & Databases',
          type: 'topic',
          children: [
            { id: 'bd-1', title: 'Node.js / CLI Apps', type: 'subtopic' },
            { id: 'bd-2', title: 'PostgreSQL / Redis', type: 'subtopic' },
            { id: 'bd-3', title: 'Simple CRUD Apps', type: 'subtopic' }
          ]
        },
        {
          id: 'api-auth',
          title: 'APIs & Auth',
          type: 'topic',
          children: [
            { id: 'aa-1', title: 'RESTful APIs / JWT Auth', type: 'subtopic' },
            { id: 'aa-2', title: 'Complete App Checkpoint', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'devops-sec',
      title: 'DevOps',
      type: 'section',
      children: [
        {
          id: 'devops-deploy',
          title: 'DevOps & Deployment',
          type: 'topic',
          children: [
            { id: 'dd-1', title: 'Linux Basics / AWS (EC2, S3, VPC)', type: 'subtopic' },
            { id: 'dd-2', title: 'GitHub Actions / CI/CD', type: 'subtopic' },
            { id: 'dd-3', title: 'Terraform / Ansible / Monitoring', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } }
      ]
    }
  ]
};
export const gameDeveloperRoadmap = {
  id: 'game-developer',
  title: 'Game Developer',
  description: 'Master the tools, math, and engines required to build games',
  layout: 'linear',
  category: 'role',
  subscriberCount: '215,000',
  faq: {
    question: 'How do I start game development?',
    answer: 'Start by choosing an engine (like Unity, Godot, or Unreal) and learning the language associated with it (C#, GDScript, or C++).'
  },
  items: [
    {
      id: 'core-skills-sec',
      title: 'Core Skills',
      type: 'section',
      children: [
        { id: 'cs-roles', title: 'Client / Server Side', type: 'topic' },
        {
          id: 'cs-prog',
          title: 'Programming Languages',
          type: 'topic',
          children: [
            { id: 'cp-1', title: 'C# / C / C++', type: 'subtopic' },
            { id: 'cp-2', title: 'Rust / Python / GDScript', type: 'subtopic' }
          ]
        },
        {
          id: 'cs-math',
          title: 'Game Mathematics',
          type: 'topic',
          children: [
            { id: 'cm-1', title: 'Linear Algebra (Vector, Matrix)', type: 'subtopic' },
            { id: 'cm-2', title: 'Geometry (Affine, Projection)', type: 'subtopic' },
            { id: 'cm-3', title: 'Dynamics (Acceleration, Force, Velocity)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'game-tech-sec',
      title: 'Game Technology',
      type: 'section',
      children: [
        {
          id: 'gt-engine',
          title: 'Game Engine',
          type: 'topic',
          children: [
            { id: 'ge-1', title: 'Native', type: 'subtopic' },
            { id: 'ge-2', title: 'Unity 3D / Unreal Engine / Godot', type: 'subtopic' }
          ]
        },
        {
          id: 'gt-physics',
          title: 'Game Physics',
          type: 'topic',
          children: [
            { id: 'gp-1', title: 'Collision Detection (SAT, GJK, CCD, EPA)', type: 'subtopic' },
            { id: 'gp-2', title: 'Bounding Volume / Spatial Partitioning', type: 'subtopic' }
          ]
        },
        {
          id: 'gt-ai',
          title: 'Game AI',
          type: 'topic',
          children: [
            { id: 'ga-1', title: 'Decision Making (State Machine, Behavior Tree)', type: 'subtopic' },
            { id: 'ga-2', title: 'Movement / Learning (Deep Learning)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'graphics-rendering-sec',
      title: 'Graphics & Rendering',
      type: 'section',
      children: [
        {
          id: 'gr-graphics',
          title: 'Computer Graphics',
          type: 'topic',
          children: [
            { id: 'cg-1', title: 'Lighting and Shadow / Shader (HLSL, GLSL)', type: 'subtopic' },
            { id: 'cg-2', title: 'Visibility and Occlusion / Rendering Equation', type: 'subtopic' }
          ]
        },
        { id: 'gr-anim', title: 'Computer Animation', type: 'topic' },
        {
          id: 'gr-api',
          title: 'Graphics API',
          type: 'topic',
          children: [
            { id: 'ga-1', title: 'OpenGL / Vulkan / DirectX', type: 'subtopic' },
            { id: 'ga-2', title: 'Metal / WebGL', type: 'subtopic' }
          ]
        },
        {
          id: 'gr-adv',
          title: 'Advanced Rendering',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Physically-Based Rendering', type: 'subtopic' },
            { id: 'ar-2', title: 'Real-time Ray Tracing (DirectX, Vulkan, OptiX)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-2', title: 'API Design Roadmap', type: 'topic', link: { id: 'api-design', title: 'API Design' } }
      ]
    }
  ]
};
export const gitGithubBeginnerRoadmap = {
  id: 'git-github-beginner',
  title: 'Git and GitHub Beginner',
  description: 'Learn the fundamentals of version control',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '250,000',
  faq: {
    question: 'Why do I need Git?',
    answer: 'Git tracks changes to your code, allowing you to revert mistakes, collaborate with others, and keep a history of your project.'
  },
  items: [
    {
      id: 'fundamentals-setup-sec',
      title: 'Fundamentals & Setup',
      type: 'section',
      children: [
        {
          id: 'concept',
          title: 'Learn the "What" and "Why"',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'What are Version Control Systems?', type: 'subtopic' },
            { id: 'co-2', title: 'What is Git and why should you use it?', type: 'subtopic' }
          ]
        },
        {
          id: 'setup',
          title: 'Basic Git Usage',
          type: 'topic',
          children: [
            { id: 'su-1', title: 'Install Git locally', type: 'subtopic' },
            { id: 'su-2', title: 'Create a GitHub account', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'commands-remote-sec',
      title: 'Commands & Remote',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Learn the basic git commands',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'git init / git add / git commit / git reset', type: 'subtopic' },
            { id: 'ba-2', title: '.gitignore file usage', type: 'subtopic' },
            { id: 'ba-3', title: 'Creating and Merging Branches', type: 'subtopic' }
          ]
        },
        {
          id: 'remote',
          title: 'Using Git with GitHub',
          type: 'topic',
          children: [
            { id: 're-1', title: 'Creating private / public repositories', type: 'subtopic' },
            { id: 're-2', title: 'Adding remote and pushing changes', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'collaboration-more-sec',
      title: 'Collaboration & Next Steps',
      type: 'section',
      children: [
        {
          id: 'collab',
          title: 'Collaboration',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Forking & cloning repositories', type: 'subtopic' },
            { id: 'cl-2', title: 'Creating Pull Requests', type: 'subtopic' },
            { id: 'cl-3', title: 'Pulling and pushing changes', type: 'subtopic' },
            { id: 'cl-4', title: 'Resolve merge conflicts', type: 'subtopic' },
            { id: 'cl-5', title: 'Common OSS licences', type: 'subtopic' }
          ]
        },
        {
          id: 'more-git',
          title: 'More Git',
          type: 'topic',
          children: [
            { id: 'mg-1', title: 'Hard reset and reverting', type: 'subtopic' },
            { id: 'mg-2', title: 'Rebase vs Merge vs Squash', type: 'subtopic' },
            { id: 'mg-3', title: 'Stashing & Cherry picking', type: 'subtopic' }
          ]
        },
        {
          id: 'more-gh',
          title: 'More GitHub',
          type: 'topic',
          children: [
            { id: 'mh-1', title: 'GitHub Actions', type: 'subtopic' },
            { id: 'mh-2', title: 'GitHub CLI', type: 'subtopic' },
            { id: 'mh-3', title: 'Markdown', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Detailed Git and GitHub Roadmap', type: 'topic', link: { id: 'git-and-github', title: 'Git and GitHub' } },
        { id: 'related-2', title: 'Frontend Beginner Roadmap', type: 'topic', link: { id: 'frontend-beginner', title: 'Frontend Beginner' } },
        { id: 'related-3', title: 'Backend Beginner Roadmap', type: 'topic', link: { id: 'backend-beginner', title: 'Backend Beginner' } }
      ]
    }
  ]
};
export const gitGithubRoadmap = {
  id: 'git-github',
  title: 'Git and GitHub',
  description: 'Master advanced version control and collaboration workflows',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '210,000',
  faq: {
    question: 'How is this different from the beginner roadmap?',
    answer: 'This roadmap covers advanced operations like rebasing, cherry-picking, git hooks, CI/CD with GitHub Actions, and complex branching strategies.'
  },
  items: [
    {
      id: 'core-git-sec',
      title: 'Core Git & Merging',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Learn the Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'git init / config / Repo Initialization', type: 'subtopic' },
            { id: 'ba-2', title: 'Branching Basics / Committing', type: 'subtopic' },
            { id: 'ba-3', title: 'git log / Viewing Commit History', type: 'subtopic' },
            { id: 'ba-4', title: 'Git Remotes / Fetch', type: 'subtopic' }
          ]
        },
        {
          id: 'merging',
          title: 'Merging Basics',
          type: 'topic',
          children: [
            { id: 'me-1', title: 'Fast-Forward vs Non-FF', type: 'subtopic' },
            { id: 'me-2', title: 'Rebase / Squash / Strategies', type: 'subtopic' },
            { id: 'me-3', title: 'Handling Conflicts', type: 'subtopic' },
            { id: 'me-4', title: 'Cherry Picking Commits', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'github-collaboration-sec',
      title: 'GitHub & Collaboration',
      type: 'section',
      children: [
        {
          id: 'gh-ess',
          title: 'GitHub Essentials',
          type: 'topic',
          children: [
            { id: 'gh-1', title: 'Profile Setup / Repos', type: 'subtopic' },
            { id: 'gh-2', title: 'Forking vs Cloning', type: 'subtopic' },
            { id: 'gh-3', title: 'Markdown / Issues / PRs', type: 'subtopic' }
          ]
        },
        {
          id: 'collab',
          title: 'Collaboration',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'PR from Fork / Code Reviews', type: 'subtopic' },
            { id: 'cl-2', title: 'Labelling / Mentions / Reactions', type: 'subtopic' },
            { id: 'cl-3', title: 'Discussions / Projects / Teams', type: 'subtopic' }
          ]
        },
        {
          id: 'best',
          title: 'Best Practices',
          type: 'topic',
          children: [
            { id: 'bp-1', title: 'Commit Messages / Branch Naming', type: 'subtopic' },
            { id: 'bp-2', title: 'Project Readme / PR Guidelines', type: 'subtopic' },
            { id: 'bp-3', title: 'Clean History (Linear vs Non-Linear)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-operations-sec',
      title: 'Advanced Operations',
      type: 'section',
      children: [
        {
          id: 'undo',
          title: 'Undoing & Diffs',
          type: 'topic',
          children: [
            { id: 'un-1', title: 'git revert / git reset', type: 'subtopic' },
            { id: 'un-2', title: '--soft / --mixed / --hard', type: 'subtopic' },
            { id: 'un-3', title: 'Staged vs Unstaged Diffs', type: 'subtopic' }
          ]
        },
        {
          id: 'hist',
          title: 'Rewriting History',
          type: 'topic',
          children: [
            { id: 'hi-1', title: 'git commit --amend', type: 'subtopic' },
            { id: 'hi-2', title: 'git rebase / filter-branch', type: 'subtopic' },
            { id: 'hi-3', title: 'git push --force', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tools-automation-sec',
      title: 'Tools & Automation',
      type: 'section',
      children: [
        {
          id: 'hooks',
          title: 'Git Hooks & Tags',
          type: 'topic',
          children: [
            { id: 'hk-1', title: 'commit-msg / pre-commit', type: 'subtopic' },
            { id: 'hk-2', title: 'Pushing Tags / Git Patch', type: 'subtopic' }
          ]
        },
        {
          id: 'adv-git',
          title: 'Advanced Git',
          type: 'topic',
          children: [
            { id: 'ag-1', title: 'Git Reflog / Git Bisect', type: 'subtopic' },
            { id: 'ag-2', title: 'Git Worktree / Attributes / LFS', type: 'subtopic' }
          ]
        },
        {
          id: 'actions',
          title: 'GitHub Actions',
          type: 'topic',
          children: [
            { id: 'ac-1', title: 'YAML Syntax / Workflows / Runners', type: 'subtopic' },
            { id: 'ac-2', title: 'Secrets / Caching / Artifacts', type: 'subtopic' },
            { id: 'ac-3', title: 'Marketplace / Webhooks / API', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-2', title: 'Full Stack Roadmap', type: 'topic', link: { id: 'full-stack', title: 'Full Stack' } }
      ]
    }
  ]
};
export const golangRoadmap = {
  id: 'golang',
  title: 'Go',
  description: 'Master Go (Golang) for scalable and concurrent backend systems',
  layout: 'linear',
  category: 'language',
  subscriberCount: '150,000',
  faq: {
    question: 'Why learn Go?',
    answer: 'Go is designed by Google for high-performance, concurrent, and scalable networking and server-side applications.'
  },
  items: [
    {
      id: 'basics-sec',
      title: 'Basics & Syntax',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction & Basics',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Why use Go / History of Go', type: 'subtopic' },
            { id: 'in-2', title: 'Variables & Constants / Data Types', type: 'subtopic' },
            { id: 'in-3', title: 'Composite Types (Arrays, Slices, Maps)', type: 'subtopic' },
            { id: 'in-4', title: 'Type Conversion', type: 'subtopic' }
          ]
        },
        {
          id: 'syntax',
          title: 'Syntax & Language Features',
          type: 'topic',
          children: [
            { id: 'sy-1', title: 'Loops / Conditionals', type: 'subtopic' },
            { id: 'sy-2', title: 'Functions / Pointers', type: 'subtopic' },
            { id: 'sy-3', title: 'Methods and Interfaces / Generics', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'modules-errors-sec',
      title: 'Modules & Error Handling',
      type: 'section',
      children: [
        {
          id: 'mod',
          title: 'Modules & Packages',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'go mod init / tidy / vendor', type: 'subtopic' },
            { id: 'mo-2', title: 'Import Rules / 3rd Party Pkgs', type: 'subtopic' }
          ]
        },
        {
          id: 'err',
          title: 'Error Handling',
          type: 'topic',
          children: [
            { id: 'er-1', title: 'error interface / Wrapping', type: 'subtopic' },
            { id: 'er-2', title: 'panic and recover', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'concurrency-sec',
      title: 'Concurrency',
      type: 'section',
      children: [
        {
          id: 'conc',
          title: 'Concurrency',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Goroutines / Channels (Buffered vs Unbuffered)', type: 'subtopic' },
            { id: 'co-2', title: 'sync Package (Mutexes, WaitGroups)', type: 'subtopic' },
            { id: 'co-3', title: 'context Package / Concurrency Patterns', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'stdlib-testing-sec',
      title: 'Standard Library & Testing',
      type: 'section',
      children: [
        {
          id: 'stdlib',
          title: 'Standard Library',
          type: 'topic',
          children: [
            { id: 'sl-1', title: 'fmt / net/http / os', type: 'subtopic' },
            { id: 'sl-2', title: 'encoding/json / time', type: 'subtopic' }
          ]
        },
        {
          id: 'test',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'ts-1', title: 'testing package / Benchmarks', type: 'subtopic' },
            { id: 'ts-2', title: 'Mocks / httptest', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ecosystem-tools-sec',
      title: 'Ecosystem, Tools & Advanced',
      type: 'section',
      children: [
        {
          id: 'ecosys',
          title: 'Ecosystem & Libraries',
          type: 'topic',
          children: [
            { id: 'ec-1', title: 'Building CLIs (Cobra) / Web Frameworks (Gin, Fiber)', type: 'subtopic' },
            { id: 'ec-2', title: 'ORMs (GORM, pgx) / Logging (Zerolog, Zap)', type: 'subtopic' },
            { id: 'ec-3', title: 'gRPC & Protocol Buffers', type: 'subtopic' }
          ]
        },
        {
          id: 'tools',
          title: 'Toolchain & Perf',
          type: 'topic',
          children: [
            { id: 'tc-1', title: 'Core Go Commands / Linters', type: 'subtopic' },
            { id: 'tc-2', title: 'Performance and Debugging (pprof)', type: 'subtopic' },
            { id: 'tc-3', title: 'Security / Deployment', type: 'subtopic' }
          ]
        },
        {
          id: 'adv',
          title: 'Advanced Topics',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Memory Mgmt (Escape Analysis)', type: 'subtopic' },
            { id: 'ad-2', title: 'Reflection / Unsafe Package', type: 'subtopic' },
            { id: 'ad-3', title: 'Build Constraints / CGO Basics', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-2', title: 'Docker Roadmap', type: 'topic', link: { id: 'docker', title: 'Docker' } },
        { id: 'related-3', title: 'Kubernetes Roadmap', type: 'topic', link: { id: 'kubernetes', title: 'Kubernetes' } }
      ]
    }
  ]
};
export const htmlRoadmap = {
  id: 'html',
  title: 'HTML',
  description: 'Master the building blocks of the web',
  layout: 'linear',
  category: 'language',
  subscriberCount: '310,000',
  faq: {
    question: 'Is HTML a programming language?',
    answer: 'HTML (HyperText Markup Language) is a markup language, not a programming language. It defines the structure and meaning of web content.'
  },
  items: [
    {
      id: 'web-intro-sec',
      title: 'Web & Introduction',
      type: 'section',
      children: [
        {
          id: 'web',
          title: 'How the web works',
          type: 'topic',
          children: [
            { id: 'we-1', title: 'Markup languages / HTTP', type: 'subtopic' },
            { id: 'we-2', title: 'Domain names / Hosting', type: 'subtopic' },
            { id: 'we-3', title: 'DNS / Browsers', type: 'subtopic' }
          ]
        },
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Tags and Attributes', type: 'subtopic' },
            { id: 'in-2', title: 'Case Insensitivity / Entities', type: 'subtopic' },
            { id: 'in-3', title: 'Comments / Whitespaces', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'document-structure-sec',
      title: 'Document Structure',
      type: 'section',
      children: [
        {
          id: 'first',
          title: 'Your First HTML File',
          type: 'topic',
          children: [
            { id: 'fi-1', title: '<!DOCTYPE>', type: 'subtopic' },
            { id: 'fi-2', title: '<html> / <body>', type: 'subtopic' },
            { id: 'fi-3', title: '<head> / <meta> / <title>', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tags-elements-sec',
      title: 'Tags & Elements',
      type: 'section',
      children: [
        {
          id: 'tags',
          title: 'Basic Tags',
          type: 'topic',
          children: [
            { id: 'ta-1', title: 'h1 to h6 / p / div / span', type: 'subtopic' },
            { id: 'ta-2', title: 'hr / br / b / strong / pre', type: 'subtopic' },
            { id: 'ta-3', title: 'i / em / mark / sub / sup', type: 'subtopic' }
          ]
        },
        {
          id: 'group',
          title: 'Grouping text & Links',
          type: 'topic',
          children: [
            { id: 'gr-1', title: 'id / class / Data Attributes', type: 'subtopic' },
            { id: 'gr-2', title: 'style / Priority Hints', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'media-semantic-sec',
      title: 'Media & Semantic Structure',
      type: 'section',
      children: [
        {
          id: 'media',
          title: 'Media & Embedding',
          type: 'topic',
          children: [
            { id: 'me-1', title: 'img vs figure / Images', type: 'subtopic' },
            { id: 'me-2', title: 'Audio / Video', type: 'subtopic' },
            { id: 'me-3', title: 'CSP / iframe', type: 'subtopic' }
          ]
        },
        {
          id: 'struct',
          title: 'Tables, Lists & Semantic',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Table Tag / Ordered lists', type: 'subtopic' },
            { id: 'st-2', title: 'Unordered / Definition lists', type: 'subtopic' },
            { id: 'st-3', title: 'Layout tags (header, nav, main, etc.)', type: 'subtopic' },
            { id: 'st-4', title: 'del, ins / blockquote, cite, q', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'forms-styling-sec',
      title: 'Forms & Styling Integration',
      type: 'section',
      children: [
        {
          id: 'forms',
          title: 'Forms',
          type: 'topic',
          children: [
            { id: 'fo-1', title: 'Labels and Inputs', type: 'subtopic' },
            { id: 'fo-2', title: 'File Uploads', type: 'subtopic' },
            { id: 'fo-3', title: 'Form Validation / Limitations', type: 'subtopic' }
          ]
        },
        {
          id: 'styling',
          title: 'Styling & Scripts',
          type: 'topic',
          children: [
            { id: 'sy-1', title: 'Including JavaScript', type: 'subtopic' },
            { id: 'sy-2', title: 'Inline / Internal / External CSS', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'best-practices-sec',
      title: 'Best Practices',
      type: 'section',
      children: [
        { id: 'seo', title: 'SEO & Accessibility', type: 'topic' }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-2', title: 'JavaScript Roadmap', type: 'topic', link: { id: 'javascript', title: 'JavaScript' } }
      ]
    }
  ]
};
export const iosRoadmap = {
  id: 'ios',
  title: 'iOS Developer',
  description: 'Master iOS App Development using Swift and SwiftUI',
  layout: 'linear',
  category: 'role',
  subscriberCount: '160,000',
  faq: {
    question: 'Should I learn SwiftUI or UIKit?',
    answer: 'SwiftUI is the modern declarative framework for Apple platforms. However, UIKit is still heavily used in existing codebases, so knowing both is highly recommended.'
  },
  items: [
    {
      id: 'core-sec',
      title: 'Core Fundamentals',
      type: 'section',
      children: [
        {
          id: 'lang',
          title: 'Pick a Language',
          type: 'topic',
          children: [
            { id: 'la-1', title: 'Swift (Recommended) / Basics', type: 'subtopic' },
            { id: 'la-2', title: 'OOP / Functional Prog / Concurrency', type: 'subtopic' },
            { id: 'la-3', title: 'Objective-C Basics / Interoperability', type: 'subtopic' }
          ]
        },
        {
          id: 'arch',
          title: 'iOS Architecture',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Core OS / Core Services', type: 'subtopic' },
            { id: 'ar-2', title: 'Media (Core Graphics, Audio, Metal)', type: 'subtopic' },
            { id: 'ar-3', title: 'Cocoa Touch', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ui-frameworks-sec',
      title: 'UI Frameworks',
      type: 'section',
      children: [
        {
          id: 'uikit',
          title: 'UIKit',
          type: 'topic',
          children: [
            { id: 'ui-1', title: 'Views / View Controllers', type: 'subtopic' },
            { id: 'ui-2', title: 'Interface Builder / Auto layout', type: 'subtopic' },
            { id: 'ui-3', title: 'Storyboards / Xibs', type: 'subtopic' }
          ]
        },
        {
          id: 'swiftui',
          title: 'SwiftUI',
          type: 'topic',
          children: [
            { id: 'su-1', title: 'Declarative Syntax', type: 'subtopic' },
            { id: 'su-2', title: 'State Management / Data binding', type: 'subtopic' },
            { id: 'su-3', title: 'Views and Modifiers', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'patterns-concurrency-sec',
      title: 'Design Patterns & Concurrency',
      type: 'section',
      children: [
        {
          id: 'patterns',
          title: 'Design & Patterns',
          type: 'topic',
          children: [
            { id: 'pa-1', title: 'MVC / MVP / MVVM / VIPER / TCA', type: 'subtopic' },
            { id: 'pa-2', title: 'Delegate Pattern / Closures', type: 'subtopic' }
          ]
        },
        {
          id: 'concurrency',
          title: 'Concurrency',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'GCD / Operation Queues', type: 'subtopic' },
            { id: 'co-2', title: 'async / await / Asynchronism', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-network-sec',
      title: 'Data & Network',
      type: 'section',
      children: [
        {
          id: 'data',
          title: 'Data Persistence',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'Core Data / User Defaults', type: 'subtopic' },
            { id: 'da-2', title: 'Keychain / File System / SQLite', type: 'subtopic' },
            { id: 'da-3', title: 'JSON Parsing / Serializing', type: 'subtopic' }
          ]
        },
        {
          id: 'network',
          title: 'Networking',
          type: 'topic',
          children: [
            { id: 'ne-1', title: 'HTTP / REST / GraphQL', type: 'subtopic' },
            { id: 'ne-2', title: 'URLSession / Alamofire', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-testing-sec',
      title: 'Advanced & Testing',
      type: 'section',
      children: [
        {
          id: 'reactive',
          title: 'Reactive Prog & Combine',
          type: 'topic',
          children: [
            { id: 're-1', title: 'Combine (Publishers, Operators)', type: 'subtopic' },
            { id: 're-2', title: 'RxSwift (Observables, Subjects)', type: 'subtopic' }
          ]
        },
        {
          id: 'testing',
          title: 'Testing & Quality',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'XCTest / XCUITest / Test Plan', type: 'subtopic' },
            { id: 'te-2', title: 'Linting (SwiftLint, SwiftFormat)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'cicd-deploy-sec',
      title: 'CI/CD & Deployment',
      type: 'section',
      children: [
        {
          id: 'cicd',
          title: 'CI / CD',
          type: 'topic',
          children: [
            { id: 'ci-1', title: 'FastLane / GitHub Actions', type: 'subtopic' },
            { id: 'ci-2', title: 'Jenkins / Circle CI', type: 'subtopic' }
          ]
        },
        {
          id: 'deploy',
          title: 'App Distribution',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'TestFlight / App Store', type: 'subtopic' },
            { id: 'de-2', title: 'App Store Optimization (ASO)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Android Roadmap', type: 'topic', link: { id: 'android', title: 'Android' } },
        { id: 'related-2', title: 'Flutter Roadmap', type: 'topic', link: { id: 'flutter', title: 'Flutter' } },
        { id: 'related-3', title: 'React Native Roadmap', type: 'topic', link: { id: 'react-native', title: 'React Native' } }
      ]
    }
  ]
};
export const javaRoadmap = {
  id: 'java',
  title: 'Java',
  description: 'Master Java for enterprise application development',
  layout: 'linear',
  category: 'language',
  subscriberCount: '275,000',
  faq: {
    question: 'Is Java still relevant?',
    answer: 'Absolutely. Java remains one of the most widely used languages in enterprise environments, Android development, and large-scale backend systems.'
  },
  items: [
    {
      id: 'basics-sec',
      title: 'Java Basics',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Learn the Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Syntax / Data Types / Variables', type: 'subtopic' },
            { id: 'ba-2', title: 'Type Casting / Strings / Math', type: 'subtopic' },
            { id: 'ba-3', title: 'Arrays / Conditionals / Loops', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'oop-sec',
      title: 'Object-Oriented Programming (OOP)',
      type: 'section',
      children: [
        {
          id: 'oop-basic',
          title: 'Basics of OOP',
          type: 'topic',
          children: [
            { id: 'ob-1', title: 'Classes / Objects / Attributes / Methods', type: 'subtopic' },
            { id: 'ob-2', title: 'Access Specifiers / Static / Final', type: 'subtopic' },
            { id: 'ob-3', title: 'Nested Classes / Packages', type: 'subtopic' }
          ]
        },
        {
          id: 'oop-adv',
          title: 'More about OOP',
          type: 'topic',
          children: [
            { id: 'oa-1', title: 'Inheritance / Abstraction / Interfaces', type: 'subtopic' },
            { id: 'oa-2', title: 'Method Overloading & Overriding', type: 'subtopic' },
            { id: 'oa-3', title: 'Encapsulation / Dependency Injection', type: 'subtopic' },
            { id: 'oa-4', title: 'Enums / Records', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-features-sec',
      title: 'Core Features',
      type: 'section',
      children: [
        {
          id: 'core',
          title: 'Core Features',
          type: 'topic',
          children: [
            { id: 'cf-1', title: 'Exception Handling / Lambda Expressions', type: 'subtopic' },
            { id: 'cf-2', title: 'Annotations / Modules / Optionals / Cryptography', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-io-sec',
      title: 'Data Structures & I/O',
      type: 'section',
      children: [
        {
          id: 'data',
          title: 'Collections & Utils',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'Array vs ArrayList / Set / Map / Queue', type: 'subtopic' },
            { id: 'da-2', title: 'Iterator / Generic Collections', type: 'subtopic' },
            { id: 'da-3', title: 'Date and Time / Regular Expressions', type: 'subtopic' }
          ]
        },
        {
          id: 'io',
          title: 'I/O & Concurrency',
          type: 'topic',
          children: [
            { id: 'io-1', title: 'I/O Operations / File Operations', type: 'subtopic' },
            { id: 'io-2', title: 'Networking / Threads / Concurrency', type: 'subtopic' },
            { id: 'io-3', title: 'Virtual Threads / Java Memory Model', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'fp-tools-sec',
      title: 'Functional Programming & Build Tools',
      type: 'section',
      children: [
        {
          id: 'fp',
          title: 'Functional Prog',
          type: 'topic',
          children: [
            { id: 'fp-1', title: 'High Order Functions / Functional Interfaces', type: 'subtopic' },
            { id: 'fp-2', title: 'Functional Composition / Stream API', type: 'subtopic' }
          ]
        },
        {
          id: 'tools',
          title: 'Build Tools',
          type: 'topic',
          children: [
            { id: 'bt-1', title: 'Maven', type: 'subtopic' },
            { id: 'bt-2', title: 'Gradle / Bazel', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'web-db-sec',
      title: 'Web & Database',
      type: 'section',
      children: [
        {
          id: 'web',
          title: 'Web Frameworks',
          type: 'topic',
          children: [
            { id: 'we-1', title: 'Spring (Spring Boot)', type: 'subtopic' },
            { id: 'we-2', title: 'Quarkus / Javalin / Play', type: 'subtopic' }
          ]
        },
        {
          id: 'db',
          title: 'Database Access',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'JDBC / Spring Data JPA', type: 'subtopic' },
            { id: 'db-2', title: 'Hibernate / EBean', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-log-sec',
      title: 'Testing & Logging',
      type: 'section',
      children: [
        {
          id: 'test',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'JUnit / TestNG / Mockito', type: 'subtopic' },
            { id: 'te-2', title: 'REST Assured / Cucumber / JMeter', type: 'subtopic' }
          ]
        },
        {
          id: 'log',
          title: 'Logging',
          type: 'topic',
          children: [
            { id: 'lo-1', title: 'Logback / Log4j2', type: 'subtopic' },
            { id: 'lo-2', title: 'SLF4J / TinyLog', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Spring Boot Roadmap', type: 'topic', link: { id: 'spring-boot', title: 'Spring Boot' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Android Roadmap', type: 'topic', link: { id: 'android', title: 'Android' } }
      ]
    }
  ]
};
export const javascriptRoadmap = {
  id: 'javascript',
  title: 'JavaScript',
  description: 'Deep dive into the language of the web',
  layout: 'linear',
  category: 'language',
  subscriberCount: '450,000',
  faq: {
    question: 'How much JavaScript do I need before learning React?',
    answer: 'You should be comfortable with ES6+ syntax (arrow functions, destructuring), Promises/async-await, array methods (map, filter, reduce), and basic DOM manipulation.'
  },
  items: [
    {
      id: 'basics-types-sec',
      title: 'Basics & Data Types',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Intro & Variables',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is JS / History / Versions', type: 'subtopic' },
            { id: 'in-2', title: 'How to run / Naming Rules', type: 'subtopic' },
            { id: 'in-3', title: 'var / let / const / Hoisting', type: 'subtopic' },
            { id: 'in-4', title: 'Scopes (Block, Function, Global)', type: 'subtopic' }
          ]
        },
        {
          id: 'types',
          title: 'Data Types & Casting',
          type: 'topic',
          children: [
            { id: 'ty-1', title: 'string / number / boolean / null', type: 'subtopic' },
            { id: 'ty-2', title: 'undefined / bigint / Symbol', type: 'subtopic' },
            { id: 'ty-3', title: 'Implicit / Explicit Type Casting', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-logic-sec',
      title: 'Data Structures & Logic',
      type: 'section',
      children: [
        {
          id: 'structs',
          title: 'Data Structures',
          type: 'topic',
          children: [
            { id: 'ds-1', title: 'Primitive Types / Object / Arrays', type: 'subtopic' },
            { id: 'ds-2', title: 'JSON / Keyed Collections (Map, Set)', type: 'subtopic' },
            { id: 'ds-3', title: 'Weak Map / Weak Set / Typed Arrays', type: 'subtopic' }
          ]
        },
        {
          id: 'equality',
          title: 'Equality Comparisons',
          type: 'topic',
          children: [
            { id: 'eq-1', title: 'Object.is / Equality Algorithms', type: 'subtopic' },
            { id: 'eq-2', title: 'isLooselyEqual / isStrictlyEqual', type: 'subtopic' },
            { id: 'eq-3', title: 'SameValueZero / SameValue', type: 'subtopic' }
          ]
        },
        {
          id: 'flow',
          title: 'Loops & Control Flow',
          type: 'topic',
          children: [
            { id: 'fl-1', title: 'for / while / do...while', type: 'subtopic' },
            { id: 'fl-2', title: 'for...in / for...of / break', type: 'subtopic' },
            { id: 'fl-3', title: 'if...else / Switch / throw', type: 'subtopic' },
            { id: 'fl-4', title: 'try / catch / finally', type: 'subtopic' }
          ]
        },
        {
          id: 'ops',
          title: 'Expressions & Operators',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Assignment / Arithmetic / Logical', type: 'subtopic' },
            { id: 'op-2', title: 'String / Conditional / Comma', type: 'subtopic' },
            { id: 'op-3', title: 'Unary / Comparison / Bitwise', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'funcs-this-sec',
      title: 'Functions & This Keyword',
      type: 'section',
      children: [
        {
          id: 'funcs',
          title: 'Functions',
          type: 'topic',
          children: [
            { id: 'fu-1', title: 'Arrow Functions / IIFEs / args', type: 'subtopic' },
            { id: 'fu-2', title: 'Lexical Scoping / Closures', type: 'subtopic' },
            { id: 'fu-3', title: 'Default Params / Rest / Recursion', type: 'subtopic' }
          ]
        },
        {
          id: 'this',
          title: 'Strict Mode & "this"',
          type: 'topic',
          children: [
            { id: 'th-1', title: 'in a method / in a function / alone', type: 'subtopic' },
            { id: 'th-2', title: 'in event handlers / in arrow functions', type: 'subtopic' },
            { id: 'th-3', title: 'Explicit Binding (call, apply, bind)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'async-apis-sec',
      title: 'Async & Web APIs',
      type: 'section',
      children: [
        {
          id: 'async',
          title: 'Asynchronous JS',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Event Loop / Callbacks / Promises', type: 'subtopic' },
            { id: 'as-2', title: 'async/await / setTimeout / setInterval', type: 'subtopic' }
          ]
        },
        {
          id: 'apis',
          title: 'Working with APIs',
          type: 'topic',
          children: [
            { id: 'ap-1', title: 'XMLHTTPRequest', type: 'subtopic' },
            { id: 'ap-2', title: 'Fetch', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-js-sec',
      title: 'Advanced Concepts',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Adv Objects & Modules',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Prototypal Inheritance / Classes', type: 'subtopic' },
            { id: 'ad-2', title: 'Iterators / Generators', type: 'subtopic' },
            { id: 'ad-3', title: 'Modules (CommonJS, ESM)', type: 'subtopic' }
          ]
        },
        {
          id: 'debug',
          title: 'Memory & Debugging',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'Memory Lifecycle / Garbage Collection', type: 'subtopic' },
            { id: 'de-2', title: 'Using Browser DevTools', type: 'subtopic' },
            { id: 'de-3', title: 'Debugging Memory & Performance', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'React Roadmap', type: 'topic', link: { id: 'react', title: 'React' } },
        { id: 'related-2', title: 'TypeScript Roadmap', type: 'topic', link: { id: 'typescript', title: 'TypeScript' } },
        { id: 'related-3', title: 'Node.js Roadmap', type: 'topic', link: { id: 'nodejs', title: 'Node.js' } }
      ]
    }
  ]
};
export const kotlinRoadmap = {
  id: 'kotlin',
  title: 'Kotlin Developer',
  description: 'Master Kotlin for Android, Server-side, and Multiplatform',
  layout: 'linear',
  category: 'language',
  subscriberCount: '180,000',
  faq: {
    question: 'Is Kotlin just for Android?',
    answer: 'No! While it is the official language for Android, Kotlin is also heavily used for backend (Ktor, Spring) and Kotlin Multiplatform (KMP).'
  },
  items: [
    {
      id: 'basics-sec',
      title: 'Basics & Syntax',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Basics & Syntax',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'val vs var', type: 'subtopic' },
            { id: 'ba-2', title: 'Null Safety (?)', type: 'subtopic' },
            { id: 'ba-3', title: 'Smart Casts', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'oop-functional-sec',
      title: 'OOP & Functional Programming',
      type: 'section',
      children: [
        {
          id: 'paradigm',
          title: 'OOP & Functional',
          type: 'topic',
          children: [
            { id: 'pa-1', title: 'Data Classes & Sealed Classes', type: 'subtopic' },
            { id: 'pa-2', title: 'Extension Functions', type: 'subtopic' },
            { id: 'pa-3', title: 'High-Order Functions & Lambdas', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'coroutines-sec',
      title: 'Coroutines & Flow',
      type: 'section',
      children: [
        {
          id: 'async',
          title: 'Coroutines & Flow',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Suspend Functions', type: 'subtopic' },
            { id: 'as-2', title: 'Dispatchers & Scopes', type: 'subtopic' },
            { id: 'as-3', title: 'StateFlow / SharedFlow', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'multiplatform-sec',
      title: 'Kotlin Multiplatform',
      type: 'section',
      children: [
        {
          id: 'kmp',
          title: 'Kotlin Multiplatform',
          type: 'topic',
          children: [
            { id: 'km-1', title: 'KMP Basics', type: 'subtopic' },
            { id: 'km-2', title: 'Compose Multiplatform', type: 'subtopic' },
            { id: 'km-3', title: 'Shared Business Logic', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'backend-sec',
      title: 'Server-Side Kotlin',
      type: 'section',
      children: [
        {
          id: 'backend',
          title: 'Server-Side Kotlin',
          type: 'topic',
          children: [
            { id: 'be-1', title: 'Ktor Framework', type: 'subtopic' },
            { id: 'be-2', title: 'Spring Boot with Kotlin', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Android Roadmap', type: 'topic', link: { id: 'android', title: 'Android' } },
        { id: 'related-2', title: 'Java Roadmap', type: 'topic', link: { id: 'java', title: 'Java' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const kubernetesRoadmap = {
  id: 'kubernetes',
  title: 'Kubernetes',
  description: 'Master container orchestration and cluster management',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '190,000',
  faq: {
    question: 'Do I need to know Docker first?',
    answer: 'Yes! Kubernetes is a container orchestration tool. You must understand how containers (like Docker) work before learning Kubernetes.'
  },
  items: [
    {
      id: 'overview-setup-sec',
      title: 'Overview & Setup',
      type: 'section',
      children: [
        {
          id: 'overview',
          title: 'Overview & Setup',
          type: 'topic',
          children: [
            { id: 'ov-1', title: 'Why use Kubernetes? / Key Concepts', type: 'subtopic' },
            { id: 'ov-2', title: 'Alternatives / Deploying First App (Containers)', type: 'subtopic' },
            { id: 'ov-3', title: 'Managed Provider / Local Cluster', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'workloads-networking-sec',
      title: 'Workloads & Networking',
      type: 'section',
      children: [
        {
          id: 'work',
          title: 'Workloads & Pods',
          type: 'topic',
          children: [
            { id: 'wo-1', title: 'Pods / ReplicaSets / Deployments', type: 'subtopic' },
            { id: 'wo-2', title: 'StatefulSets / DaemonSets / Jobs', type: 'subtopic' }
          ]
        },
        {
          id: 'net',
          title: 'Services & Networking',
          type: 'topic',
          children: [
            { id: 'ne-1', title: 'External Access / Load Balancing', type: 'subtopic' },
            { id: 'ne-2', title: 'Networking & Pod-to-Pod Communication', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'config-storage-sec',
      title: 'Config & Storage',
      type: 'section',
      children: [
        {
          id: 'config',
          title: 'Config & Security',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'ConfigMaps / Secrets / RBAC', type: 'subtopic' },
            { id: 'co-2', title: 'Network / Container Security', type: 'subtopic' }
          ]
        },
        {
          id: 'storage',
          title: 'Storage & Resources',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Storage & Volumes / CSI Drivers', type: 'subtopic' },
            { id: 'st-2', title: 'Resource Requests & Limits', type: 'subtopic' },
            { id: 'st-3', title: 'Assigning Quotas / Resource Usage', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'monitoring-autoscaling-sec',
      title: 'Monitoring & Scaling',
      type: 'section',
      children: [
        {
          id: 'mon',
          title: 'Monitoring & Scaling',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Logs / Metrics / Traces', type: 'subtopic' },
            { id: 'mo-2', title: 'HPA / VPA / Cluster Autoscaling', type: 'subtopic' }
          ]
        },
        {
          id: 'sched',
          title: 'Scheduling',
          type: 'topic',
          children: [
            { id: 'sc-1', title: 'Taints and Tolerations', type: 'subtopic' },
            { id: 'sc-2', title: 'Pod Priorities / Evictions', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-cicd-sec',
      title: 'Advanced & CI/CD',
      type: 'section',
      children: [
        {
          id: 'cicd',
          title: 'CI / CD & Patterns',
          type: 'topic',
          children: [
            { id: 'ci-1', title: 'GitOps / Helm Charts', type: 'subtopic' },
            { id: 'ci-2', title: 'Canary / Blue-Green / Rolling Updates', type: 'subtopic' }
          ]
        },
        {
          id: 'ops',
          title: 'Ops & Advanced',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Cluster Operations / Control Plane', type: 'subtopic' },
            { id: 'op-2', title: 'Multi-Cluster / CRDs / Extensions', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-2', title: 'Docker Roadmap', type: 'topic', link: { id: 'docker', title: 'Docker' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const laravelRoadmap = {
  id: 'laravel',
  title: 'Laravel Developer',
  description: 'Master PHP\'s most popular full-stack web framework',
  layout: 'linear',
  category: 'framework',
  subscriberCount: '165,000',
  faq: {
    question: 'Should I learn PHP before Laravel?',
    answer: 'Yes, having a solid understanding of PHP fundamentals and Object-Oriented Programming (OOP) is crucial before diving into Laravel.'
  },
  items: [
    {
      id: 'routing-mvc-sec',
      title: 'Routing & MVC',
      type: 'section',
      children: [
        {
          id: 'mvc',
          title: 'Routing & MVC',
          type: 'topic',
          children: [
            { id: 'mv-1', title: 'Web & API Routes', type: 'subtopic' },
            { id: 'mv-2', title: 'Controllers & Middleware', type: 'subtopic' },
            { id: 'mv-3', title: 'Requests & Responses', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'db-eloquent-sec',
      title: 'Database & Eloquent',
      type: 'section',
      children: [
        {
          id: 'db',
          title: 'Database & Eloquent',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'Migrations & Seeders', type: 'subtopic' },
            { id: 'db-2', title: 'Eloquent ORM (Models)', type: 'subtopic' },
            { id: 'db-3', title: 'Relationships (1:1, 1:N, N:M)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'views-blade-sec',
      title: 'Views & Blade',
      type: 'section',
      children: [
        {
          id: 'views',
          title: 'Views & Blade',
          type: 'topic',
          children: [
            { id: 'vi-1', title: 'Blade Templating', type: 'subtopic' },
            { id: 'vi-2', title: 'Components & Layouts', type: 'subtopic' },
            { id: 'vi-3', title: 'Form Validation', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'security-auth-sec',
      title: 'Security & Auth',
      type: 'section',
      children: [
        {
          id: 'sec',
          title: 'Security & Auth',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Authentication (Breeze / Jetstream)', type: 'subtopic' },
            { id: 'se-2', title: 'Authorization (Gates / Policies)', type: 'subtopic' },
            { id: 'se-3', title: 'CSRF & XSS Protection', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-concepts-sec',
      title: 'Advanced Concepts',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced Concepts',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Artisan Console', type: 'subtopic' },
            { id: 'ad-2', title: 'Queues & Jobs', type: 'subtopic' },
            { id: 'ad-3', title: 'Events & Listeners', type: 'subtopic' },
            { id: 'ad-4', title: 'Task Scheduling', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'PHP Roadmap', type: 'topic', link: { id: 'php', title: 'PHP' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Full Stack Roadmap', type: 'topic', link: { id: 'full-stack', title: 'Full Stack' } }
      ]
    }
  ]
};
export const leetcodeRoadmap = {
  id: 'leetcode',
  title: 'LeetCode & Interview Prep',
  description: 'Master Data Structures and Algorithms for coding interviews',
  layout: 'linear',
  category: 'skill',
  subscriberCount: '500,000',
  faq: {
    question: 'How many problems should I solve?',
    answer: 'Quality over quantity. Focus on learning patterns (like Sliding Window, Two Pointers) rather than blindly solving 1000 problems.'
  },
  items: [
    {
      id: 'arrays-hashing-sec',
      title: 'Arrays & Hashing',
      type: 'section',
      children: [
        {
          id: 'arrays',
          title: 'Arrays & Hashing',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Two Sum', type: 'subtopic' },
            { id: 'ar-2', title: 'Valid Anagram', type: 'subtopic' },
            { id: 'ar-3', title: 'Top K Frequent Elements', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'pointers-windows-sec',
      title: 'Pointers & Windows',
      type: 'section',
      children: [
        {
          id: 'pointers',
          title: 'Two Pointers & Window',
          type: 'topic',
          children: [
            { id: 'pt-1', title: 'Valid Palindrome', type: 'subtopic' },
            { id: 'pt-2', title: 'Container With Most Water', type: 'subtopic' },
            { id: 'pt-3', title: 'Longest Substring', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'stack-bs-sec',
      title: 'Stack & Binary Search',
      type: 'section',
      children: [
        {
          id: 'stack_bs',
          title: 'Stack & Binary Search',
          type: 'topic',
          children: [
            { id: 'sb-1', title: 'Valid Parentheses', type: 'subtopic' },
            { id: 'sb-2', title: 'Daily Temperatures', type: 'subtopic' },
            { id: 'sb-3', title: 'Search in Rotated Array', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'trees-graphs-sec',
      title: 'Trees & Graphs',
      type: 'section',
      children: [
        {
          id: 'trees',
          title: 'Trees & Graphs',
          type: 'topic',
          children: [
            { id: 'tr-1', title: 'Invert Binary Tree', type: 'subtopic' },
            { id: 'tr-2', title: 'Number of Islands (DFS/BFS)', type: 'subtopic' },
            { id: 'tr-3', title: 'Course Schedule (Topological)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'dp-sec',
      title: 'Dynamic Programming',
      type: 'section',
      children: [
        {
          id: 'dp',
          title: 'Dynamic Programming',
          type: 'topic',
          children: [
            { id: 'dp-1', title: 'Climbing Stairs', type: 'subtopic' },
            { id: 'dp-2', title: 'Coin Change', type: 'subtopic' },
            { id: 'dp-3', title: 'Longest Common Subsequence', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DSA Roadmap', type: 'topic', link: { id: 'datastructures-and-algorithms', title: 'DSA' } },
        { id: 'related-2', title: 'Computer Science Roadmap', type: 'topic', link: { id: 'computer-science', title: 'Computer Science' } }
      ]
    }
  ]
};
export const linuxRoadmap = {
  id: 'linux',
  title: 'Linux',
  description: 'Master the operating system that powers the internet',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '280,000',
  faq: {
    question: 'Why learn Linux?',
    answer: 'Almost all servers, containers, and cloud infrastructure run on Linux. Knowing how to navigate and manage it is essential for Backend, DevOps, and Data engineers.'
  },
  items: [
    {
      id: 'basics-sec',
      title: 'Basics & Shell',
      type: 'section',
      children: [
        {
          id: 'shell',
          title: 'Shell and Other Basics',
          type: 'topic',
          children: [
            { id: 'sh-1', title: 'Basic Commands / Nav Basics / Dir Hierarchy', type: 'subtopic' },
            { id: 'sh-2', title: 'Command Help / Super User / Command Path', type: 'subtopic' },
            { id: 'sh-3', title: 'Env Variables / stdout, stdin, stderr / Redirects', type: 'subtopic' },
            { id: 'sh-4', title: 'Literals / Variables / Loops / Conditionals', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'files-editing-sec',
      title: 'Files & Editing',
      type: 'section',
      children: [
        {
          id: 'files',
          title: 'Working with Files',
          type: 'topic',
          children: [
            { id: 'fi-1', title: 'Creating & Deleting Files / Dirs', type: 'subtopic' },
            { id: 'fi-2', title: 'Moving / Copying / Renaming', type: 'subtopic' },
            { id: 'fi-3', title: 'File Permissions / Soft & Hard Links', type: 'subtopic' },
            { id: 'fi-4', title: 'Inodes / Filesystems', type: 'subtopic' }
          ]
        },
        {
          id: 'edit',
          title: 'Editing Files',
          type: 'topic',
          children: [
            { id: 'ed-1', title: 'Vim', type: 'subtopic' },
            { id: 'ed-2', title: 'Nano', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'processing-mgmt-sec',
      title: 'Processing & Management',
      type: 'section',
      children: [
        {
          id: 'text',
          title: 'Text Processing',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'cut / paste / sort / tr', type: 'subtopic' },
            { id: 'te-2', title: 'head / tail / join / split / pipe', type: 'subtopic' },
            { id: 'te-3', title: 'tee / nl / wc / expand / unexpand', type: 'subtopic' },
            { id: 'te-4', title: 'uniq / grep / awk', type: 'subtopic' }
          ]
        },
        {
          id: 'proc',
          title: 'Process Management',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Background & Foreground', type: 'subtopic' },
            { id: 'pr-2', title: 'Listing / Finding Processes', type: 'subtopic' },
            { id: 'pr-3', title: 'Killing Processes / Signals', type: 'subtopic' },
            { id: 'pr-4', title: 'Priorities / Forking', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'user-system-sec',
      title: 'User & System',
      type: 'section',
      children: [
        {
          id: 'user',
          title: 'User & Server Mgmt',
          type: 'topic',
          children: [
            { id: 'us-1', title: 'Create / Delete / Update Users & Groups', type: 'subtopic' },
            { id: 'us-2', title: 'Managing Permissions', type: 'subtopic' },
            { id: 'us-3', title: 'Server Review: Uptime / Load / Auth Logs', type: 'subtopic' },
            { id: 'us-4', title: 'Services Running / Memory / Disk / Logs', type: 'subtopic' }
          ]
        },
        {
          id: 'system',
          title: 'Service & Disks',
          type: 'topic',
          children: [
            { id: 'sy-1', title: 'Service Management (systemd)', type: 'subtopic' },
            { id: 'sy-2', title: 'Creating / Starting / Stopping / Status', type: 'subtopic' },
            { id: 'sy-3', title: 'Disks & Filesystems: Mounts / LVM', type: 'subtopic' },
            { id: 'sy-4', title: 'Adding Disks / Swap', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'network-packages-sec',
      title: 'Networking & Packages',
      type: 'section',
      children: [
        {
          id: 'net',
          title: 'Networking',
          type: 'topic',
          children: [
            { id: 'ne-1', title: 'TCP/IP Stack / Subnetting / Ethernet', type: 'subtopic' },
            { id: 'ne-2', title: 'DHCP / IP Routing / DNS Resolution', type: 'subtopic' },
            { id: 'ne-3', title: 'Netfilter / SSH / File Transfer / ICMP', type: 'subtopic' },
            { id: 'ne-4', title: 'ping / traceroute / netstat / Packet Analysis', type: 'subtopic' }
          ]
        },
        {
          id: 'pkg',
          title: 'Packages & Misc',
          type: 'topic',
          children: [
            { id: 'pk-1', title: 'Package Repositories / Snap / Install', type: 'subtopic' },
            { id: 'pk-2', title: 'Archiving and Compressing / Logs', type: 'subtopic' },
            { id: 'pk-3', title: 'Booting Linux / Boot Loaders', type: 'subtopic' },
            { id: 'pk-4', title: 'Debugging: Troubleshooting', type: 'subtopic' },
            { id: 'pk-5', title: 'Containerization (ulimits, cgroups, Docker)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-2', title: 'Docker Roadmap', type: 'topic', link: { id: 'docker', title: 'Docker' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const machineLearningRoadmap = {
  id: 'machine-learning',
  title: 'Machine Learning',
  description: 'Master the algorithms and models that power modern AI',
  layout: 'linear',
  category: 'role',
  subscriberCount: '410,000',
  faq: {
    question: 'How much math do I need?',
    answer: 'A strong foundation in Linear Algebra, Calculus, and Statistics is essential for understanding how ML models actually work under the hood.'
  },
  items: [
    {
      id: 'intro-math-sec',
      title: 'Introduction & Math',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is an ML Engineer? / vs AI Eng', type: 'subtopic' },
            { id: 'in-2', title: 'Skills and Responsibilities', type: 'subtopic' },
            { id: 'in-3', title: 'Types of Machine Learning', type: 'subtopic' }
          ]
        },
        {
          id: 'math',
          title: 'Mathematical Foundations',
          type: 'topic',
          children: [
            { id: 'ma-1', title: 'Calculus (Derivatives, Gradient)', type: 'subtopic' },
            { id: 'ma-2', title: 'Linear Algebra (Matrices, Vectors)', type: 'subtopic' },
            { id: 'ma-3', title: 'Probability (Bayes, Distributions)', type: 'subtopic' },
            { id: 'ma-4', title: 'Statistics / Discrete Mathematics', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'prog-data-sec',
      title: 'Programming & Data',
      type: 'section',
      children: [
        {
          id: 'prog',
          title: 'Programming',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Python (OOP, Data Structures)', type: 'subtopic' },
            { id: 'pr-2', title: 'Numpy / Pandas / Matplotlib', type: 'subtopic' },
            { id: 'pr-3', title: 'Databases (SQL, No-SQL)', type: 'subtopic' }
          ]
        },
        {
          id: 'data-prep',
          title: 'Data Collection & Prep',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'Sources (APIs) / Formats (CSV, JSON)', type: 'subtopic' },
            { id: 'da-2', title: 'Cleaning / Preprocessing Techniques', type: 'subtopic' },
            { id: 'da-3', title: 'Feature Engineering / Scaling', type: 'subtopic' },
            { id: 'da-4', title: 'Train - Test Data', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ml-models-sec',
      title: 'Machine Learning Models',
      type: 'section',
      children: [
        {
          id: 'sup',
          title: 'Supervised Learning',
          type: 'topic',
          children: [
            { id: 'su-1', title: 'Classification (KNN, SVM, Trees)', type: 'subtopic' },
            { id: 'su-2', title: 'Regression (Linear, Ridge, Lasso)', type: 'subtopic' }
          ]
        },
        {
          id: 'unsup',
          title: 'Unsupervised & RL',
          type: 'topic',
          children: [
            { id: 'un-1', title: 'Clustering (K-Means, Hierarchical)', type: 'subtopic' },
            { id: 'un-2', title: 'Dimensionality Reduction (PCA)', type: 'subtopic' },
            { id: 'un-3', title: 'Reinforcement Learning (Q-Learning)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'eval-dl-sec',
      title: 'Evaluation & Deep Learning',
      type: 'section',
      children: [
        {
          id: 'eval',
          title: 'Model Evaluation',
          type: 'topic',
          children: [
            { id: 'ev-1', title: 'Metrics (Accuracy, F1-Score, ROC)', type: 'subtopic' },
            { id: 'ev-2', title: 'Validation (K-Fold CV)', type: 'subtopic' },
            { id: 'ev-3', title: 'Model Selection / Tuning', type: 'subtopic' }
          ]
        },
        {
          id: 'dl',
          title: 'Deep Learning',
          type: 'topic',
          children: [
            { id: 'dl-1', title: 'NN Basics (Perceptron, Backprop)', type: 'subtopic' },
            { id: 'dl-2', title: 'Activation / Loss Functions', type: 'subtopic' },
            { id: 'dl-3', title: 'Libraries (TensorFlow, PyTorch)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'arch-adv-sec',
      title: 'Architectures & Advanced',
      type: 'section',
      children: [
        {
          id: 'arch',
          title: 'DL Architectures',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'CNNs (Convolution, Pooling)', type: 'subtopic' },
            { id: 'ar-2', title: 'RNNs (GRU, LSTM)', type: 'subtopic' },
            { id: 'ar-3', title: 'Attention & Transformers', type: 'subtopic' }
          ]
        },
        {
          id: 'adv',
          title: 'Advanced Concepts',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'NLP (Tokenization, Embeddings)', type: 'subtopic' },
            { id: 'ad-2', title: 'Autoencoders / GANs', type: 'subtopic' },
            { id: 'ad-3', title: 'Explainable AI', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AI Engineer Roadmap', type: 'topic', link: { id: 'ai-engineer', title: 'AI Engineer' } },
        { id: 'related-2', title: 'Python Roadmap', type: 'topic', link: { id: 'python', title: 'Python' } },
        { id: 'related-3', title: 'MLOps Roadmap', type: 'topic', link: { id: 'mlops', title: 'MLOps' } }
      ]
    }
  ]
};
export const mlopsRoadmap = {
  id: 'mlops',
  title: 'MLOps Engineer',
  description: 'Bridge Machine Learning with DevOps for scalable AI deployments',
  layout: 'linear',
  category: 'role',
  subscriberCount: '130,000',
  faq: {
    question: 'How is MLOps different from DevOps?',
    answer: 'While DevOps focuses on code versioning and CI/CD, MLOps adds the complexities of versioning massive datasets, tracking model experiments, and monitoring models for concept drift in production.'
  },
  items: [
    {
      id: 'data-versioning-sec',
      title: 'Data & Versioning',
      type: 'section',
      children: [
        {
          id: 'data',
          title: 'Data Versioning',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'DVC (Data Version Control)', type: 'subtopic' },
            { id: 'da-2', title: 'Feature Stores (Feast)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tracking-sec',
      title: 'Experiment Tracking',
      type: 'section',
      children: [
        {
          id: 'tracking',
          title: 'Experiment Tracking',
          type: 'topic',
          children: [
            { id: 'tr-1', title: 'MLflow', type: 'subtopic' },
            { id: 'tr-2', title: 'Weights & Biases (W&B)', type: 'subtopic' },
            { id: 'tr-3', title: 'Model Registry', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'pipelines-sec',
      title: 'Pipelines & Orchestration',
      type: 'section',
      children: [
        {
          id: 'pipelines',
          title: 'ML Pipelines & Orchestration',
          type: 'topic',
          children: [
            { id: 'pi-1', title: 'Kubeflow', type: 'subtopic' },
            { id: 'pi-2', title: 'Apache Airflow', type: 'subtopic' },
            { id: 'pi-3', title: 'Metaflow', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'serving-sec',
      title: 'Model Serving',
      type: 'section',
      children: [
        {
          id: 'serving',
          title: 'Model Serving',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'FastAPI / Flask', type: 'subtopic' },
            { id: 'se-2', title: 'TensorFlow Serving', type: 'subtopic' },
            { id: 'se-3', title: 'Triton Inference Server', type: 'subtopic' },
            { id: 'se-4', title: 'ONNX', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'monitoring-sec',
      title: 'Monitoring & Drift',
      type: 'section',
      children: [
        {
          id: 'monitor',
          title: 'Monitoring & Drift',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Data Drift & Concept Drift', type: 'subtopic' },
            { id: 'mo-2', title: 'Prometheus & Grafana', type: 'subtopic' },
            { id: 'mo-3', title: 'Evidently AI', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-2', title: 'Machine Learning Roadmap', type: 'topic', link: { id: 'machine-learning', title: 'Machine Learning' } },
        { id: 'related-3', title: 'Python Roadmap', type: 'topic', link: { id: 'python', title: 'Python' } }
      ]
    }
  ]
};
export const mongodbRoadmap = {
  id: 'mongodb',
  title: 'MongoDB',
  description: 'Master the most popular document-based NoSQL database',
  layout: 'linear',
  category: 'database',
  subscriberCount: '190,000',
  faq: {
    question: 'When should I use MongoDB over SQL?',
    answer: 'MongoDB excels when you have unstructured data, rapid iteration cycles where schemas change frequently, or need to scale horizontally quickly.'
  },
  items: [
    {
      id: 'basics-model-sec',
      title: 'Basics & Data Model',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'MongoDB Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'What is MongoDB? / MongoDB Atlas', type: 'subtopic' },
            { id: 'ba-2', title: 'When to use? / Terminology', type: 'subtopic' },
            { id: 'ba-3', title: 'SQL vs NoSQL', type: 'subtopic' }
          ]
        },
        {
          id: 'model',
          title: 'Data Model & Data Types',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Embedded Objects & Arrays', type: 'subtopic' },
            { id: 'mo-2', title: 'String / Double / Array / Object / Binary Data', type: 'subtopic' },
            { id: 'mo-3', title: 'Undefined / Object ID / Boolean', type: 'subtopic' },
            { id: 'mo-4', title: 'Date / Null / Regular Expression / Symbol', type: 'subtopic' },
            { id: 'mo-5', title: 'JavaScript / Int64 / Int32 / Timestamp / Decimal128', type: 'subtopic' },
            { id: 'mo-6', title: 'Min Key / Max Key / Counting Documents', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'collections-query-sec',
      title: 'Collections & Queries',
      type: 'section',
      children: [
        {
          id: 'coll',
          title: 'Collections & Methods',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'insert() / find()', type: 'subtopic' },
            { id: 'co-2', title: 'update() / delete()', type: 'subtopic' },
            { id: 'co-3', title: 'bulkWrite() / validate()', type: 'subtopic' }
          ]
        },
        {
          id: 'query',
          title: 'Query Operators',
          type: 'topic',
          children: [
            { id: 'qu-1', title: 'Cursors / Array Operators', type: 'subtopic' },
            { id: 'qu-2', title: 'Projection ($in, $nin, $all, $project, $include, $elemMatch, $slice)', type: 'subtopic' },
            { id: 'qu-3', title: 'Element ($exists, $type) / Logical ($and, $or, $not)', type: 'subtopic' },
            { id: 'qu-4', title: 'Comparison ($eq, $gt, $lt, $regex, $lte, $gte, $ne)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'indexing-aggregation-sec',
      title: 'Indexing & Aggregation',
      type: 'section',
      children: [
        {
          id: 'index',
          title: 'Indexing & Concepts',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Creating Indexes (Single, Compound, Text, Expiring, Geospatial)', type: 'subtopic' },
            { id: 'in-2', title: 'Atlas Search Indexes', type: 'subtopic' },
            { id: 'in-3', title: 'Read / Write Concerns', type: 'subtopic' },
            { id: 'in-4', title: 'Retryable Reads / Writes', type: 'subtopic' }
          ]
        },
        {
          id: 'agg',
          title: 'Aggregation',
          type: 'topic',
          children: [
            { id: 'ag-1', title: 'Pipelines, Stages and Operators', type: 'subtopic' },
            { id: 'ag-2', title: '$match / $group / $sort / $project', type: 'subtopic' },
            { id: 'ag-3', title: '$skip / $limit / $unwind / $lookup / $sum', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tools-optimization-sec',
      title: 'Ecosystem & Performance',
      type: 'section',
      children: [
        {
          id: 'tools',
          title: 'Ecosystem',
          type: 'topic',
          children: [
            { id: 'to-1', title: 'Language Drivers / Developer Tools', type: 'subtopic' },
            { id: 'to-2', title: 'MongoDB Connectors (Kafka, Spark)', type: 'subtopic' }
          ]
        },
        {
          id: 'opt',
          title: 'Performance & Tuning',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Query Optimization', type: 'subtopic' },
            { id: 'op-2', title: 'Transactions', type: 'subtopic' },
            { id: 'op-3', title: 'Tuning Configuration (Indexing)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'scaling-security-sec',
      title: 'Scaling & Security',
      type: 'section',
      children: [
        {
          id: 'scale',
          title: 'Scaling MongoDB',
          type: 'topic',
          children: [
            { id: 'sc-1', title: 'Replicasets / Sharded Clusters', type: 'subtopic' },
            { id: 'sc-2', title: 'Backup & Recovery (mongodump, mongorestore)', type: 'subtopic' }
          ]
        },
        {
          id: 'sec',
          title: 'MongoDB Security',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'RBAC / X.509 Cert Auth / LDAP Proxy', type: 'subtopic' },
            { id: 'se-2', title: 'Encryption at Rest / TLS / SSL', type: 'subtopic' },
            { id: 'se-3', title: 'Queryable Encryption / Audit / Client-Side Field Level', type: 'subtopic' },
            { id: 'se-4', title: 'Kerberos Authentication', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Node.js Roadmap', type: 'topic', link: { id: 'nodejs', title: 'Node.js' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Full Stack Roadmap', type: 'topic', link: { id: 'full-stack', title: 'Full Stack' } }
      ]
    }
  ]
};
export const networkEngineerRoadmap = {
  id: 'network-engineer',
  title: 'Network Engineer',
  description: 'Master the infrastructure that connects the digital world',
  layout: 'linear',
  category: 'role',
  subscriberCount: '150,000',
  faq: {
    question: 'Are certifications necessary?',
    answer: 'In networking, certifications like CCNA and CompTIA Network+ are highly valued and often required by employers to prove practical knowledge.'
  },
  items: [
    {
      id: 'intro-models-sec',
      title: 'Introduction & Models',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Basic Terminology (Client, Host, Port)', type: 'subtopic' },
            { id: 'in-2', title: 'How does the Internet Work?', type: 'subtopic' },
            { id: 'in-3', title: 'Network Types (LAN, WAN, VPN)', type: 'subtopic' },
            { id: 'in-4', title: 'Client-Server vs Peer-to-Peer', type: 'subtopic' }
          ]
        },
        {
          id: 'models',
          title: 'Network Models',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'OSI Model (7 Layers)', type: 'subtopic' },
            { id: 'mo-2', title: 'TCP/IP Model', type: 'subtopic' },
            { id: 'mo-3', title: 'Core Protocols (HTTP, SSH, DHCP)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ip-routing-sec',
      title: 'IP & Routing',
      type: 'section',
      children: [
        {
          id: 'ip',
          title: 'IP Addressing',
          type: 'topic',
          children: [
            { id: 'ip-1', title: 'IPv4 vs IPv6 / Subnet Masks', type: 'subtopic' },
            { id: 'ip-2', title: 'Public vs Private Addresses', type: 'subtopic' },
            { id: 'ip-3', title: 'Subnetting (CIDR, VLSM)', type: 'subtopic' }
          ]
        },
        {
          id: 'routing',
          title: 'Routing & Switching',
          type: 'topic',
          children: [
            { id: 'ro-1', title: 'Static vs Dynamic / Default Gateway', type: 'subtopic' },
            { id: 'ro-2', title: 'Routing Protocols (BGP, OSPF)', type: 'subtopic' },
            { id: 'ro-3', title: 'VLANs / STP / MAC Tables', type: 'subtopic' },
            { id: 'ro-4', title: 'Network Devices (Routers, Switches)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'services-wireless-sec',
      title: 'Services & Wireless',
      type: 'section',
      children: [
        {
          id: 'serv',
          title: 'Network Services',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'DNS Servers / DNS Providers', type: 'subtopic' },
            { id: 'se-2', title: 'Load Balancer (Round Robin, Failover)', type: 'subtopic' },
            { id: 'se-3', title: 'QoS (Traffic shaping, Prioritization)', type: 'subtopic' }
          ]
        },
        {
          id: 'wireless',
          title: 'Wireless Networking',
          type: 'topic',
          children: [
            { id: 'wi-1', title: 'WiFi Standards / Access Points', type: 'subtopic' },
            { id: 'wi-2', title: 'Bluetooth / Hotspot / Mobile Networks', type: 'subtopic' },
            { id: 'wi-3', title: 'Wireless Security (WPA vs WPS)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'security-obs-sec',
      title: 'Security & Observability',
      type: 'section',
      children: [
        {
          id: 'sec',
          title: 'Network Security',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Encryption / DoS & DDoS / IDS & IPS', type: 'subtopic' },
            { id: 'se-2', title: 'Firewalls (Stateful, Proxy, WAF)', type: 'subtopic' },
            { id: 'se-3', title: 'VPNs (IPSec, SSL, Site-to-Site)', type: 'subtopic' },
            { id: 'se-4', title: 'Zero Trust Architecture', type: 'subtopic' }
          ]
        },
        {
          id: 'obs',
          title: 'Observability',
          type: 'topic',
          children: [
            { id: 'ob-1', title: 'Wireshark / Nmap', type: 'subtopic' },
            { id: 'ob-2', title: 'NetFlow / sFlow', type: 'subtopic' },
            { id: 'ob-3', title: 'SNMP', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-2', title: 'Cyber Security Roadmap', type: 'topic', link: { id: 'cyber-security', title: 'Cyber Security' } },
        { id: 'related-3', title: 'AWS Roadmap', type: 'topic', link: { id: 'aws', title: 'AWS' } }
      ]
    }
  ]
};
export const nextjsRoadmap = {
  id: 'nextjs',
  title: 'Next.js',
  description: 'Master the React framework for production-grade web applications',
  layout: 'linear',
  category: 'framework',
  subscriberCount: '210,000',
  faq: {
    question: 'Should I learn App Router or Pages Router?',
    answer: 'The App Router is the modern standard for Next.js. Focus your learning there, as it leverages React Server Components.'
  },
  items: [
    {
      id: 'intro-routing-sec',
      title: 'Introduction & Routing',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Why Next.js / Next.js vs Remix', type: 'subtopic' },
            { id: 'in-2', title: 'Why Frontend Frameworks / Why React', type: 'subtopic' },
            { id: 'in-3', title: 'SPA vs SSR (SSR, SPA, CSR, SSG)', type: 'subtopic' }
          ]
        },
        {
          id: 'routing',
          title: 'Routing',
          type: 'topic',
          children: [
            { id: 'ro-1', title: 'Routing Basics / Terminology / Types', type: 'subtopic' },
            { id: 'ro-2', title: 'Rendering Pages / Parallel Routes / Intercepting', type: 'subtopic' },
            { id: 'ro-3', title: 'Loading and Streaming / Routing Patterns', type: 'subtopic' },
            { id: 'ro-4', title: 'API Endpoints / Cookies / Static vs Dynamic', type: 'subtopic' },
            { id: 'ro-5', title: 'Middleware / Redirects', type: 'subtopic' },
            { id: 'ro-6', title: 'Pages / App (Why App Router, Layouts, Errors)', type: 'subtopic' },
            { id: 'ro-7', title: 'Structuring Routes / Headers / i18n', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-rendering-sec',
      title: 'Data & Rendering',
      type: 'section',
      children: [
        {
          id: 'data',
          title: 'Working with data',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'Fetching Locations (Client, Server)', type: 'subtopic' },
            { id: 'da-2', title: 'Handling Sensitive Data / Server Actions', type: 'subtopic' },
            { id: 'da-3', title: 'Parallel vs Sequential / Preloading Data', type: 'subtopic' },
            { id: 'da-4', title: 'Caching Data / Memoization / React Cache', type: 'subtopic' },
            { id: 'da-5', title: 'Revalidating Cached Data / Errors', type: 'subtopic' }
          ]
        },
        {
          id: 'rend',
          title: 'Rendering',
          type: 'topic',
          children: [
            { id: 're-1', title: 'Runtimes and Types', type: 'subtopic' },
            { id: 're-2', title: 'Node.js / Edge', type: 'subtopic' },
            { id: 're-3', title: 'Client Rendered / Server Rendered', type: 'subtopic' },
            { id: 're-4', title: 'Composition / Runtimes', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'optimizations-config-sec',
      title: 'Optimizations & Config',
      type: 'section',
      children: [
        {
          id: 'opt',
          title: 'Optimizations',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Global CSS / CSS Modules / Tailwind / Sass', type: 'subtopic' },
            { id: 'op-2', title: 'CSS in JS / Images / Videos / Fonts', type: 'subtopic' },
            { id: 'op-3', title: 'Metadata / Lazy Loading / Analytics', type: 'subtopic' },
            { id: 'op-4', title: 'Instrumentation / Script / 3rd Party', type: 'subtopic' },
            { id: 'op-5', title: 'Static Assets / Markdown and MDX', type: 'subtopic' }
          ]
        },
        {
          id: 'config',
          title: 'Configuring',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'TypeScript / ESLint / Prettier', type: 'subtopic' },
            { id: 'co-2', title: 'Setting things Up / Env Variables', type: 'subtopic' },
            { id: 'co-3', title: 'OpenTelemetry / Package Bundling', type: 'subtopic' },
            { id: 'co-4', title: 'Memory Usage / Preparing for Prod', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'deploy-testing-sec',
      title: 'Deployment & Testing',
      type: 'section',
      children: [
        {
          id: 'deploy',
          title: 'Deployment',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'Node.js Server / Docker Container', type: 'subtopic' },
            { id: 'de-2', title: 'Static Export / Deployment Options', type: 'subtopic' },
            { id: 'de-3', title: 'Adapters / Custom Server', type: 'subtopic' }
          ]
        },
        {
          id: 'test',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Testing Frameworks (Vitest, Jest)', type: 'subtopic' },
            { id: 'te-2', title: 'Playwright', type: 'subtopic' },
            { id: 'te-3', title: 'Cypress', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'React Roadmap', type: 'topic', link: { id: 'react', title: 'React' } },
        { id: 'related-2', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-3', title: 'JavaScript Roadmap', type: 'topic', link: { id: 'javascript', title: 'JavaScript' } }
      ]
    }
  ]
};
export const nodejsRoadmap = {
  id: 'nodejs',
  title: 'Node.js',
  description: 'Master backend development using JavaScript outside the browser',
  layout: 'linear',
  category: 'role',
  subscriberCount: '320,000',
  faq: {
    question: 'Should I learn Express or NestJS?',
    answer: 'Start with Express.js to understand the fundamentals of routing and middleware. Then, move to NestJS when you need structure for large enterprise applications.'
  },
  items: [
    {
      id: 'intro-npm-sec',
      title: 'Introduction & Package Management',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction & Modules',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What/Why Node.js? / History', type: 'subtopic' },
            { id: 'in-2', title: 'Node.js vs Browser / Running Code', type: 'subtopic' },
            { id: 'in-3', title: 'Modules (CommonJS, ESM)', type: 'subtopic' }
          ]
        },
        {
          id: 'npm',
          title: 'NPM & Env Vars',
          type: 'topic',
          children: [
            { id: 'np-1', title: 'npx / Global vs Local Install / SemVer', type: 'subtopic' },
            { id: 'np-2', title: 'Packages (Install, Update, Create)', type: 'subtopic' },
            { id: 'np-3', title: 'npm workspaces / Scripts', type: 'subtopic' },
            { id: 'np-4', title: 'Env Vars (process.env, dotenv)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'async-files-sec',
      title: 'Async & File System',
      type: 'section',
      children: [
        {
          id: 'async',
          title: 'Async & Error Handling',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Promises / async-await / Callbacks', type: 'subtopic' },
            { id: 'as-2', title: 'Timers (setTimeout, setInterval)', type: 'subtopic' },
            { id: 'as-3', title: 'setImmediate / process.nextTick', type: 'subtopic' },
            { id: 'as-4', title: 'System/User/JS Errors / Async Errors', type: 'subtopic' },
            { id: 'as-5', title: 'Uncaught Exceptions', type: 'subtopic' }
          ]
        },
        {
          id: 'files',
          title: 'Files & CLI Apps',
          type: 'topic',
          children: [
            { id: 'fi-1', title: 'path / fs / fs-extra / chokidar', type: 'subtopic' },
            { id: 'fi-2', title: 'stdin, stdout, stderr / process.argv', type: 'subtopic' },
            { id: 'fi-3', title: 'commander / Inquirer / prompts', type: 'subtopic' },
            { id: 'fi-4', title: 'chalk / figlet / cli-progress', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'apis-dbs-sec',
      title: 'APIs & Databases',
      type: 'section',
      children: [
        {
          id: 'api',
          title: 'APIs & Auth',
          type: 'topic',
          children: [
            { id: 'ap-1', title: 'Express.js / fastify / NestJS / Hono', type: 'subtopic' },
            { id: 'ap-2', title: 'Making Calls (axios, fetch, got)', type: 'subtopic' },
            { id: 'ap-3', title: 'Auth (jsonwebtoken, passport.js)', type: 'subtopic' }
          ]
        },
        {
          id: 'db',
          title: 'Databases & Templates',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'NoSQL DBs / Relational DBs', type: 'subtopic' },
            { id: 'db-2', title: 'Mongoose / Prisma / Drizzle', type: 'subtopic' },
            { id: 'db-3', title: 'TypeORM / Knex / Sequelize', type: 'subtopic' },
            { id: 'db-4', title: 'Templates (ejs, pug, marko)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-perf-sec',
      title: 'Testing & Performance',
      type: 'section',
      children: [
        {
          id: 'test',
          title: 'Testing & Logging',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Vitest / Jest / node:test', type: 'subtopic' },
            { id: 'te-2', title: 'Cypress / Playwright', type: 'subtopic' },
            { id: 'te-3', title: 'Logging (Winston, Morgan)', type: 'subtopic' },
            { id: 'te-4', title: 'Dev Tools (--watch, nodemon)', type: 'subtopic' },
            { id: 'te-5', title: 'pm2', type: 'subtopic' }
          ]
        },
        {
          id: 'perf',
          title: 'Perf, Threads & Debug',
          type: 'topic',
          children: [
            { id: 'pe-1', title: 'Streams / Threads / Child Process', type: 'subtopic' },
            { id: 'pe-2', title: 'Cluster / Worker Threads', type: 'subtopic' },
            { id: 'pe-3', title: 'Debugging (node --inspect, APM)', type: 'subtopic' },
            { id: 'pe-4', title: 'Garbage Collection / Memory Leaks', type: 'subtopic' },
            { id: 'pe-5', title: 'Stack Trace / Exit Codes', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'JavaScript Roadmap', type: 'topic', link: { id: 'javascript', title: 'JavaScript' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'MongoDB Roadmap', type: 'topic', link: { id: 'mongodb', title: 'MongoDB' } }
      ]
    }
  ]
};
export const openclawRoadmap = {
  id: 'openclaw',
  title: 'OpenClaw',
  description: 'Master the OpenClaw framework for AI agents and vibe coding',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '50,000',
  faq: {
    question: 'How does OpenClaw compare to Claude Code?',
    answer: 'OpenClaw is an open-source alternative that allows multi-agent workflows, custom skills, and diverse model providers via a Gateway, unlike Claude Code which is proprietary.'
  },
  items: [
    {
      id: 'intro-setup-sec',
      title: 'Introduction & Setup',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction & Setup',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'OpenClaw vs Claude Code / Use cases', type: 'subtopic' },
            { id: 'in-2', title: 'How OpenClaw Works / Setting up', type: 'subtopic' },
            { id: 'in-3', title: 'Workspace Settings (AGENTS.md, SOUL.md)', type: 'subtopic' },
            { id: 'in-4', title: 'Memory Files (MEMORY.md)', type: 'subtopic' },
            { id: 'in-5', title: 'Adding First Channel', type: 'subtopic' }
          ]
        },
        {
          id: 'install',
          title: 'Installation',
          type: 'topic',
          children: [
            { id: 'is-1', title: 'Methods (Local, VPS, Hardware)', type: 'subtopic' },
            { id: 'is-2', title: 'Security Best Practices / Isolated Install', type: 'subtopic' },
            { id: 'is-3', title: 'Docker / Rasberry Pi / Mac Mini', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'providers-gateway-sec',
      title: 'Models & Gateway',
      type: 'section',
      children: [
        {
          id: 'models',
          title: 'Models & Providers',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Antropic, OpenAI, Gemini, Ollama', type: 'subtopic' },
            { id: 'mo-2', title: 'Auth & Model Providers', type: 'subtopic' },
            { id: 'mo-3', title: 'models list | set | status', type: 'subtopic' },
            { id: 'mo-4', title: 'models auth add | setup-token', type: 'subtopic' }
          ]
        },
        {
          id: 'gateway',
          title: 'Gateway & Channels',
          type: 'topic',
          children: [
            { id: 'gw-1', title: 'Gateway Settings / Adding Daemon', type: 'subtopic' },
            { id: 'gw-2', title: 'gateway start | stop | restart', type: 'subtopic' },
            { id: 'gw-3', title: 'Channels (Telegram, WhatsApp, Slack, Discord)', type: 'subtopic' },
            { id: 'gw-4', title: 'channels list | login | add | remove | status', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'agents-skills-sec',
      title: 'Agents & Skills',
      type: 'section',
      children: [
        {
          id: 'agents',
          title: 'Agents & Memory',
          type: 'topic',
          children: [
            { id: 'ag-1', title: 'Agent Loop / Context Window / Sessions', type: 'subtopic' },
            { id: 'ag-2', title: 'Memory System / Proactive Core', type: 'subtopic' },
            { id: 'ag-3', title: 'memory index --all / search / backup', type: 'subtopic' },
            { id: 'ag-4', title: 'cron list | add / Cron Jobs / Managing Jobs', type: 'subtopic' }
          ]
        },
        {
          id: 'skills',
          title: 'Skills & Multi-Agents',
          type: 'topic',
          children: [
            { id: 'sk-1', title: 'Installing from ClawHub / Plugins', type: 'subtopic' },
            { id: 'sk-2', title: 'MCP / Creating Skills / Creating Plugins', type: 'subtopic' },
            { id: 'sk-3', title: 'Multi-Agents (Routing Rules)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'security-ops-sec',
      title: 'Security & Operations',
      type: 'section',
      children: [
        {
          id: 'ops',
          title: 'Open Claw in Action',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Command Cheatsheet', type: 'subtopic' },
            { id: 'op-2', title: 'onboard / doctor / doctor --deep', type: 'subtopic' },
            { id: 'op-3', title: 'security audit / Automating Tasks', type: 'subtopic' },
            { id: 'op-4', title: 'Slash Commands (/new, /model, /think)', type: 'subtopic' },
            { id: 'op-5', title: 'Usage Best Practices (Heartbeats)', type: 'subtopic' }
          ]
        },
        {
          id: 'sec',
          title: 'Security & Hooks',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Hooks (Structure, Event Types, Webhooks)', type: 'subtopic' },
            { id: 'se-2', title: 'Security checklist (Deploy on VPS, non-root)', type: 'subtopic' },
            { id: 'se-3', title: 'Bind to localhost / Secure ports', type: 'subtopic' },
            { id: 'se-4', title: 'Strong auth token / Device pairing', type: 'subtopic' },
            { id: 'se-5', title: 'No hardcoded keys / Read-only mode', type: 'subtopic' },
            { id: 'se-6', title: 'Update regularly / Rotate credentials', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AI Engineer Roadmap', type: 'topic', link: { id: 'ai-engineer', title: 'AI Engineer' } },
        { id: 'related-2', title: 'AI Agents Roadmap', type: 'topic', link: { id: 'ai-agents', title: 'AI Agents' } }
      ]
    }
  ]
};
export const phpRoadmap = {
  id: 'php',
  title: 'PHP',
  description: 'Master the server-side language that powers the majority of the web',
  layout: 'linear',
  category: 'language',
  subscriberCount: '230,000',
  faq: {
    question: 'Is PHP dead?',
    answer: 'Not at all. PHP powers nearly 80% of all websites (including WordPress) and modern PHP (8.x) is fast, strongly typed, and highly capable.'
  },
  items: [
    {
      id: 'intro-fundamentals-sec',
      title: 'Intro & Fundamentals',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Intro & Env',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is PHP? / Versions and Features', type: 'subtopic' },
            { id: 'in-2', title: 'Installing PHP / Local Server', type: 'subtopic' },
            { id: 'in-3', title: 'WAMP / XAMPP / MAMP / LAMP', type: 'subtopic' }
          ]
        },
        {
          id: 'fund',
          title: 'Fundamentals & Syntax',
          type: 'topic',
          children: [
            { id: 'fu-1', title: 'Syntax / Variables / Data Types', type: 'subtopic' },
            { id: 'fu-2', title: 'echo / print / var_dump / Constants', type: 'subtopic' },
            { id: 'fu-3', title: 'Arrays (Indexed, Assoc, Multi)', type: 'subtopic' },
            { id: 'fu-4', title: 'Conditionals (if, switch, match) / Loops', type: 'subtopic' },
            { id: 'fu-5', title: 'Functions (Params, Closures, Arrow)', type: 'subtopic' },
            { id: 'fu-6', title: 'Include/Require Files (include, require)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'web-fileops-sec',
      title: 'Web & File Ops',
      type: 'section',
      children: [
        {
          id: 'web',
          title: 'Web & Request Handling',
          type: 'topic',
          children: [
            { id: 'we-1', title: 'HTTP Methods / Super Globals', type: 'subtopic' },
            { id: 'we-2', title: '$_GET / $_POST / $_SERVER', type: 'subtopic' },
            { id: 'we-3', title: 'Form Processing / File Uploads', type: 'subtopic' },
            { id: 'we-4', title: 'State Management (Cookies, Sessions)', type: 'subtopic' }
          ]
        },
        {
          id: 'files',
          title: 'File Operations & Data',
          type: 'topic',
          children: [
            { id: 'fi-1', title: 'File Handling (Read, Write, Perms)', type: 'subtopic' },
            { id: 'fi-2', title: 'CSV Processing', type: 'subtopic' },
            { id: 'fi-3', title: 'JSON Processing', type: 'subtopic' },
            { id: 'fi-4', title: 'XML Processing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'oop-db-sec',
      title: 'OOP & DB',
      type: 'section',
      children: [
        {
          id: 'oop',
          title: 'Object Oriented PHP',
          type: 'topic',
          children: [
            { id: 'oo-1', title: 'Classes, Objects, Properties', type: 'subtopic' },
            { id: 'oo-2', title: 'Methods, Constructor, Access Specs', type: 'subtopic' },
            { id: 'oo-3', title: 'Static Methods / Polymorphism', type: 'subtopic' },
            { id: 'oo-4', title: 'Inheritance / Abstract / Interfaces', type: 'subtopic' },
            { id: 'oo-5', title: 'Traits / Namespaces / Magic methods', type: 'subtopic' },
            { id: 'oo-6', title: 'Dependency injection / Type Declarations', type: 'subtopic' }
          ]
        },
        {
          id: 'db',
          title: 'Databases & Security',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'PDO / MySQLi / Transactions', type: 'subtopic' },
            { id: 'db-2', title: 'ORM / Database Migrations', type: 'subtopic' },
            { id: 'db-3', title: 'Security: Input Validation, SQL Injection', type: 'subtopic' },
            { id: 'db-4', title: 'XSS, CSRF, Password Hashing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'frameworks-advanced-sec',
      title: 'Frameworks & Advanced',
      type: 'section',
      children: [
        {
          id: 'tools',
          title: 'Frameworks & Tools',
          type: 'topic',
          children: [
            { id: 'to-1', title: 'Composer / Packagist / Autoloading', type: 'subtopic' },
            { id: 'to-2', title: 'Laravel / Symfony / PSR Standards', type: 'subtopic' },
            { id: 'to-3', title: 'PHPUnit / Pest / Static Analysis', type: 'subtopic' },
            { id: 'to-4', title: 'cURL / Guzzle / Xdebug', type: 'subtopic' }
          ]
        },
        {
          id: 'adv',
          title: 'Advanced & Ops',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Profiling / Caching / Opcode', type: 'subtopic' },
            { id: 'ad-2', title: 'Config Tuning / Memory Mgmt', type: 'subtopic' },
            { id: 'ad-3', title: 'Process Control / Exec System Cmds', type: 'subtopic' },
            { id: 'ad-4', title: 'Web Servers (Apache, Nginx)', type: 'subtopic' },
            { id: 'ad-5', title: 'PHP-FPM', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Laravel Roadmap', type: 'topic', link: { id: 'laravel', title: 'Laravel' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const postgresqlDbaRoadmap = {
  id: 'postgresql-dba',
  title: 'PostgreSQL DBA',
  description: 'Master the administration, tuning, and scaling of PostgreSQL',
  layout: 'linear',
  category: 'database',
  subscriberCount: '110,000',
  faq: {
    question: 'How is a DBA different from a Data Engineer?',
    answer: 'A Data Engineer builds pipelines to move data, whereas a DBA ensures the database engine itself is highly available, secure, backed up, and running at peak performance.'
  },
  items: [
    {
      id: 'intro-setup-sec',
      title: 'Introduction & Setup',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Intro & SQL',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What are Relational Databases? / RDBMS', type: 'subtopic' },
            { id: 'in-2', title: 'PostgreSQL vs NoSQL / ACID / MVCC', type: 'subtopic' },
            { id: 'in-3', title: 'Transactions / WAL / Query Processing', type: 'subtopic' },
            { id: 'in-4', title: 'Learn SQL: Queries, Data Types, Joining', type: 'subtopic' },
            { id: 'in-5', title: 'Querying Data: Filtering / Modifying', type: 'subtopic' }
          ]
        },
        {
          id: 'setup',
          title: 'Setup & Data Processing',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Installation (Docker, Packages)', type: 'subtopic' },
            { id: 'se-2', title: 'Managing Postgres (systemd, pg_ctl)', type: 'subtopic' },
            { id: 'se-3', title: 'pqsl / Deployment in Cloud', type: 'subtopic' },
            { id: 'se-4', title: 'Import/Export (COPY) / Data Partitioning', type: 'subtopic' },
            { id: 'se-5', title: 'Sharding / Normalization / Bulk Loading', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'config-security-sec',
      title: 'Configuration & Security',
      type: 'section',
      children: [
        {
          id: 'config',
          title: 'Configuration & Tools',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'postgres.conf / Resource Usage / WAL', type: 'subtopic' },
            { id: 'co-2', title: 'Vacuums / Query Planner', type: 'subtopic' },
            { id: 'co-3', title: 'Posgres Tools: System Views, EXPLAIN', type: 'subtopic' },
            { id: 'co-4', title: 'Indexes (B-Tree, BRIN, GiST, GIN)', type: 'subtopic' }
          ]
        },
        {
          id: 'sec',
          title: 'Security & Backup',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Auth Models / Roles / pg_hba.conf', type: 'subtopic' },
            { id: 'se-2', title: 'Row-Level Security / SELinux / Grant', type: 'subtopic' },
            { id: 'se-3', title: 'Anonymization (PostgreSQL Anonymizer)', type: 'subtopic' },
            { id: 'se-4', title: 'Backup (pg_dump, pg_restore, pgbackrest)', type: 'subtopic' },
            { id: 'se-5', title: 'WAL-G / barman / Upgrade Procedures', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'replication-cluster-sec',
      title: 'Replication & Cluster',
      type: 'section',
      children: [
        {
          id: 'repl',
          title: 'Replication & Cluster',
          type: 'topic',
          children: [
            { id: 're-1', title: 'Logical / Streaming Replication', type: 'subtopic' },
            { id: 're-2', title: 'Connection Pooling (PgBouncer)', type: 'subtopic' },
            { id: 're-3', title: 'Patroni / Kubernetes Deployment', type: 'subtopic' },
            { id: 're-4', title: 'Load Balancing (HAProxy, Consul, Etcd)', type: 'subtopic' }
          ]
        },
        {
          id: 'monitor',
          title: 'Monitoring & Troubleshooting',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Prometheus / Zabbix / temBoard', type: 'subtopic' },
            { id: 'mo-2', title: 'Resource Usage / Capacity Planning', type: 'subtopic' },
            { id: 'mo-3', title: 'Troubleshooting: EXPLAIN, Profiling Tools', type: 'subtopic' },
            { id: 'mo-4', title: 'Log Analysis (pgBadger, pgCluu)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-sec',
      title: 'Advanced & Tuning',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced Topics & Tuning',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'CTE / Subqueries / Lateral Join / Grouping', type: 'subtopic' },
            { id: 'ad-2', title: 'Vacuum Processing / Workload Tuning', type: 'subtopic' },
            { id: 'ad-3', title: 'Advanced SQL (PL/pgSQL, Triggers)', type: 'subtopic' },
            { id: 'ad-4', title: 'Buffer Mgmt / Storage Params / Lock Mgmt', type: 'subtopic' },
            { id: 'ad-5', title: 'Get Involved in Development (Patches)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'SQL Roadmap', type: 'topic', link: { id: 'sql', title: 'SQL' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Data Engineer Roadmap', type: 'topic', link: { id: 'data-engineer', title: 'Data Engineer' } }
      ]
    }
  ]
};
export const productManagerRoadmap = {
  id: 'product-manager',
  title: 'Product Manager',
  description: 'Bridge business, UX, and technology to build products users love',
  layout: 'linear',
  category: 'role',
  subscriberCount: '175,000',
  faq: {
    question: 'Do I need to know how to code?',
    answer: 'No, but technical empathy is crucial. You should understand how APIs work, the SDLC, and the trade-offs engineers face.'
  },
  items: [
    {
      id: 'intro-ideation-sec',
      title: 'Introduction & Ideation',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction & Lifecycle',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Product vs Project Mgmt', type: 'subtopic' },
            { id: 'in-2', title: 'Roles and Responsibilities / Skills', type: 'subtopic' },
            { id: 'in-3', title: 'Lifecycle (Discovery, Selection, Validation, Execution)', type: 'subtopic' },
            { id: 'in-4', title: 'Growth / Maturity / Decline', type: 'subtopic' }
          ]
        },
        {
          id: 'idea',
          title: 'Idea Generation',
          type: 'topic',
          children: [
            { id: 'id-1', title: 'Mind Mapping / Brainwriting', type: 'subtopic' },
            { id: 'id-2', title: 'SCAMPER / Brainstorming', type: 'subtopic' },
            { id: 'id-3', title: 'Product Identification', type: 'subtopic' },
            { id: 'id-4', title: 'Iterative Process', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'research-strategy-sec',
      title: 'Research & Strategy',
      type: 'section',
      children: [
        {
          id: 'research',
          title: 'Market & User Research',
          type: 'topic',
          children: [
            { id: 're-1', title: 'Identifying Market Needs / Analysis', type: 'subtopic' },
            { id: 're-2', title: 'Competitive Analysis / Market Trends', type: 'subtopic' },
            { id: 're-3', title: 'User Personas / Interviews / Surveys', type: 'subtopic' },
            { id: 're-4', title: 'Ethnographic & User Research', type: 'subtopic' }
          ]
        },
        {
          id: 'strat',
          title: 'Product Strategy',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Defining & Communicating (USP, Positioning)', type: 'subtopic' },
            { id: 'st-2', title: 'Vision & Mission / Strategic Thinking', type: 'subtopic' },
            { id: 'st-3', title: 'Value Proposition (Goals, OKRs, Canvas)', type: 'subtopic' },
            { id: 'st-4', title: 'Strategic Partners (Managing)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'planning-design-sec',
      title: 'Planning & Design',
      type: 'section',
      children: [
        {
          id: 'plan',
          title: 'Product Planning',
          type: 'topic',
          children: [
            { id: 'pl-1', title: 'Creating a Roadmap (PRDs, Prioritising)', type: 'subtopic' },
            { id: 'pl-2', title: 'User Stories / Job Stories', type: 'subtopic' },
            { id: 'pl-3', title: 'Outcome-Based Roadmaps', type: 'subtopic' },
            { id: 'pl-4', title: 'Backlog Management / Grooming', type: 'subtopic' }
          ]
        },
        {
          id: 'design',
          title: 'Product Design',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'User Story Mapping / UX Design', type: 'subtopic' },
            { id: 'de-2', title: 'Design Thinking / Service Design', type: 'subtopic' },
            { id: 'de-3', title: 'Wireframing / Prototyping', type: 'subtopic' },
            { id: 'de-4', title: 'Usability / A/B / User Testing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'dev-metrics-sec',
      title: 'Development & Metrics',
      type: 'section',
      children: [
        {
          id: 'dev',
          title: 'Development & Launch',
          type: 'topic',
          children: [
            { id: 'dv-1', title: 'Scrum / Kanban / Agile / Sprints', type: 'subtopic' },
            { id: 'dv-2', title: 'MVP / Release Strategies (Toggles, Rollouts)', type: 'subtopic' },
            { id: 'dv-3', title: 'Go-to-Market / Launch Planning', type: 'subtopic' },
            { id: 'dv-4', title: 'Marketing Strategies / Growth Hacking', type: 'subtopic' },
            { id: 'dv-5', title: 'Working with Engineering Teams', type: 'subtopic' }
          ]
        },
        {
          id: 'metrics',
          title: 'Product Metrics',
          type: 'topic',
          children: [
            { id: 'me-1', title: 'DAU / MAU / Conversion / Retention / Churn', type: 'subtopic' },
            { id: 'me-2', title: 'LTV / CAC / North Star Metric', type: 'subtopic' },
            { id: 'me-3', title: 'A/B Testing / Data-Driven Decisions', type: 'subtopic' },
            { id: 'me-4', title: 'Cohort Analysis / Predictive Analytics', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'interpersonal-ops-sec',
      title: 'Interpersonal & Operations',
      type: 'section',
      children: [
        {
          id: 'inter',
          title: 'Interpersonal & Tools',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Stakeholder Management / Business Buy-In', type: 'subtopic' },
            { id: 'in-2', title: 'Communication Skills / Conflict Resolution', type: 'subtopic' },
            { id: 'in-3', title: 'Tools: Product Board, Notion, Jira, Linear', type: 'subtopic' },
            { id: 'in-4', title: 'Analytics: Amplitude, Heap, Looker', type: 'subtopic' },
            { id: 'in-5', title: 'Communication: Slack, Teams', type: 'subtopic' }
          ]
        },
        {
          id: 'ops',
          title: 'Risk & Advanced Topics',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Risk Identification / Mitigation / Assessment', type: 'subtopic' },
            { id: 'op-2', title: 'Growth Strategies / Internationalization', type: 'subtopic' },
            { id: 'op-3', title: 'Scaling Products / ML & AI in Product Mgmt', type: 'subtopic' },
            { id: 'op-4', title: 'Portfolio Management / Building Teams', type: 'subtopic' },
            { id: 'op-5', title: 'Leadership and Influence / EQ', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Engineering Manager Roadmap', type: 'topic', link: { id: 'engineering-manager', title: 'Engineering Manager' } },
        { id: 'related-2', title: 'UX Design Roadmap', type: 'topic', link: { id: 'ux-design', title: 'UX Design' } },
        { id: 'related-3', title: 'AI Product Builder Roadmap', type: 'topic', link: { id: 'ai-product-builder', title: 'AI Product Builder' } }
      ]
    }
  ]
};
export const promptEngineeringRoadmap = {
  id: 'prompt-engineering',
  title: 'Prompt Engineering',
  description: 'Master the art of communicating with and optimizing Large Language Models',
  layout: 'linear',
  category: 'role',
  subscriberCount: '190,000',
  faq: {
    question: 'Is prompt engineering just typing questions?',
    answer: 'No, it involves understanding model latency, hallucination rates, context windows, token limits, and advanced techniques like RAG and Chain of Thought.'
  },
  items: [
    {
      id: 'intro-config-sec',
      title: 'Introduction & LLM Basics',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'How LLMs work / Common Terminology', type: 'subtopic' },
            { id: 'in-2', title: 'What is a Prompt / Prompt Engineering', type: 'subtopic' },
            { id: 'in-3', title: 'Tokens / Context Window', type: 'subtopic' },
            { id: 'in-4', title: 'Models (OpenAI, Google, Anthropic, Meta, xAI)', type: 'subtopic' }
          ]
        },
        {
          id: 'config',
          title: 'LLM Configuration',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Hallucination / Prompt Injection / Agents', type: 'subtopic' },
            { id: 'co-2', title: 'Model Weights / Parameters', type: 'subtopic' },
            { id: 'co-3', title: 'Fine-Tuning vs Prompt Engg.', type: 'subtopic' },
            { id: 'co-4', title: 'AI vs AGI / RAG', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'sampling-techniques-sec',
      title: 'Parameters & Techniques',
      type: 'section',
      children: [
        {
          id: 'sampling',
          title: 'Sampling Parameters',
          type: 'topic',
          children: [
            { id: 'sa-1', title: 'Temperature / Top-K / Top-P', type: 'subtopic' },
            { id: 'sa-2', title: 'Output Control (Max Tokens, Stop Sequences)', type: 'subtopic' },
            { id: 'sa-3', title: 'Structured Outputs', type: 'subtopic' },
            { id: 'sa-4', title: 'Repetition Penalties (Frequency, Presence)', type: 'subtopic' }
          ]
        },
        {
          id: 'tech',
          title: 'Prompting Techniques',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Zero-Shot / One-Shot / Few-Shot', type: 'subtopic' },
            { id: 'te-2', title: 'Step-back / Chain of Thought (CoT)', type: 'subtopic' },
            { id: 'te-3', title: 'Automatic Prompt Engineering / Use LLM to generate Prompts', type: 'subtopic' },
            { id: 'te-4', title: 'System / Role / Contextual Prompting', type: 'subtopic' },
            { id: 'te-5', title: 'Self-Consistency / Tree of Thoughts (ToT) / ReAct', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'practices-reliability-sec',
      title: 'Best Practices & Reliability',
      type: 'section',
      children: [
        {
          id: 'practices',
          title: 'Best Practices',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Provide few-shot examples / Ask for structured output', type: 'subtopic' },
            { id: 'pr-2', title: 'Keep prompts short and concise / Clear instructions', type: 'subtopic' },
            { id: 'pr-3', title: 'Use variables / placeholders / Delimit sections (XML)', type: 'subtopic' },
            { id: 'pr-4', title: 'Control maximum output length / Experiment with formats', type: 'subtopic' },
            { id: 'pr-5', title: 'Tune sampling / Guard against prompt injection', type: 'subtopic' },
            { id: 'pr-6', title: 'Automate evaluation / Document and track versions', type: 'subtopic' },
            { id: 'pr-7', title: 'Optimize for latency & cost', type: 'subtopic' }
          ]
        },
        {
          id: 'reliability',
          title: 'Improving Reliability',
          type: 'topic',
          children: [
            { id: 're-1', title: 'Prompt Debiasing', type: 'subtopic' },
            { id: 're-2', title: 'Prompt Ensembling', type: 'subtopic' },
            { id: 're-3', title: 'LLM Self Evaluation', type: 'subtopic' },
            { id: 're-4', title: 'Calibrating LLMs', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AI Red Teaming Roadmap', type: 'topic', link: { id: 'ai-red-teaming', title: 'AI Red Teaming' } },
        { id: 'related-2', title: 'AI Engineer Roadmap', type: 'topic', link: { id: 'ai-engineer', title: 'AI Engineer' } },
        { id: 'related-3', title: 'Machine Learning Roadmap', type: 'topic', link: { id: 'machine-learning', title: 'Machine Learning' } }
      ]
    }
  ]
};
export const pythonDataAnalysisRoadmap = {
  id: 'python-data-analysis',
  title: 'Python for Data Analysis',
  description: 'Master the Python libraries used to extract, clean, and visualize data',
  layout: 'linear',
  category: 'role',
  subscriberCount: '160,000',
  faq: {
    question: 'Should I learn Python or R for data analysis?',
    answer: 'Python is generally preferred in industry due to its versatility and powerful libraries (Pandas, NumPy) that integrate well into production systems.'
  },
  items: [
    {
      id: 'setup-basics-sec',
      title: 'Setup & Python Basics',
      type: 'section',
      children: [
        {
          id: 'setup',
          title: 'Environment & Setup',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Package Management (pip, conda, uv)', type: 'subtopic' },
            { id: 'se-2', title: 'virtualenv / venv', type: 'subtopic' },
            { id: 'se-3', title: 'IDEs (JupyterLab, Colab, VS Code)', type: 'subtopic' }
          ]
        },
        {
          id: 'basics',
          title: 'Data Structures & Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Data Types / Arithmetic / Logic / Operators', type: 'subtopic' },
            { id: 'ba-2', title: 'Lists / Tuples / Dictionaries / Sets', type: 'subtopic' },
            { id: 'ba-3', title: 'Conditionals / Loops / String Methods', type: 'subtopic' },
            { id: 'ba-4', title: 'List Comprehensions / Type Casting', type: 'subtopic' },
            { id: 'ba-5', title: 'Functions (Args, kwargs, Lambda)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-libs-sec',
      title: 'Core Libraries',
      type: 'section',
      children: [
        {
          id: 'numpy',
          title: 'NumPy',
          type: 'topic',
          children: [
            { id: 'nu-1', title: 'Arrays & ndarray / Array Operations', type: 'subtopic' },
            { id: 'nu-2', title: 'Indexing & Slicing', type: 'subtopic' },
            { id: 'nu-3', title: 'Linear Algebra Basics / Random Module', type: 'subtopic' }
          ]
        },
        {
          id: 'pandas',
          title: 'Pandas & Polars',
          type: 'topic',
          children: [
            { id: 'pa-1', title: 'Series and DataFrame', type: 'subtopic' },
            { id: 'pa-2', title: 'Indexing & Slicing / Filtering & Querying', type: 'subtopic' },
            { id: 'pa-3', title: 'Groupby & Aggregation', type: 'subtopic' },
            { id: 'pa-4', title: 'Merging & Joining / Reshaping', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'cleaning-reading-sec',
      title: 'Cleaning & Reading Data',
      type: 'section',
      children: [
        {
          id: 'clean',
          title: 'Data Cleaning',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Missing Values (isnull, isna, Fill/Drop)', type: 'subtopic' },
            { id: 'cl-2', title: 'Outlier Detection (IQR, Z-score, Visual)', type: 'subtopic' },
            { id: 'cl-3', title: 'String Cleaning (strip, replace, split, re)', type: 'subtopic' },
            { id: 'cl-4', title: 'Data Type Conversion (Casting, Parsing Dates)', type: 'subtopic' }
          ]
        },
        {
          id: 'read',
          title: 'Reading Data',
          type: 'topic',
          children: [
            { id: 're-1', title: 'File Formats (CSV, Excel, JSON, Parquet)', type: 'subtopic' },
            { id: 're-2', title: 'Reading Local Files / Web Data', type: 'subtopic' },
            { id: 're-3', title: 'APIs with requests', type: 'subtopic' },
            { id: 're-4', title: 'BeautifulSoup / scrapy', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'eda-viz-sec',
      title: 'EDA & Visualization',
      type: 'section',
      children: [
        {
          id: 'eda',
          title: 'Exploratory Data Analysis',
          type: 'topic',
          children: [
            { id: 'ed-1', title: 'Descriptive Statistics (Mean, Median, Mode, Std Dev)', type: 'subtopic' },
            { id: 'ed-2', title: 'Distribution Analysis (Histogram, Boxplot)', type: 'subtopic' },
            { id: 'ed-3', title: 'Relationship Analysis (Scatter, Correlation, Crosstab)', type: 'subtopic' },
            { id: 'ed-4', title: 'Encoding Categories', type: 'subtopic' }
          ]
        },
        {
          id: 'viz',
          title: 'Data Visualization',
          type: 'topic',
          children: [
            { id: 'vi-1', title: 'Plot Categories (Dist, Categorical, Regression, Heatmaps)', type: 'subtopic' },
            { id: 'vi-2', title: 'Matplotlib (Subplots, Customizing, Saving)', type: 'subtopic' },
            { id: 'vi-3', title: 'Seaborn / Plotly / Interactive Visualization', type: 'subtopic' },
            { id: 'vi-4', title: 'Dashboards (Streamlit, Dash, Power BI, Tableau)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-next-sec',
      title: 'Advanced & Next Steps',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced Topics',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'OOP for Data Analysis / SciPy / SQL Fundamentals', type: 'subtopic' },
            { id: 'ad-2', title: 'Machine Learning (Scikit-learn, Statistics & ML)', type: 'subtopic' },
            { id: 'ad-3', title: 'Geospatial Analysis (GeoPandas) / Big Data Tools (Dask, PySpark)', type: 'subtopic' },
            { id: 'ad-4', title: 'Data Pipelines (Airflow)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Data Analyst Roadmap', type: 'topic', link: { id: 'data-analyst', title: 'Data Analyst' } },
        { id: 'related-2', title: 'Machine Learning Roadmap', type: 'topic', link: { id: 'machine-learning', title: 'Machine Learning' } },
        { id: 'related-3', title: 'Python Roadmap', type: 'topic', link: { id: 'python', title: 'Python' } }
      ]
    }
  ]
};
export const pythonRoadmap = {
  id: 'python',
  title: 'Python',
  description: 'Step by step guide to becoming a Python developer',
  layout: 'linear',
  category: 'language',
  subscriberCount: '700,000',
  faq: {
    question: 'Is Python good for beginners?',
    answer: 'Yes! Python has clean, readable syntax and is one of the best first languages. It is widely used in web development, data science, AI, and automation.'
  },
  items: [
    {
      id: 'basics-ds-sec',
      title: 'Basics & Data Structures',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Basics & Data Types',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Variables, Type Casting, Exceptions', type: 'subtopic' },
            { id: 'ba-2', title: 'Functions, Conditionals, Loops', type: 'subtopic' },
            { id: 'ba-3', title: 'Lists, Tuples, Sets, Dictionaries', type: 'subtopic' }
          ]
        },
        {
          id: 'ds',
          title: 'Data Structures & Algos',
          type: 'topic',
          children: [
            { id: 'ds-1', title: 'Arrays, Linked Lists, Hash Tables', type: 'subtopic' },
            { id: 'ds-2', title: 'Heaps, Stacks, Queues, BST', type: 'subtopic' },
            { id: 'ds-3', title: 'Recursion / Sorting Algorithms', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'oop-modules-sec',
      title: 'OOP & Modules',
      type: 'section',
      children: [
        {
          id: 'oop',
          title: 'OOP & Modules',
          type: 'topic',
          children: [
            { id: 'oo-1', title: 'Classes / Inheritance / Methods, Dunder', type: 'subtopic' },
            { id: 'oo-2', title: 'Modules / Lambdas / Decorators', type: 'subtopic' },
            { id: 'oo-3', title: 'Iterators / List Comprehensions', type: 'subtopic' }
          ]
        },
        {
          id: 'advanced',
          title: 'Advanced Python',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Generators / Context Managers', type: 'subtopic' },
            { id: 'ad-2', title: 'Regular Expressions / Paradigms', type: 'subtopic' },
            { id: 'ad-3', title: 'Package Managers (pip, conda, poetry)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'frameworks-concurrency-sec',
      title: 'Frameworks & Concurrency',
      type: 'section',
      children: [
        {
          id: 'frameworks',
          title: 'Frameworks & Testing',
          type: 'topic',
          children: [
            { id: 'fr-1', title: 'FastAPI / Django / Flask', type: 'subtopic' },
            { id: 'fr-2', title: 'Testing (pytest, unittest)', type: 'subtopic' },
            { id: 'fr-3', title: 'Documentation (Sphinx)', type: 'subtopic' }
          ]
        },
        {
          id: 'typing',
          title: 'Typing & Concurrency',
          type: 'topic',
          children: [
            { id: 'ty-1', title: 'Static Typing (mypy, pyright)', type: 'subtopic' },
            { id: 'ty-2', title: 'Multiprocessing / Threading / GIL', type: 'subtopic' },
            { id: 'ty-3', title: 'Async (asyncio, aiohttp) / Environments', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-2', title: 'Data Analyst Roadmap', type: 'topic', link: { id: 'data-analyst', title: 'Data Analyst' } },
        { id: 'related-3', title: 'AI & Data Scientist Roadmap', type: 'topic', link: { id: 'ai-data-scientist', title: 'AI & Data Scientist' } }
      ]
    }
  ]
};
export const qaRoadmap = {
  id: 'qa',
  title: 'QA Engineer',
  description: 'Master manual and automated software testing to ensure product quality',
  layout: 'linear',
  category: 'role',
  subscriberCount: '130,000',
  faq: {
    question: 'Manual vs Automated testing?',
    answer: 'Both are necessary. Start with manual testing to understand edge cases and UX, then move into automation using tools like Playwright or Cypress to save time.'
  },
  items: [
    {
      id: 'fundamentals-testing-sec',
      title: 'Fundamentals & Approaches',
      type: 'section',
      children: [
        {
          id: 'fundamentals',
          title: 'Learn the Fundamentals',
          type: 'topic',
          children: [
            { id: 'fu-1', title: 'What is QA? / QA Mindset / Test Oracles', type: 'subtopic' },
            { id: 'fu-2', title: 'Project Management (Atlassian, Trello, TestRail)', type: 'subtopic' },
            { id: 'fu-3', title: 'SDLC Models (Agile, Scrum, Waterfall, TDD, V Model)', type: 'subtopic' }
          ]
        },
        {
          id: 'testing-approach',
          title: 'Testing Approaches',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'White Box Testing', type: 'subtopic' },
            { id: 'te-2', title: 'Gray Box Testing', type: 'subtopic' },
            { id: 'te-3', title: 'Black Box Testing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'techniques-manual-sec',
      title: 'Techniques & Manual Testing',
      type: 'section',
      children: [
        {
          id: 'techniques',
          title: 'Testing Techniques',
          type: 'topic',
          children: [
            { id: 'tn-1', title: 'Functional (UAT, Exploratory, Regression, Unit)', type: 'subtopic' },
            { id: 'tn-2', title: 'Non-Functional (Load, Stress, Security, Accessibility)', type: 'subtopic' }
          ]
        },
        {
          id: 'manual',
          title: 'Manual Testing',
          type: 'topic',
          children: [
            { id: 'ma-1', title: 'Test Cases and Scenarios', type: 'subtopic' },
            { id: 'ma-2', title: 'Verification and Validation', type: 'subtopic' },
            { id: 'ma-3', title: 'Test Planning / Test Prioritization', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'automation-sec',
      title: 'Test Automation',
      type: 'section',
      children: [
        {
          id: 'auto-fe',
          title: 'Frontend Automation',
          type: 'topic',
          children: [
            { id: 'af-1', title: 'Basic Introduction (DOM, Browser Tools, AJAX, CSR)', type: 'subtopic' },
            { id: 'af-2', title: 'Frameworks (Cypress, Playwright, Selenium, Jest)', type: 'subtopic' },
            { id: 'af-3', title: 'Cross Browser Testing (Selenium IDE)', type: 'subtopic' },
            { id: 'af-4', title: 'Accessibility Tests (Wave, AXE)', type: 'subtopic' }
          ]
        },
        {
          id: 'auto-be',
          title: 'Backend / Mobile',
          type: 'topic',
          children: [
            { id: 'ab-1', title: 'Backend (Postman, REST Assured, Soap UI, Karate)', type: 'subtopic' },
            { id: 'ab-2', title: 'Mobile Automation (Appium, Espresso, XCUITest)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'performance-security-sec',
      title: 'Performance, Security & CI',
      type: 'section',
      children: [
        {
          id: 'perf',
          title: 'Performance & Security',
          type: 'topic',
          children: [
            { id: 'pe-1', title: 'Load & Perf (JMeter, K6, Artillery, Lighthouse)', type: 'subtopic' },
            { id: 'pe-2', title: 'Security (OWASP 10, Vuln Scanning, Auth)', type: 'subtopic' },
            { id: 'pe-3', title: 'Email Testing (Mailinator, Gmail Tester)', type: 'subtopic' }
          ]
        },
        {
          id: 'ci',
          title: 'CI/CD & Headless Testing',
          type: 'topic',
          children: [
            { id: 'ci-1', title: 'Version Control (Git, GitHub, GitLab)', type: 'subtopic' },
            { id: 'ci-2', title: 'CI / CD (Jenkins, GitLab CI, GitHub Actions)', type: 'subtopic' },
            { id: 'ci-3', title: 'Headless Testing (Puppeteer, Playwright, Chrome)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'monitoring-reporting-sec',
      title: 'Monitoring & Reporting',
      type: 'section',
      children: [
        {
          id: 'monitor',
          title: 'Monitoring & Logs',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Monitoring (Datadog, Kibana, Grafana, New Relic)', type: 'subtopic' },
            { id: 'mo-2', title: 'Reporting (Allure, jUnit)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Full Stack Roadmap', type: 'topic', link: { id: 'full-stack', title: 'Full Stack' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const reactNativeRoadmap = {
  id: 'react-native',
  title: 'React Native',
  description: 'Step by step guide to becoming a React Native Developer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '190,000',
  faq: {
    question: 'Should I use Expo or React Native CLI?',
    answer: 'Start with Expo. It drastically simplifies setup, routing (Expo Router), and testing. Eject to raw CLI only if you need custom native modules not supported by Expo.'
  },
  items: [
    {
      id: 'intro-prereqs-sec',
      title: 'Introduction & Pre-requisites',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is React Native?', type: 'subtopic' },
            { id: 'in-2', title: 'Why use React Native?', type: 'subtopic' },
            { id: 'in-3', title: 'React Native Alternatives', type: 'subtopic' }
          ]
        },
        {
          id: 'prereq',
          title: 'Learn the Pre-requisites',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'JavaScript Basics', type: 'subtopic' },
            { id: 'pr-2', title: 'CSS Basics', type: 'subtopic' },
            { id: 'pr-3', title: 'React Basics (JSX, State/Props)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'env-workflow-sec',
      title: 'Environment & Workflow',
      type: 'section',
      children: [
        {
          id: 'env',
          title: 'Environment Setup',
          type: 'topic',
          children: [
            { id: 'en-1', title: 'React Native CLI (Metro Bundler)', type: 'subtopic' },
            { id: 'en-2', title: 'Expo (create-expo-app, Snack, Tradeoffs)', type: 'subtopic' }
          ]
        },
        {
          id: 'dev',
          title: 'Development Workflow',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'Debugging / In-App Developer Menu', type: 'subtopic' },
            { id: 'de-2', title: 'Fast Refresh / LogBox / DevTools', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-styling-sec',
      title: 'Core Components & Styling',
      type: 'section',
      children: [
        {
          id: 'core',
          title: 'Core Components',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'View / SafeAreaView / KeyboardAvoidingView', type: 'subtopic' },
            { id: 'co-2', title: 'Text / TextInput / Button / Image', type: 'subtopic' },
            { id: 'co-3', title: 'ActivityIndicator / StatusBar / Modal / Pressable', type: 'subtopic' },
            { id: 'co-4', title: 'ListViews (ScrollView, FlatList, SectionList)', type: 'subtopic' }
          ]
        },
        {
          id: 'style',
          title: 'Styling & Platform Code',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Styling (Stylesheets, Layouts & Flexbox, Access)', type: 'subtopic' },
            { id: 'st-2', title: 'Platform Specific (Platform Module, Exts)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'interactions-network-sec',
      title: 'Interactions & Networking',
      type: 'section',
      children: [
        {
          id: 'interaction',
          title: 'Interactions & Features',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Touchables / Gesture Handling / Animations', type: 'subtopic' },
            { id: 'in-2', title: 'Push Notifications / DeepLinking', type: 'subtopic' }
          ]
        },
        {
          id: 'network',
          title: 'Networking & Storage',
          type: 'topic',
          children: [
            { id: 'ne-1', title: 'Networking (Fetch, WebSockets)', type: 'subtopic' },
            { id: 'ne-2', title: 'Storage (async-storage, expo-secure-store)', type: 'subtopic' },
            { id: 'ne-3', title: 'Security', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-performance-sec',
      title: 'Testing & Performance',
      type: 'section',
      children: [
        {
          id: 'test',
          title: 'Testing & Performance',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Testing (Jest, Component Tests, E2E Detox/Appium)', type: 'subtopic' },
            { id: 'te-2', title: 'Performance (Profiling, Optimizing Flatlist)', type: 'subtopic' },
            { id: 'te-3', title: 'Publishing Apps (App Store, Google Play Store)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'React Roadmap', type: 'topic', link: { id: 'react', title: 'React' } },
        { id: 'related-2', title: 'Android Roadmap', type: 'topic', link: { id: 'android', title: 'Android' } },
        { id: 'related-3', title: 'iOS Roadmap', type: 'topic', link: { id: 'ios', title: 'iOS' } }
      ]
    }
  ]
};
export const reactRoadmap = {
  id: 'react',
  title: 'React',
  description: 'Step by step guide to becoming a React Developer',
  layout: 'linear',
  category: 'framework',
  subscriberCount: '450,000',
  faq: {
    question: 'Should I learn Redux?',
    answer: 'It is good to know, but modern React relies more on React Query for server state and lighter tools like Zustand or Context API for client state.'
  },
  items: [
    {
      id: 'components-basics-sec',
      title: 'Components & Basics',
      type: 'section',
      children: [
        {
          id: 'comp',
          title: 'Component Basics',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'JSX / Props vs State', type: 'subtopic' },
            { id: 'co-2', title: 'Conditional Rendering / Composition', type: 'subtopic' }
          ]
        },
        {
          id: 'adv-comp',
          title: 'Advanced Components',
          type: 'topic',
          children: [
            { id: 'ac-1', title: 'Functional Components / Lifecycle', type: 'subtopic' },
            { id: 'ac-2', title: 'Lists and Keys / Render Props / Refs', type: 'subtopic' },
            { id: 'ac-3', title: 'Events / High Order Components', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'hooks-state-sec',
      title: 'Hooks & State',
      type: 'section',
      children: [
        {
          id: 'hooks',
          title: 'Hooks',
          type: 'topic',
          children: [
            { id: 'ho-1', title: 'Basic (useState, useEffect, useContext)', type: 'subtopic' },
            { id: 'ho-2', title: 'Common (useCallback, useRef, useReducer, useMemo)', type: 'subtopic' },
            { id: 'ho-3', title: 'Custom Hooks / Best Practices', type: 'subtopic' }
          ]
        },
        {
          id: 'state',
          title: 'State Management',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Context / Zustand', type: 'subtopic' },
            { id: 'st-2', title: 'Jotai / MobX', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'routing-ui-sec',
      title: 'Styling, UI & Routing',
      type: 'section',
      children: [
        {
          id: 'ui',
          title: 'Styling & UI Libs',
          type: 'topic',
          children: [
            { id: 'ui-1', title: 'CSS (Modules, Tailwind, Panda CSS)', type: 'subtopic' },
            { id: 'ui-2', title: 'UI (Material UI, Chakra UI, Shadcn UI)', type: 'subtopic' },
            { id: 'ui-3', title: 'Headless (React Aria, Ark UI, Radix UI)', type: 'subtopic' }
          ]
        },
        {
          id: 'router',
          title: 'Routing & Forms',
          type: 'topic',
          children: [
            { id: 'ro-1', title: 'Routers (React Router, Tanstack Router)', type: 'subtopic' },
            { id: 'ro-2', title: 'Forms (React Hook Form, Formik)', type: 'subtopic' },
            { id: 'ro-3', title: 'Types & Validation (Zod, TypeScript)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-testing-sec',
      title: 'Data Fetching & Testing',
      type: 'section',
      children: [
        {
          id: 'data',
          title: 'API Calls',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'GraphQL (Apollo, Relay, urql)', type: 'subtopic' },
            { id: 'da-2', title: 'REST (react-query, Axios, swr, rtk-query)', type: 'subtopic' }
          ]
        },
        {
          id: 'test',
          title: 'Testing & Tools',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Testing (Vitest, Jest, RTL, Cypress, Playwright)', type: 'subtopic' },
            { id: 'te-2', title: 'CLI Tools (Vite)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'adv-next-sec',
      title: 'Advanced & Frameworks',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced & Frameworks',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Animation (Framer Motion, react spring)', type: 'subtopic' },
            { id: 'ad-2', title: 'Server APIs / Suspense / Portals / Error Boundaries', type: 'subtopic' },
            { id: 'ad-3', title: 'Frameworks (Astro, Next.js)', type: 'subtopic' },
            { id: 'ad-4', title: 'React Native (Mobile Applications)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-2', title: 'Next.js Roadmap', type: 'topic', link: { id: 'nextjs', title: 'Next.js' } },
        { id: 'related-3', title: 'JavaScript Roadmap', type: 'topic', link: { id: 'javascript', title: 'JavaScript' } }
      ]
    }
  ]
};
export const redisRoadmap = {
  id: 'redis',
  title: 'Redis',
  description: 'Step by step guide to mastering Redis for caching, messaging, and data storage',
  layout: 'linear',
  category: 'database',
  subscriberCount: '100,000',
  faq: {
    question: 'Is Redis only for caching?',
    answer: 'No, while it excels at caching, Redis is also used for real-time analytics, pub/sub messaging, session management, and even as a primary database with persistence enabled.'
  },
  items: [
    {
      id: 'overview-getting-started-sec',
      title: 'Overview & Getting Started',
      type: 'section',
      children: [
        {
          id: 'overview',
          title: 'Overview & Basics',
          type: 'topic',
          children: [
            { id: 'ov-1', title: 'In-memory Data Structure Store / Key-value Cache', type: 'subtopic' },
            { id: 'ov-2', title: 'Core Use Cases (Caching, Real-time Analytics, Sessions)', type: 'subtopic' },
            { id: 'ov-3', title: 'Redis vs Other DBs / Key Features', type: 'subtopic' }
          ]
        },
        {
          id: 'getting-started',
          title: 'Getting Started',
          type: 'topic',
          children: [
            { id: 'gs-1', title: 'Installing Locally / Running Redis', type: 'subtopic' },
            { id: 'gs-2', title: 'Connecting (Redis CLI) / First Steps', type: 'subtopic' },
            { id: 'gs-3', title: 'Basic Commands (SET, GET, DEL, expire, TTL)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-structures-sec',
      title: 'Data Structures',
      type: 'section',
      children: [
        {
          id: 'core-ds',
          title: 'Core Data Structures',
          type: 'topic',
          children: [
            { id: 'cd-1', title: 'Strings / Lists / Sets', type: 'subtopic' },
            { id: 'cd-2', title: 'Hashes / Sorted Sets (ZADD, ZRANGE)', type: 'subtopic' }
          ]
        },
        {
          id: 'adv-ds',
          title: 'Advanced Data Structures',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Bitmaps / Streams', type: 'subtopic' },
            { id: 'ad-2', title: 'HyperLogLog / Geospatial Indexes', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'working-transactions-sec',
      title: 'Working & Transactions',
      type: 'section',
      children: [
        {
          id: 'working',
          title: 'Working with Redis',
          type: 'topic',
          children: [
            { id: 'wo-1', title: 'Naming Conventions / Retrieval by Pattern', type: 'subtopic' },
            { id: 'wo-2', title: 'Expiration / Key Management', type: 'subtopic' },
            { id: 'wo-3', title: 'Pipelining / Batch Operations', type: 'subtopic' }
          ]
        },
        {
          id: 'trans',
          title: 'Transactions & Pub/Sub',
          type: 'topic',
          children: [
            { id: 'tr-1', title: 'Transactions (WATCH, MULTI, EXEC, Lock)', type: 'subtopic' },
            { id: 'tr-2', title: 'Pub/Sub (SUBSCRIBE, PUBLISH)', type: 'subtopic' },
            { id: 'tr-3', title: 'Lua Scripting (EVAL, EVALSHA)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'architecture-production-sec',
      title: 'Architecture & Production',
      type: 'section',
      children: [
        {
          id: 'arch',
          title: 'Architecture & HA',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Persistence (RDB, AOF, Hybrid)', type: 'subtopic' },
            { id: 'ar-2', title: 'Replication / Sentinel / Clustering', type: 'subtopic' },
            { id: 'ar-3', title: 'Security (Authentication, SSL/TLS)', type: 'subtopic' }
          ]
        },
        {
          id: 'prod',
          title: 'Production & Monitoring',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Memory Mgmt (Max Memory Policy) / Slow Log', type: 'subtopic' },
            { id: 'pr-2', title: 'Tools (RedisInsight, Redis Commander)', type: 'subtopic' },
            { id: 'pr-3', title: 'Backup / Disaster Recovery / Redis Enterprise', type: 'subtopic' },
            { id: 'pr-4', title: 'Modules (Search, RedisJSON, RedisTimeSeries)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-2', title: 'Node.js Roadmap', type: 'topic', link: { id: 'nodejs', title: 'Node.js' } },
        { id: 'related-3', title: 'AWS Roadmap', type: 'topic', link: { id: 'aws', title: 'AWS' } }
      ]
    }
  ]
};
export const rubyOnRailsRoadmap = {
  id: 'ruby-on-rails',
  title: 'Ruby on Rails',
  description: 'Master the full-stack web framework that optimizes for developer happiness',
  layout: 'linear',
  category: 'framework',
  subscriberCount: '150,000',
  faq: {
    question: 'Is Rails still relevant?',
    answer: 'Absolutely. It powers GitHub, Shopify, and Airbnb, and is experiencing a renaissance with Hotwire/Stimulus for building SPAs without complex JS frameworks.'
  },
  items: [
    {
      id: 'intro-setup-sec',
      title: 'Introduction & Setup',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'How the web works / Ruby', type: 'subtopic' },
            { id: 'in-2', title: 'Why Web Frameworks? / MVC architecture', type: 'subtopic' }
          ]
        },
        {
          id: 'setup',
          title: 'Setting up Rails',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Your First Project (Create an App)', type: 'subtopic' },
            { id: 'se-2', title: 'Command Line / Generators', type: 'subtopic' },
            { id: 'se-3', title: 'Directory structure (app, bin, config, db, Gemfile)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'routing-controllers-sec',
      title: 'Routing & Controllers',
      type: 'section',
      children: [
        {
          id: 'route',
          title: 'Routing Fundamentals',
          type: 'topic',
          children: [
            { id: 'ro-1', title: 'RESTful / Nested / Non-RESTful Routes', type: 'subtopic' },
            { id: 'ro-2', title: 'Request Response Flow', type: 'subtopic' },
            { id: 'ro-3', title: 'Redirects / Constraints / Named Routes', type: 'subtopic' }
          ]
        },
        {
          id: 'ctrl',
          title: 'Controllers',
          type: 'topic',
          children: [
            { id: 'ct-1', title: 'Creating Controllers / Actions', type: 'subtopic' },
            { id: 'ct-2', title: 'Strong Parameters', type: 'subtopic' },
            { id: 'ct-3', title: 'Callbacks (filters) / Cookies / Sessions', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'models-activerecord-sec',
      title: 'Models & Active Record',
      type: 'section',
      children: [
        {
          id: 'models',
          title: 'Models & Database',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Creating Models / Data Types / Methods', type: 'subtopic' },
            { id: 'mo-2', title: 'Relationships / Validations / Callbacks', type: 'subtopic' },
            { id: 'mo-3', title: 'Databases / Migrations / Transactions', type: 'subtopic' }
          ]
        },
        {
          id: 'ar',
          title: 'Active Record',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Basic Queries / Conditions / Ordering', type: 'subtopic' },
            { id: 'ar-2', title: 'Joins / Aggregations / Scopes', type: 'subtopic' },
            { id: 'ar-3', title: 'Raw SQL / Query Optimization', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'views-frontend-sec',
      title: 'Views & Frontend',
      type: 'section',
      children: [
        {
          id: 'views',
          title: 'Action Views',
          type: 'topic',
          children: [
            { id: 'vi-1', title: 'ERB Templates / Forms (form_with, form_for)', type: 'subtopic' },
            { id: 'vi-2', title: 'Rendering / Layouts & yield / Partials', type: 'subtopic' },
            { id: 'vi-3', title: 'Helpers / View Component / Phlex', type: 'subtopic' }
          ]
        },
        {
          id: 'fe',
          title: 'Frontend & Auth',
          type: 'topic',
          children: [
            { id: 'fe-1', title: 'Pagination (Pagy, Kaminari) / Caching', type: 'subtopic' },
            { id: 'fe-2', title: 'Assets Pipeline / Advanced Asset Mgmt', type: 'subtopic' },
            { id: 'fe-3', title: 'Auth (Devise) / Authorization (Pundit, CanCanCan)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-advanced-sec',
      title: 'Testing & Advanced',
      type: 'section',
      children: [
        {
          id: 'test',
          title: 'Testing & Debugging',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Logging (Rails Logger)', type: 'subtopic' },
            { id: 'te-2', title: 'Debugging (debug, pry)', type: 'subtopic' },
            { id: 'te-3', title: 'Testing (Minitest, RSpec, Factory Bot, Capybara)', type: 'subtopic' }
          ]
        },
        {
          id: 'adv',
          title: 'Advanced & Deploy',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Plugins & Engines / Mailbox / Background Jobs', type: 'subtopic' },
            { id: 'ad-2', title: 'Security / Storage / Internationalization', type: 'subtopic' },
            { id: 'ad-3', title: 'Deployment (Kamal)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Ruby Roadmap', type: 'topic', link: { id: 'ruby', title: 'Ruby' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Full Stack Roadmap', type: 'topic', link: { id: 'full-stack', title: 'Full Stack' } }
      ]
    }
  ]
};
export const rubyRoadmap = {
  id: 'ruby',
  title: 'Ruby',
  description: 'Master the elegant, object-oriented language optimized for developer happiness',
  layout: 'linear',
  category: 'language',
  subscriberCount: '130,000',
  faq: {
    question: 'Should I learn Ruby without Rails?',
    answer: 'Yes! While Rails is the most popular framework, Ruby itself is a fantastic scripting language with powerful metaprogramming capabilities.'
  },
  items: [
    {
      id: 'basics-data-types-sec',
      title: 'Basics & Data Types',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Syntax Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Constants & Variables / Type Casting', type: 'subtopic' },
            { id: 'ba-2', title: 'Arithmetic / Comparison / Logical / Assignment', type: 'subtopic' },
            { id: 'ba-3', title: 'Comments / Naming conventions / puts, print', type: 'subtopic' }
          ]
        },
        {
          id: 'types',
          title: 'Data Types',
          type: 'topic',
          children: [
            { id: 'ty-1', title: 'Integers / Floats / Strings / Booleans', type: 'subtopic' },
            { id: 'ty-2', title: 'Arrays / Hashes / Symbols / nil', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'control-flow-sec',
      title: 'Control Flow & Enumerable',
      type: 'section',
      children: [
        {
          id: 'flow',
          title: 'Control Flow',
          type: 'topic',
          children: [
            { id: 'fl-1', title: 'Conditional (if, elsif, else, unless, case)', type: 'subtopic' },
            { id: 'fl-2', title: 'Loops (while, until, for, break, next)', type: 'subtopic' },
            { id: 'fl-3', title: 'Exceptions (begin, rescue, ensure)', type: 'subtopic' }
          ]
        },
        {
          id: 'enum',
          title: 'Querying & Standard',
          type: 'topic',
          children: [
            { id: 'en-1', title: 'Enumerable / Querying (Fetching, Sorting, Iterating)', type: 'subtopic' },
            { id: 'en-2', title: 'Date & Time / Regex / File I/O', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'oop-sec',
      title: 'Object Oriented Programming',
      type: 'section',
      children: [
        {
          id: 'oop-methods',
          title: 'Methods & Blocks',
          type: 'topic',
          children: [
            { id: 'me-1', title: 'Defining methods / Scope / Chaining', type: 'subtopic' },
            { id: 'me-2', title: 'Blocks / Procs / Lambdas / send', type: 'subtopic' }
          ]
        },
        {
          id: 'oop-classes',
          title: 'Classes & Objects',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Defining Classes / Instance variables', type: 'subtopic' },
            { id: 'cl-2', title: 'Attributes accessors / Inheritance', type: 'subtopic' },
            { id: 'cl-3', title: 'Modules & Mixins / define_method', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'adv-tooling-sec',
      title: 'Advanced & Tooling',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced Ruby',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Metaprogramming / Ruby DSL', type: 'subtopic' },
            { id: 'ad-2', title: 'Concurrency (Threads, Ractors, Fibers)', type: 'subtopic' },
            { id: 'ad-3', title: 'Closures / Method Lookup / Monkey Patching', type: 'subtopic' }
          ]
        },
        {
          id: 'tools',
          title: 'Tooling & Ecosystem',
          type: 'topic',
          children: [
            { id: 'to-1', title: 'Packages (Ruby Gems, Bundler, RVM)', type: 'subtopic' },
            { id: 'to-2', title: 'Debugging (Pry, irb) / Frameworks (Rails, Sinatra)', type: 'subtopic' },
            { id: 'to-3', title: 'Testing (RSpec, Minitest) / Linting (RuboCop)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Ruby on Rails Roadmap', type: 'topic', link: { id: 'ruby-on-rails', title: 'Ruby on Rails' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } }
      ]
    }
  ]
};
export const rustRoadmap = {
  id: 'rust',
  title: 'Rust',
  description: 'Master the systems programming language that guarantees memory safety without garbage collection',
  layout: 'linear',
  category: 'language',
  subscriberCount: '250,000',
  faq: {
    question: 'Is Rust hard to learn?',
    answer: 'The Borrow Checker and Lifetimes have a steep learning curve, but they prevent entire classes of bugs (like null pointers and data races) at compile time.'
  },
  items: [
    {
      id: 'intro-setup-sec',
      title: 'Introduction & Basics',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Introduction & Setup',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is Rust? / Why use Rust?', type: 'subtopic' },
            { id: 'in-2', title: 'Install Rust & Cargo / IDEs / Rust REPL', type: 'subtopic' },
            { id: 'in-3', title: 'Code Org (Modules, Crates, Cargo, Crates.io)', type: 'subtopic' }
          ]
        },
        {
          id: 'syntax',
          title: 'Syntax & Data Structures',
          type: 'topic',
          children: [
            { id: 'sy-1', title: 'Variables / Constants / Control Flow / Methods', type: 'subtopic' },
            { id: 'sy-2', title: 'Data (Int, Float, Bool, String, Tuple, Vector, Hashmap)', type: 'subtopic' },
            { id: 'sy-3', title: 'Pattern Matching & Destructuring', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ownership-constructs-sec',
      title: 'Ownership & Constructs',
      type: 'section',
      children: [
        {
          id: 'own',
          title: 'Ownership System',
          type: 'topic',
          children: [
            { id: 'ow-1', title: 'Ownership Rules & Memory Safety', type: 'subtopic' },
            { id: 'ow-2', title: 'Borrowing, References and Slices', type: 'subtopic' },
            { id: 'ow-3', title: 'Deep Dive: Stack vs Heap', type: 'subtopic' }
          ]
        },
        {
          id: 'constructs',
          title: 'Constructs & Errors',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Enums / Traits / Structs / Impl Blocks', type: 'subtopic' },
            { id: 'co-2', title: 'Error Handling (Option, Result)', type: 'subtopic' },
            { id: 'co-3', title: 'Propagating Errors (?) / Custom Errors', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'concurrency-testing-sec',
      title: 'Concurrency & Testing',
      type: 'section',
      children: [
        {
          id: 'conc',
          title: 'Concurrency',
          type: 'topic',
          children: [
            { id: 'cn-1', title: 'RC / Arc / Mutex / RwLock / Channels', type: 'subtopic' },
            { id: 'cn-2', title: 'Threads, Channels and Message Passing', type: 'subtopic' },
            { id: 'cn-3', title: 'Atomics / Futures / Async/Await Paradigm', type: 'subtopic' }
          ]
        },
        {
          id: 'test',
          title: 'Testing & Performance',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Unit & Integration / Mocking', type: 'subtopic' },
            { id: 'te-2', title: 'Performance Profiling (Criterion.rs)', type: 'subtopic' },
            { id: 'te-3', title: 'Debugging (rust-gdb, rustdoc)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-ecosystem-sec',
      title: 'Advanced Topics & Ecosystem',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced Topics',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Traits & Generics / Bounds', type: 'subtopic' },
            { id: 'ad-2', title: 'Macros & Metaprogramming (Declarative)', type: 'subtopic' },
            { id: 'ad-3', title: 'Lifetimes & Borrow Checker (Annotations)', type: 'subtopic' }
          ]
        },
        {
          id: 'eco',
          title: 'Ecosystem & Libraries',
          type: 'topic',
          children: [
            { id: 'ec-1', title: 'Web Dev (Axum, Actix, Rocket)', type: 'subtopic' },
            { id: 'ec-2', title: 'Async (Tokio) / DB (Diesel, sqlx)', type: 'subtopic' },
            { id: 'ec-3', title: 'GUI (Tauri) / WASM (wasm-pack) / CLI', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'WebAssembly Roadmap', type: 'topic', link: { id: 'webassembly', title: 'WebAssembly' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const scalaRoadmap = {
  id: 'scala',
  title: 'Scala',
  description: 'Master the JVM language that seamlessly blends Object-Oriented and Functional Programming',
  layout: 'linear',
  category: 'language',
  subscriberCount: '110,000',
  faq: {
    question: 'Why learn Scala instead of Java?',
    answer: 'Scala offers a more concise syntax, powerful functional programming features, and is the primary language for big data frameworks like Apache Spark.'
  },
  items: [
    {
      id: 'intro-basics-sec',
      title: 'Introduction & Basics',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Setup & Tools',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'IDEs (IntelliJ IDEA, VS Code)', type: 'subtopic' },
            { id: 'in-2', title: 'Build Tools (sbt, Scala CLI, Mill, Gradle)', type: 'subtopic' },
            { id: 'in-3', title: 'Platforms (JVM, Scala Native, Scala.js)', type: 'subtopic' }
          ]
        },
        {
          id: 'basics',
          title: 'Learn the Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Data Types / Generics / Type Hierarchy', type: 'subtopic' },
            { id: 'ba-2', title: 'Class Trait Object / Conditionals / Loops', type: 'subtopic' },
            { id: 'ba-3', title: 'Functions & Methods / Pattern Matching', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-fp-sec',
      title: 'Data Structures & Functional Concepts',
      type: 'section',
      children: [
        {
          id: 'data',
          title: 'Data Structures',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'Collections (Seq, List, Set, Map, Array)', type: 'subtopic' },
            { id: 'da-2', title: 'Methods (map, flatMap, filter, foldLeft)', type: 'subtopic' },
            { id: 'da-3', title: 'Regex & Strings', type: 'subtopic' }
          ]
        },
        {
          id: 'fp',
          title: 'Functional Concepts',
          type: 'topic',
          children: [
            { id: 'fp-1', title: 'Error Handling (Option, Either, Try)', type: 'subtopic' },
            { id: 'fp-2', title: 'Laziness / Implicit Parameter / Recursion', type: 'subtopic' },
            { id: 'fp-3', title: 'Scope & Visibility (private, protected)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ecosystem-advanced-sec',
      title: 'Ecosystems & Advanced Topics',
      type: 'section',
      children: [
        {
          id: 'eco',
          title: 'Ecosystems & Testing',
          type: 'topic',
          children: [
            { id: 'ec-1', title: 'Ecosystems (Cats, ZIO, Akka)', type: 'subtopic' },
            { id: 'ec-2', title: 'Testing (ScalaTest, JUnit, mUnit, uTest)', type: 'subtopic' },
            { id: 'ec-3', title: 'Integration Testing (Gatling)', type: 'subtopic' }
          ]
        },
        {
          id: 'adv',
          title: 'Advanced Topics',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Pure Functions / Monads / Typeclasses', type: 'subtopic' },
            { id: 'ad-2', title: 'Type System (Variance, Context Bounds)', type: 'subtopic' },
            { id: 'ad-3', title: 'Macros / Capture Checking', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'frameworks-sec',
      title: 'Frameworks & Libraries',
      type: 'section',
      children: [
        {
          id: 'web',
          title: 'Web & Distributed',
          type: 'topic',
          children: [
            { id: 'we-1', title: 'Backend (Play, Http4s, Akka HTTP)', type: 'subtopic' },
            { id: 'we-2', title: 'Distributed (Spark, Akka)', type: 'subtopic' },
            { id: 'we-3', title: 'GUI / Android / Desktop', type: 'subtopic' }
          ]
        },
        {
          id: 'libs',
          title: 'Data Handling & Concurrency',
          type: 'topic',
          children: [
            { id: 'li-1', title: 'DB (Doobie, Quill, Slick)', type: 'subtopic' },
            { id: 'li-2', title: 'JSON (PlayJSON, Circe, uPickle)', type: 'subtopic' },
            { id: 'li-3', title: 'Concurrency (FS2, ZIO Streams)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Java Roadmap', type: 'topic', link: { id: 'java', title: 'Java' } },
        { id: 'related-2', title: 'Data Engineer Roadmap', type: 'topic', link: { id: 'data-engineer', title: 'Data Engineer' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const serverSideGameDeveloperRoadmap = {
  id: 'server-side-game-developer',
  title: 'Server-Side Game Developer',
  description: 'Build scalable multiplayer backends, matchmaking systems, and dedicated game servers',
  layout: 'linear',
  category: 'role',
  subscriberCount: '75,000',
  faq: {
    question: 'Do I need to know Unity or Unreal?',
    answer: 'While helpful, your primary focus is backend architecture: networking (UDP/TCP), databases, and deploying game servers via Kubernetes or Agones.'
  },
  items: [
    {
      id: 'networking-sec',
      title: 'Networking Fundamentals',
      type: 'section',
      children: [
        {
          id: 'net-fund',
          title: 'Networking Fundamentals',
          type: 'topic',
          children: [
            { id: 'nf-1', title: 'Data Transfer / IP (IPv4, IPv6) / Security (TLS, SSL)', type: 'subtopic' },
            { id: 'nf-2', title: 'Packet Structure / Routing / DoS / Connection Hijacking', type: 'subtopic' },
            { id: 'nf-3', title: 'Congestion Control (Flow Control, Link Capacity)', type: 'subtopic' },
            { id: 'nf-4', title: 'Reliability (Ordered vs Unordered, Packet vs Datagram)', type: 'subtopic' }
          ]
        },
        {
          id: 'net-proto',
          title: 'Protocols & Sockets',
          type: 'topic',
          children: [
            { id: 'np-1', title: 'TCP (Window Scaling, Reliable vs Unreliable, Streams)', type: 'subtopic' },
            { id: 'np-2', title: 'UDP (Checksum, Segment Structure)', type: 'subtopic' },
            { id: 'np-3', title: 'Socket Programming (BSD Socket, Winsock, API)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'core-programming-sec',
      title: 'Core Programming & Architecture',
      type: 'section',
      children: [
        {
          id: 'prog',
          title: 'Languages & Concurrency',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'Languages (C++, C#, Java, Go, Erlang)', type: 'subtopic' },
            { id: 'pr-2', title: 'Concurrency (Threads, Async-await, goroutine)', type: 'subtopic' },
            { id: 'pr-3', title: 'Synchronization (Mutex, Semaphore, Spinlock)', type: 'subtopic' }
          ]
        },
        {
          id: 'arch',
          title: 'Architecture & Patterns',
          type: 'topic',
          children: [
            { id: 'ar-1', title: 'Serialization (JSON, Protobuf, XML)', type: 'subtopic' },
            { id: 'ar-2', title: 'Design Patterns (DI, Dump Analysis)', type: 'subtopic' },
            { id: 'ar-3', title: 'Update Process (Determinism, Synchrony)', type: 'subtopic' },
            { id: 'ar-4', title: 'Reactive Approach (Actor Model, Reactor)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-comms-sec',
      title: 'Data & Communications',
      type: 'section',
      children: [
        {
          id: 'data',
          title: 'Databases & Caching',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'RDBMS (MySQL, PostgreSQL, MS SQL)', type: 'subtopic' },
            { id: 'da-2', title: 'NoSQL (MongoDB, DynamoDB, Cassandra)', type: 'subtopic' },
            { id: 'da-3', title: 'Caching (Redis, Memcached) / ORM & DAL', type: 'subtopic' }
          ]
        },
        {
          id: 'comm',
          title: 'RPC & Messaging',
          type: 'topic',
          children: [
            { id: 'cm-1', title: 'RPC / REST / gRPC', type: 'subtopic' },
            { id: 'cm-2', title: 'Message Queues (RabbitMQ)', type: 'subtopic' },
            { id: 'cm-3', title: 'Event Streaming (Apache Kafka)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'infra-io-sec',
      title: 'Infrastructure & AI',
      type: 'section',
      children: [
        {
          id: 'infra',
          title: 'Infrastructure & I/O',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'I/O Models (epoll, IOCP, io_uring, kqueue)', type: 'subtopic' },
            { id: 'in-2', title: 'Containerization (Docker, Kubernetes)', type: 'subtopic' },
            { id: 'in-3', title: 'Cloud Platforms (AWS, Azure, GCP)', type: 'subtopic' }
          ]
        },
        {
          id: 'ai',
          title: 'AI & Data Processing',
          type: 'topic',
          children: [
            { id: 'ai-1', title: 'Data Clustering (Apache Spark)', type: 'subtopic' },
            { id: 'ai-2', title: 'AI & Deep Learning (TensorFlow, PyTorch)', type: 'subtopic' },
            { id: 'ai-3', title: 'Cloud ML (AWS, Azure)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Game Developer Roadmap', type: 'topic', link: { id: 'game-developer', title: 'Game Developer' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } }
      ]
    }
  ]
};
export const shellBashRoadmap = {
  id: 'shell-bash',
  title: 'Shell/Bash',
  description: 'Master the command line to automate tasks, parse text, and manage servers efficiently',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '180,000',
  faq: {
    question: 'Should I learn Bash or Python for scripting?',
    answer: 'Both! Bash is unbeatable for quick file operations, process management, and CI/CD pipelines. Move to Python when the logic gets complex or requires API calls.'
  },
  items: [
    {
      id: 'intro-fundamentals-sec',
      title: 'Intro & Shell Fundamentals',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Intro & Fundamentals',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is a shell? / Popular Shells (bash, zsh)', type: 'subtopic' },
            { id: 'in-2', title: 'Tab Completion / Alias / Stop Execution', type: 'subtopic' },
            { id: 'in-3', title: 'Text Editors (Nano, Vim, Emacs)', type: 'subtopic' },
            { id: 'in-4', title: 'Running Shell Scripts (Direct, Bash, Source)', type: 'subtopic' }
          ]
        },
        {
          id: 'io',
          title: 'Files, I/O & Text',
          type: 'topic',
          children: [
            { id: 'io-1', title: 'Files (pwd, ls, cd, mkdir, mv, cp, rm)', type: 'subtopic' },
            { id: 'io-2', title: 'I/O (stdin, stdout, stderr, Redirects, Pipes)', type: 'subtopic' },
            { id: 'io-3', title: 'Text (grep, cut, awk, sed, sort, wc, head)', type: 'subtopic' },
            { id: 'io-4', title: 'Wildcards (*, ?, [...])', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'scripting-data-sec',
      title: 'Scripting & Data',
      type: 'section',
      children: [
        {
          id: 'vars',
          title: 'Variables & Data',
          type: 'topic',
          children: [
            { id: 'va-1', title: 'Variables / Env vars / Special vars ($1, $?)', type: 'subtopic' },
            { id: 'va-2', title: 'Data Types (Arrays, Associative Arrays)', type: 'subtopic' },
            { id: 'va-3', title: 'Here documents / Here strings / Literals', type: 'subtopic' },
            { id: 'va-4', title: 'File Permissions (chmod, chown, chgrp)', type: 'subtopic' }
          ]
        },
        {
          id: 'ops',
          title: 'Operators & Manipulation',
          type: 'topic',
          children: [
            { id: 'op-1', title: 'Bash Operators (Arithmetic, Comparison, Logical)', type: 'subtopic' },
            { id: 'op-2', title: 'Numerics (expr, bc, let, awk)', type: 'subtopic' },
            { id: 'op-3', title: 'String Manipulation (length, substring, pattern)', type: 'subtopic' },
            { id: 'op-4', title: 'Regular Expressions (Basic, Extended, grep)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'control-flow-functions-sec',
      title: 'Control Flow & Functions',
      type: 'section',
      children: [
        {
          id: 'flow',
          title: 'Conditionals & Loops',
          type: 'topic',
          children: [
            { id: 'fl-1', title: 'Conditionals (if, case)', type: 'subtopic' },
            { id: 'fl-2', title: 'Loops (for, while, until)', type: 'subtopic' },
            { id: 'fl-3', title: 'break, continue', type: 'subtopic' }
          ]
        },
        {
          id: 'funcs',
          title: 'Functions & Error Handling',
          type: 'topic',
          children: [
            { id: 'fu-1', title: 'Functions / Scopes / Recursive', type: 'subtopic' },
            { id: 'fu-2', title: 'Debugging (set -x, shellcheck)', type: 'subtopic' },
            { id: 'fu-3', title: 'Error Handling (set -e, set -u, trap, logging)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'system-network-sec',
      title: 'System & Network',
      type: 'section',
      children: [
        {
          id: 'sys',
          title: 'System & Process Mgt',
          type: 'topic',
          children: [
            { id: 'sy-1', title: 'Process (jobs, fg, bg, ps, top, kill)', type: 'subtopic' },
            { id: 'sy-2', title: 'Sys Monitoring (free, df, du, uptime)', type: 'subtopic' },
            { id: 'sy-3', title: 'Task Schedulling (cron, at, systemd)', type: 'subtopic' }
          ]
        },
        {
          id: 'net',
          title: 'Networking & Utils',
          type: 'topic',
          children: [
            { id: 'ne-1', title: 'Net (ping, curl, wget, ssh, scp, rsync)', type: 'subtopic' },
            { id: 'ne-2', title: 'Package Management (apt, brew, yum)', type: 'subtopic' },
            { id: 'ne-3', title: 'File Compression (tar, zip, gzip, bzip2)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Linux Roadmap', type: 'topic', link: { id: 'linux', title: 'Linux' } },
        { id: 'related-2', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const softwareArchitectRoadmap = {
  id: 'software-architect',
  title: 'Software Architect',
  description: 'Design scalable, highly available, and maintainable large-scale systems',
  layout: 'linear',
  category: 'role',
  subscriberCount: '210,000',
  faq: {
    question: 'How do I transition from Senior Dev to Architect?',
    answer: 'Shift your focus from "how to write this code" to "how do these systems interact." Deepen your knowledge of system design, trade-offs (CAP theorem), and technical leadership.'
  },
  items: [
    {
      id: 'basics-skills-sec',
      title: 'Basics & Skills',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Understand the Basics',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Levels of Architecture (Application, Solution, Enterprise)', type: 'subtopic' },
            { id: 'ba-2', title: 'Software Design & Architecture Concepts', type: 'subtopic' }
          ]
        },
        {
          id: 'skills',
          title: 'Responsibilities & Skills',
          type: 'topic',
          children: [
            { id: 'sk-1', title: 'Decision Making / Tech Decisions', type: 'subtopic' },
            { id: 'sk-2', title: 'Documentation / Communication / Tools (Slack)', type: 'subtopic' },
            { id: 'sk-3', title: 'Collaborate / Consult / Evaluate / Balance', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tech-patterns-sec',
      title: 'Tech & Patterns',
      type: 'section',
      children: [
        {
          id: 'tech',
          title: 'Programming & Data',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Languages (Java, Go, Python, JS, .NET)', type: 'subtopic' },
            { id: 'te-2', title: 'Working with Data (SQL, NoSQL, ETL, Datawarehouses)', type: 'subtopic' },
            { id: 'te-3', title: 'Analytics (Hadoop, Spark)', type: 'subtopic' }
          ]
        },
        {
          id: 'patterns',
          title: 'Patterns & Design Principles',
          type: 'topic',
          children: [
            { id: 'pa-1', title: 'Microservices / Serverless / Distributed Systems', type: 'subtopic' },
            { id: 'pa-2', title: 'ACID, CAP Theorem / Eventual Consistency', type: 'subtopic' },
            { id: 'pa-3', title: 'SOLID, TDD, DDD / OOP, Functional, Reactive', type: 'subtopic' },
            { id: 'pa-4', title: 'MVC, MVP / CQRS / Client-Server, Layered', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'web-apis-sec',
      title: 'Web, APIs & Infrastructure',
      type: 'section',
      children: [
        {
          id: 'web',
          title: 'Web, Mobile & APIs',
          type: 'topic',
          children: [
            { id: 'we-1', title: 'React, Vue, Angular / SPA, SSR, SSG', type: 'subtopic' },
            { id: 'we-2', title: 'Microfrontends', type: 'subtopic' },
            { id: 'we-3', title: 'APIs & Integrations (gRPC, REST, GraphQL, SOAP, ESB)', type: 'subtopic' }
          ]
        },
        {
          id: 'infra',
          title: 'Infrastructure & Ops',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Infrastructure as Code / CI/CD / Containers', type: 'subtopic' },
            { id: 'in-2', title: 'Cloud Providers / Serverless Concepts', type: 'subtopic' },
            { id: 'in-3', title: 'Networks / TCP/IP, OSI / Proxies, Firewalls', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'management-enterprise-sec',
      title: 'Management & Enterprise',
      type: 'section',
      children: [
        {
          id: 'mgmt',
          title: 'Management & Frameworks',
          type: 'topic',
          children: [
            { id: 'mg-1', title: 'Agile (Scrum, Kanban, LeSS, SaFe)', type: 'subtopic' },
            { id: 'mg-2', title: 'Frameworks (PMI, ITIL, BABOK, Prince2)', type: 'subtopic' },
            { id: 'mg-3', title: 'Certifications (UML, TOGAF)', type: 'subtopic' }
          ]
        },
        {
          id: 'enter',
          title: 'Enterprise Software',
          type: 'topic',
          children: [
            { id: 'en-1', title: 'MS Dynamics / SAP ERP, HANA', type: 'subtopic' },
            { id: 'en-2', title: 'EMC DMS / IBM BPM', type: 'subtopic' },
            { id: 'en-3', title: 'Salesforce', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'System Design Roadmap', type: 'topic', link: { id: 'system-design', title: 'System Design' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Engineering Manager Roadmap', type: 'topic', link: { id: 'engineering-manager', title: 'Engineering Manager' } }
      ]
    }
  ]
};
export const softwareDesignArchitectureRoadmap = {
  id: 'software-design-architecture',
  title: 'Software Design & Architecture',
  description: 'Master the principles and patterns used to structure robust, maintainable codebases',
  layout: 'linear',
  category: 'concept',
  subscriberCount: '195,000',
  faq: {
    question: 'What is the difference between Design and Architecture?',
    answer: 'Design focuses on the organization of classes and functions (micro-level), while Architecture focuses on how high-level components and systems interact (macro-level).'
  },
  items: [
    {
      id: 'clean-code-paradigms-sec',
      title: 'Clean Code & Paradigms',
      type: 'section',
      children: [
        {
          id: 'clean',
          title: 'Clean Code',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Be consistent / Meaningful names', type: 'subtopic' },
            { id: 'cl-2', title: 'Pure functions / Minimize complexity', type: 'subtopic' },
            { id: 'cl-3', title: 'Keep methods & classes small', type: 'subtopic' }
          ]
        },
        {
          id: 'paradigm',
          title: 'Programming Paradigms',
          type: 'topic',
          children: [
            { id: 'pa-1', title: 'Structured / Functional / OOP', type: 'subtopic' },
            { id: 'pa-2', title: 'OOP Principles (Inheritance, Polymorphism)', type: 'subtopic' },
            { id: 'pa-3', title: 'Interfaces / Abstract Classes', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'principles-patterns-sec',
      title: 'Principles & Patterns',
      type: 'section',
      children: [
        {
          id: 'prin',
          title: 'Design Principles',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'SOLID / DRY / YAGNI / KISS', type: 'subtopic' },
            { id: 'pr-2', title: 'Law of Demeter / Hollywood Principle', type: 'subtopic' },
            { id: 'pr-3', title: 'Component Principles / Coupling / Boundaries', type: 'subtopic' }
          ]
        },
        {
          id: 'patterns',
          title: 'Design Patterns',
          type: 'topic',
          children: [
            { id: 'dp-1', title: 'GoF Patterns / PoSA Patterns', type: 'subtopic' },
            { id: 'dp-2', title: 'Domain-Driven Design / Model-Driven', type: 'subtopic' },
            { id: 'dp-3', title: 'Enterprise Patterns (CQRS, Event Sourcing)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'architecture-sec',
      title: 'Architecture',
      type: 'section',
      children: [
        {
          id: 'arch-prin',
          title: 'Architectural Principles',
          type: 'topic',
          children: []
        },
        {
          id: 'styles',
          title: 'Architectural Styles',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Event-Driven / Publish-Subscribe', type: 'subtopic' },
            { id: 'st-2', title: 'Layered / Messaging / Distributed', type: 'subtopic' },
            { id: 'st-3', title: 'Client-Server / Peer-to-Peer', type: 'subtopic' }
          ]
        },
        {
          id: 'arch-pat',
          title: 'Architectural Patterns',
          type: 'topic',
          children: [
            { id: 'ap-1', title: 'Monolithic / Microservices', type: 'subtopic' },
            { id: 'ap-2', title: 'Serverless Architecture / Message Queues', type: 'subtopic' },
            { id: 'ap-3', title: 'Blackboard / Microkernel', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'System Design Roadmap', type: 'topic', link: { id: 'system-design', title: 'System Design' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Software Architect Roadmap', type: 'topic', link: { id: 'software-architect', title: 'Software Architect' } }
      ]
    }
  ]
};
export const springBootRoadmap = {
  id: 'spring-boot',
  title: 'Spring Boot',
  description: 'Master the dominant Java framework for building enterprise-grade applications',
  layout: 'linear',
  category: 'framework',
  subscriberCount: '220,000',
  faq: {
    question: 'Do I need to know Spring Framework first?',
    answer: 'It helps to understand Dependency Injection and Inversion of Control, but Spring Boot abstracts away the complex XML configuration so you can start directly with Boot.'
  },
  items: [
    {
      id: 'core-web-sec',
      title: 'Core & Web',
      type: 'section',
      children: [
        {
          id: 'core',
          title: 'Spring IOC & Core',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Dependency Injection / Configuration', type: 'subtopic' },
            { id: 'co-2', title: 'Spring Bean Scope / Autoconfiguration', type: 'subtopic' },
            { id: 'co-3', title: 'Architecture / Terminology', type: 'subtopic' }
          ]
        },
        {
          id: 'web',
          title: 'Spring MVC & Web',
          type: 'topic',
          children: [
            { id: 'we-1', title: 'Annotations / Components', type: 'subtopic' },
            { id: 'we-2', title: 'Servlet / JSP Files', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'data-security-sec',
      title: 'Data & Security',
      type: 'section',
      children: [
        {
          id: 'data',
          title: 'Spring Data',
          type: 'topic',
          children: [
            { id: 'da-1', title: 'Hibernate / Spring Data JPA', type: 'subtopic' },
            { id: 'da-2', title: 'Spring Data MongoDB / JDBC', type: 'subtopic' }
          ]
        },
        {
          id: 'sec',
          title: 'Spring Security & AOP',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Authentication vs Authorization', type: 'subtopic' },
            { id: 'se-2', title: 'OAuth2 / JWT Authentication', type: 'subtopic' },
            { id: 'se-3', title: 'Spring AOP (Transactions)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-cloud-sec',
      title: 'Testing & Cloud',
      type: 'section',
      children: [
        {
          id: 'test',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Mock MVC / JPA Test', type: 'subtopic' },
            { id: 'te-2', title: '@SpringBootTest / @MockBean', type: 'subtopic' }
          ]
        },
        {
          id: 'cloud',
          title: 'Spring Cloud & Starters',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Microservices (Spring Cloud, Eureka)', type: 'subtopic' },
            { id: 'cl-2', title: 'API Gateway / Config / Circuit Breaker', type: 'subtopic' },
            { id: 'cl-3', title: 'Open Feign / Micrometer / Embedded Server', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Java Roadmap', type: 'topic', link: { id: 'java', title: 'Java' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Backend Beginner Roadmap', type: 'topic', link: { id: 'backend-beginner', title: 'Backend Beginner' } }
      ]
    }
  ]
};
export const sqlRoadmap = {
  id: 'sql',
  title: 'SQL',
  description: 'Master the language of databases to query, manipulate, and analyze data',
  layout: 'linear',
  category: 'language',
  subscriberCount: '350,000',
  faq: {
    question: 'Do I need to learn a specific dialect (PostgreSQL, MySQL)?',
    answer: 'Start with standard ANSI SQL. The core concepts (SELECT, JOIN, GROUP BY) apply everywhere. Once you master the basics, learn the specific dialect of your chosen database.'
  },
  items: [
    {
      id: 'basics-sec',
      title: 'Basics & Queries',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Basics & Syntax',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'Relational Databases / SQL vs NoSQL', type: 'subtopic' },
            { id: 'ba-2', title: 'SQL Keywords / Data Types / Operators', type: 'subtopic' }
          ]
        },
        {
          id: 'dml',
          title: 'DML & Queries',
          type: 'topic',
          children: [
            { id: 'dm-1', title: 'SELECT, INSERT, UPDATE, DELETE', type: 'subtopic' },
            { id: 'dm-2', title: 'FROM, WHERE, JOINs', type: 'subtopic' },
            { id: 'dm-3', title: 'GROUP BY, ORDER BY, HAVING', type: 'subtopic' },
            { id: 'dm-4', title: 'Aggregates (SUM, COUNT, AVG, MIN, MAX)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ddl-joins-sec',
      title: 'DDL & Subqueries',
      type: 'section',
      children: [
        {
          id: 'ddl',
          title: 'DDL & Constraints',
          type: 'topic',
          children: [
            { id: 'dd-1', title: 'Create, Alter, Drop, Truncate Table', type: 'subtopic' },
            { id: 'dd-2', title: 'Primary Key, Foreign Key', type: 'subtopic' },
            { id: 'dd-3', title: 'Unique, NOT NULL, CHECK', type: 'subtopic' }
          ]
        },
        {
          id: 'joins',
          title: 'Subqueries & JOINs',
          type: 'topic',
          children: [
            { id: 'jo-1', title: 'Nested & Correlated Subqueries', type: 'subtopic' },
            { id: 'jo-2', title: 'INNER / LEFT / RIGHT / FULL OUTER JOIN', type: 'subtopic' },
            { id: 'jo-3', title: 'Self Join / Cross Join', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-objects-sec',
      title: 'Views, Indexes & Transactions',
      type: 'section',
      children: [
        {
          id: 'objects',
          title: 'Views & Indexes',
          type: 'topic',
          children: [
            { id: 'ob-1', title: 'Creating & Modifying Views', type: 'subtopic' },
            { id: 'ob-2', title: 'Managing Indexes', type: 'subtopic' }
          ]
        },
        {
          id: 'trans',
          title: 'Transactions & Procedures',
          type: 'topic',
          children: [
            { id: 'tr-1', title: 'ACID / BEGIN, COMMIT, ROLLBACK', type: 'subtopic' },
            { id: 'tr-2', title: 'Isolation Levels / SAVEPOINT', type: 'subtopic' },
            { id: 'tr-3', title: 'Stored Procedures / Data Integrity / GRANT', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-sql-perf-sec',
      title: 'Advanced SQL & Optimization',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced SQL',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Window Functions (rank, lead)', type: 'subtopic' },
            { id: 'ad-2', title: 'Recursive Queries / CTEs', type: 'subtopic' },
            { id: 'ad-3', title: 'Pivot, Unpivot / Dynamic SQL', type: 'subtopic' }
          ]
        },
        {
          id: 'perf',
          title: 'Performance Optimization',
          type: 'topic',
          children: [
            { id: 'pe-1', title: 'Query Analysis / Using Indexes', type: 'subtopic' },
            { id: 'pe-2', title: 'Optimizing Joins / Reducing Subqueries', type: 'subtopic' },
            { id: 'pe-3', title: 'Selective Projection', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'PostgreSQL DBA Roadmap', type: 'topic', link: { id: 'postgresql-dba', title: 'PostgreSQL DBA' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Data Analyst Roadmap', type: 'topic', link: { id: 'data-analyst', title: 'Data Analyst' } }
      ]
    }
  ]
};
export const swiftUiRoadmap = {
  id: 'swift-ui',
  title: 'Swift & SwiftUI',
  description: 'Master Apple\'s modern, declarative UI framework for iOS, macOS, and watchOS',
  layout: 'linear',
  category: 'mobile',
  subscriberCount: '160,000',
  faq: {
    question: 'Should I learn UIKit or SwiftUI first?',
    answer: 'Start with SwiftUI. It is the future of Apple platforms. You only need to learn UIKit when you encounter legacy codebases or missing components in SwiftUI.'
  },
  items: [
    {
      id: 'swift-core-sec',
      title: 'Swift Core',
      type: 'section',
      children: [
        {
          id: 'swift-basics',
          title: 'Swift Basics & Data',
          type: 'topic',
          children: [
            { id: 'sb-1', title: 'Variables / Type Annotations / Operators', type: 'subtopic' },
            { id: 'sb-2', title: 'Integers, Booleans, Floats / Optionals', type: 'subtopic' },
            { id: 'sb-3', title: 'Type System / Type Safety / Type Inference', type: 'subtopic' }
          ]
        },
        {
          id: 'swift-flow',
          title: 'Flow, Functions & Types',
          type: 'topic',
          children: [
            { id: 'sf-1', title: 'if / switch / Loops (for, while)', type: 'subtopic' },
            { id: 'sf-2', title: 'Functions (Parameters, Returns, Closures)', type: 'subtopic' },
            { id: 'sf-3', title: 'Enumerations / Structs & Classes', type: 'subtopic' },
            { id: 'sf-4', title: 'Protocols / Generics / Error Handling', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'swiftui-views-sec',
      title: 'SwiftUI & Views',
      type: 'section',
      children: [
        {
          id: 'swiftui',
          title: 'SwiftUI & Views',
          type: 'topic',
          children: [
            { id: 'su-1', title: 'App Lifecycle / Basic Views (Text, Image)', type: 'subtopic' },
            { id: 'su-2', title: 'Layout Views (HStack, VStack, ZStack)', type: 'subtopic' },
            { id: 'su-3', title: 'Modifiers / Navigation Views (NavigationStack)', type: 'subtopic' }
          ]
        },
        {
          id: 'state',
          title: 'State & Interactions',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Data Flow (@State, @Binding, @StateObject)', type: 'subtopic' },
            { id: 'st-2', title: 'Gestures / Drag & Drop / Accessibility', type: 'subtopic' },
            { id: 'st-3', title: 'Animations (Implicit, Explicit, Transitions)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-data-sec',
      title: 'Advanced & Concurrency',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced & Persistence',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'ARC / Result Builders / Macros', type: 'subtopic' },
            { id: 'ad-2', title: 'Core Data / SwiftData / Realm', type: 'subtopic' },
            { id: 'ad-3', title: 'UserDefaults / AppStorage / CloudKit', type: 'subtopic' }
          ]
        },
        {
          id: 'async',
          title: 'Async & Concurrency',
          type: 'topic',
          children: [
            { id: 'as-1', title: 'Async Functions / Sequences', type: 'subtopic' },
            { id: 'as-2', title: 'Tasks / Actors / Concurrency Checking', type: 'subtopic' },
            { id: 'as-3', title: 'SwiftUI with Async/Await', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'tooling-sec',
      title: 'Tooling & Architecture',
      type: 'section',
      children: [
        {
          id: 'tools',
          title: 'Tooling & Architecture',
          type: 'topic',
          children: [
            { id: 'to-1', title: 'Swift Package Manager / Testing (XCTest)', type: 'subtopic' },
            { id: 'to-2', title: 'Architecture (MVVM, Clean Architecture)', type: 'subtopic' },
            { id: 'to-3', title: 'Debugging / Server Frameworks (Vapor)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'iOS Roadmap', type: 'topic', link: { id: 'ios', title: 'iOS' } },
        { id: 'related-2', title: 'Mobile Roadmap', type: 'topic', link: { id: 'mobile', title: 'Mobile' } },
        { id: 'related-3', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } }
      ]
    }
  ]
};
export const systemDesignRoadmap = {
  id: 'system-design',
  title: 'System Design',
  description: 'Master the concepts needed to pass Big Tech system design interviews (e.g., "Design Twitter")',
  layout: 'linear',
  category: 'concept',
  subscriberCount: '450,000',
  faq: {
    question: 'How do I prepare for a System Design Interview?',
    answer: 'Learn the core building blocks (Load Balancers, Caching, Databases, Message Queues). Then, practice applying them to common problems using a structured approach (Requirements -> Capacity Eval -> High-Level Design -> Deep Dive).'
  },
  items: [
    {
      id: 'intro-patterns-sec',
      title: 'Intro & Patterns',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Intro & Trade-offs',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'What is System Design? / How to approach it?', type: 'subtopic' },
            { id: 'in-2', title: 'Performance vs Scalability / Latency vs Throughput', type: 'subtopic' },
            { id: 'in-3', title: 'Availability vs Consistency / CAP Theorem', type: 'subtopic' }
          ]
        },
        {
          id: 'patterns',
          title: 'Consistency & Availability',
          type: 'topic',
          children: [
            { id: 'pa-1', title: 'Weak, Eventual, Strong Consistency', type: 'subtopic' },
            { id: 'pa-2', title: 'Fail-Over (Active-Active, Active-Passive)', type: 'subtopic' },
            { id: 'pa-3', title: 'Replication (Master-Slave, Master-Master)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'application-storage-sec',
      title: 'Application & Storage',
      type: 'section',
      children: [
        {
          id: 'app',
          title: 'Application Layer',
          type: 'topic',
          children: [
            { id: 'ap-1', title: 'DNS / CDNs (Push, Pull)', type: 'subtopic' },
            { id: 'ap-2', title: 'Microservices / Service Discovery', type: 'subtopic' },
            { id: 'ap-3', title: 'Load Balancers (Layer 4 vs Layer 7, LB Algos)', type: 'subtopic' }
          ]
        },
        {
          id: 'db',
          title: 'Databases & Storage',
          type: 'topic',
          children: [
            { id: 'db-1', title: 'SQL vs NoSQL (Key-Value, Document, Graph)', type: 'subtopic' },
            { id: 'db-2', title: 'Horizontal Scaling / Replication / Sharding', type: 'subtopic' },
            { id: 'db-3', title: 'Federation / Denormalization / SQL Tuning', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'caching-comm-sec',
      title: 'Caching & Communication',
      type: 'section',
      children: [
        {
          id: 'cache',
          title: 'Caching & Asynchronism',
          type: 'topic',
          children: [
            { id: 'ca-1', title: 'Client, CDN, Web, DB, App Caching', type: 'subtopic' },
            { id: 'ca-2', title: 'Cache Aside / Write-through / Write-behind', type: 'subtopic' },
            { id: 'ca-3', title: 'Task Queues / Message Queues / Back Pressure', type: 'subtopic' }
          ]
        },
        {
          id: 'comm',
          title: 'Communication & Antipatterns',
          type: 'topic',
          children: [
            { id: 'cm-1', title: 'HTTP, TCP, UDP / RPC, gRPC / REST, GraphQL', type: 'subtopic' },
            { id: 'cm-2', title: 'Noisy Neighbor / Synchronous I/O / Busy DB', type: 'subtopic' },
            { id: 'cm-3', title: 'Chatty I/O / Retry Storm / No Caching', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'cloud-monitoring-sec',
      title: 'Cloud & Monitoring',
      type: 'section',
      children: [
        {
          id: 'monitor',
          title: 'Monitoring',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Health, Availability, Perf Monitoring', type: 'subtopic' },
            { id: 'mo-2', title: 'Security, Usage Monitoring', type: 'subtopic' },
            { id: 'mo-3', title: 'Instrumentation, Visualization & Alerts', type: 'subtopic' }
          ]
        },
        {
          id: 'cloud',
          title: 'Cloud Design Patterns',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Strangler Fig / CQRS / Event Sourcing', type: 'subtopic' },
            { id: 'cl-2', title: 'Materialized View / Sharding / Index Table', type: 'subtopic' },
            { id: 'cl-3', title: 'Bulkhead / Circuit Breaker / Retry', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Software Architect Roadmap', type: 'topic', link: { id: 'software-architect', title: 'Software Architect' } },
        { id: 'related-2', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } },
        { id: 'related-3', title: 'Data Engineer Roadmap', type: 'topic', link: { id: 'data-engineer', title: 'Data Engineer' } }
      ]
    }
  ]
};
export const technicalWriterRoadmap = {
  id: 'technical-writer',
  title: 'Technical Writer',
  description: 'Bridge the gap between complex software and human users through clear documentation',
  layout: 'linear',
  category: 'role',
  subscriberCount: '130,000',
  faq: {
    question: 'Do I need to be a developer to be a Technical Writer?',
    answer: 'Not necessarily, but you must be comfortable reading code, using Git, and understanding technical concepts to explain them accurately.'
  },
  items: [
    {
      id: 'intro-skills-sec',
      title: 'Intro & Skills',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Intro & Best Practices',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Role of Technical Writers / Content Structure', type: 'subtopic' },
            { id: 'in-2', title: 'Crafting Great Titles / Call to Actions', type: 'subtopic' }
          ]
        },
        {
          id: 'skills',
          title: 'Required Skills & Tools',
          type: 'topic',
          children: [
            { id: 'sk-1', title: 'Technology Expertise / Written Communication', type: 'subtopic' },
            { id: 'sk-2', title: 'Story Telling / Docs Generation Tools', type: 'subtopic' },
            { id: 'sk-3', title: 'Git / Markdown / SEO & Editing Tools', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'content-strategy-sec',
      title: 'Content Strategy',
      type: 'section',
      children: [
        {
          id: 'research',
          title: 'Content Research',
          type: 'topic',
          children: [
            { id: 're-1', title: 'User Persona / Buyer Journey / Search Trends', type: 'subtopic' },
            { id: 're-2', title: 'Content Objectives / Writing Style Guides', type: 'subtopic' },
            { id: 're-3', title: 'Support Request Evaluation / Topic Score', type: 'subtopic' }
          ]
        },
        {
          id: 'seo',
          title: 'Content SEO',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Short & Long-tail Keywords / Backlinking', type: 'subtopic' },
            { id: 'se-2', title: 'Comparative Posts / Tutorials', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'docs-distribution-sec',
      title: 'Docs & Distribution',
      type: 'section',
      children: [
        {
          id: 'docs',
          title: 'Types of Technical Content',
          type: 'topic',
          children: [
            { id: 'do-1', title: 'Help Content / Developer Docs / API Reference', type: 'subtopic' },
            { id: 'do-2', title: 'Technical Content Marketing / Troubleshooting', type: 'subtopic' },
            { id: 'do-3', title: 'API Definitions / Docs Structure', type: 'subtopic' }
          ]
        },
        {
          id: 'dist',
          title: 'Distribution & Optimization',
          type: 'topic',
          children: [
            { id: 'di-1', title: 'Top/Mid/Bottom-funnel Content / Pillar Content', type: 'subtopic' },
            { id: 'di-2', title: 'Awareness Blogs / Release Notes / Case-Studies', type: 'subtopic' },
            { id: 'di-3', title: 'Conversion Tracking / Content Analysis / FAQ', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevRel Roadmap', type: 'topic', link: { id: 'devrel', title: 'DevRel' } },
        { id: 'related-2', title: 'API Design Roadmap', type: 'topic', link: { id: 'api-design', title: 'API Design' } },
        { id: 'related-3', title: 'Product Manager Roadmap', type: 'topic', link: { id: 'product-manager', title: 'Product Manager' } }
      ]
    }
  ]
};
export const terraformRoadmap = {
  id: 'terraform',
  title: 'Terraform',
  description: 'Master Infrastructure as Code (IaC) to safely and predictably create, change, and improve infrastructure',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '150,000',
  faq: {
    question: 'Terraform vs CloudFormation/ARM?',
    answer: 'Terraform is cloud-agnostic. While CloudFormation is AWS-only, Terraform uses the same HCL syntax across AWS, GCP, Azure, and hundreds of other providers.'
  },
  items: [
    {
      id: 'basics-resources-sec',
      title: 'Basics & Resources',
      type: 'section',
      children: [
        {
          id: 'basics',
          title: 'Intro & Getting Started',
          type: 'topic',
          children: [
            { id: 'ba-1', title: 'What is IaC? / CaC vs IaC', type: 'subtopic' },
            { id: 'ba-2', title: 'What is HCL? / Basic Syntax', type: 'subtopic' }
          ]
        },
        {
          id: 'resources',
          title: 'Providers & Resources',
          type: 'topic',
          children: [
            { id: 're-1', title: 'Configuring Providers / Registry', type: 'subtopic' },
            { id: 're-2', title: 'Resource Lifecycle / Preconditions', type: 'subtopic' },
            { id: 're-3', title: 'Meta Arguments (count, for_each, depends_on)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'vars-state-sec',
      title: 'Variables & State',
      type: 'section',
      children: [
        {
          id: 'vars',
          title: 'Variables',
          type: 'topic',
          children: [
            { id: 'va-1', title: 'Input Variables / Type Constraints', type: 'subtopic' },
            { id: 'va-2', title: 'Local Values / Environment Variables', type: 'subtopic' },
            { id: 'va-3', title: 'Sensitive Data / Validation Rules', type: 'subtopic' }
          ]
        },
        {
          id: 'state',
          title: 'State Management',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Inspect / Modify State (list, rm, mv)', type: 'subtopic' },
            { id: 'st-2', title: 'State Locking / Remote State', type: 'subtopic' },
            { id: 'st-3', title: 'Import Existing Resources', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'commands-modules-sec',
      title: 'Commands & Modules',
      type: 'section',
      children: [
        {
          id: 'cli',
          title: 'Basic / Advanced Commands',
          type: 'topic',
          children: [
            { id: 'cl-1', title: 'Format & Validate (fmt, validate)', type: 'subtopic' },
            { id: 'cl-2', title: 'tf plan, tf apply, tf destroy, output', type: 'subtopic' }
          ]
        },
        {
          id: 'mod',
          title: 'Modules & Provisioners',
          type: 'topic',
          children: [
            { id: 'mo-1', title: 'Root vs Child Modules / Local Modules', type: 'subtopic' },
            { id: 'mo-2', title: 'file / local-exec / remote-exec provisioners', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'deployment-scaling-sec',
      title: 'Deployment, Scaling & Security',
      type: 'section',
      children: [
        {
          id: 'deploy',
          title: 'Deployment & Scaling',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'Data Sources / Workspaces', type: 'subtopic' },
            { id: 'de-2', title: 'CI / CD Integration (GitHub Actions)', type: 'subtopic' },
            { id: 'de-3', title: 'Terragrunt / Infracost / Splitting State', type: 'subtopic' }
          ]
        },
        {
          id: 'adv',
          title: 'Testing, Security & HCP',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Unit / Integration / End to End Testing', type: 'subtopic' },
            { id: 'ad-2', title: 'Compliance / Sentinel / Checkov', type: 'subtopic' },
            { id: 'ad-3', title: 'HCP (Enterprise Features, Run Tasks)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'DevOps Roadmap', type: 'topic', link: { id: 'devops', title: 'DevOps' } },
        { id: 'related-2', title: 'AWS Roadmap', type: 'topic', link: { id: 'aws', title: 'AWS' } },
        { id: 'related-3', title: 'Backend Roadmap', type: 'topic', link: { id: 'backend', title: 'Backend' } }
      ]
    }
  ]
};
export const typescriptRoadmap = {
  id: 'typescript',
  title: 'TypeScript',
  description: 'Master JavaScript with syntax for types to build scalable and maintainable frontends and backends',
  layout: 'linear',
  category: 'language',
  subscriberCount: '400,000',
  faq: {
    question: 'Should I learn JS or TS first?',
    answer: 'Learn JavaScript basics first. TypeScript is a superset of JS, meaning all valid JS is valid TS. Understanding how JS behaves under the hood makes learning TS much easier.'
  },
  items: [
    {
      id: 'basics-config-sec',
      title: 'Basics & Configuration',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Intro & Running TS',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'TS vs JS / Interoperability', type: 'subtopic' },
            { id: 'in-2', title: 'tsc / ts-node / tsconfig.json', type: 'subtopic' },
            { id: 'in-3', title: 'Type Inference / Type Compatibility', type: 'subtopic' }
          ]
        },
        {
          id: 'types',
          title: 'TypeScript Types',
          type: 'topic',
          children: [
            { id: 'ty-1', title: 'Primitive (boolean, number, string, void)', type: 'subtopic' },
            { id: 'ty-2', title: 'Object (Interface, Class, Enum, Array, Tuple)', type: 'subtopic' },
            { id: 'ty-3', title: 'undefined, null, unknown, never, any', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'combining-assertions-sec',
      title: 'Combining Types & Assertions',
      type: 'section',
      children: [
        {
          id: 'combine',
          title: 'Combining & Asserting',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Union & Intersection Types / Type Aliases', type: 'subtopic' },
            { id: 'co-2', title: 'keyof Operator / Assertions (as, as const)', type: 'subtopic' },
            { id: 'co-3', title: 'Non-null Assertion / satisfies keyword', type: 'subtopic' }
          ]
        },
        {
          id: 'guards',
          title: 'Type Guards & Interfaces',
          type: 'topic',
          children: [
            { id: 'gu-1', title: 'instanceof, typeof, Equality, Truthiness', type: 'subtopic' },
            { id: 'gu-2', title: 'Type Predicates / Types vs Interfaces', type: 'subtopic' },
            { id: 'gu-3', title: 'Extending Interfaces / Hybrid Types', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'functions-classes-gen-sec',
      title: 'Functions, Classes & Generics',
      type: 'section',
      children: [
        {
          id: 'func',
          title: 'Functions & Classes',
          type: 'topic',
          children: [
            { id: 'fu-1', title: 'Typing Functions / Overloading', type: 'subtopic' },
            { id: 'fu-2', title: 'Constructor Params / Access Modifiers', type: 'subtopic' },
            { id: 'fu-3', title: 'Abstract Classes / Overriding', type: 'subtopic' }
          ]
        },
        {
          id: 'gen',
          title: 'Generics & Utility',
          type: 'topic',
          children: [
            { id: 'ge-1', title: 'Generic Types / Generic Constraints', type: 'subtopic' },
            { id: 'ge-2', title: 'Partial, Pick, Omit, Readonly, Record', type: 'subtopic' },
            { id: 'ge-3', title: 'Exclude, Extract, Awaited, ReturnType', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-eco-sec',
      title: 'Advanced Types & Ecosystem',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced Types',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'Mapped / Conditional Types', type: 'subtopic' },
            { id: 'ad-2', title: 'Literal / Template Literal Types', type: 'subtopic' },
            { id: 'ad-3', title: 'Recursive Types / Decorators', type: 'subtopic' }
          ]
        },
        {
          id: 'eco',
          title: 'Modules & Ecosystem',
          type: 'topic',
          children: [
            { id: 'ec-1', title: 'Namespaces / Ambient & External Modules', type: 'subtopic' },
            { id: 'ec-2', title: 'Global Augmentation / Build Tools', type: 'subtopic' },
            { id: 'ec-3', title: 'Formatting / Linting', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Node.js Roadmap', type: 'topic', link: { id: 'nodejs', title: 'Node.js' } },
        { id: 'related-2', title: 'JavaScript Roadmap', type: 'topic', link: { id: 'javascript', title: 'JavaScript' } },
        { id: 'related-3', title: 'React Roadmap', type: 'topic', link: { id: 'react', title: 'React' } }
      ]
    }
  ]
};
export const uxDesignRoadmap = {
  id: 'ux-design',
  title: 'UX Design',
  description: 'Design intuitive, accessible, and beautiful user experiences for digital products',
  layout: 'linear',
  category: 'role',
  subscriberCount: '190,000',
  faq: {
    question: 'What is the difference between UX and UI?',
    answer: 'UX (User Experience) is how a product feels and functions (research, flows, wireframes). UI (User Interface) is how a product looks (colors, typography, components).'
  },
  items: [
    {
      id: 'behavioral-econ-sec',
      title: 'Behavioral Science & Economics',
      type: 'section',
      children: [
        {
          id: 'behavior',
          title: 'Behavioral Science',
          type: 'topic',
          children: [
            { id: 'be-1', title: 'Human Decision Making / Dual Process', type: 'subtopic' },
            { id: 'be-2', title: 'Behavior Change Strategies / Habits', type: 'subtopic' },
            { id: 'be-3', title: 'Target Outcome / Target Actor', type: 'subtopic' }
          ]
        },
        {
          id: 'econ',
          title: 'Behavioral Economics',
          type: 'topic',
          children: [
            { id: 'ec-1', title: 'Nudge Theory / BJ Fogg\'s Behavior Model', type: 'subtopic' },
            { id: 'ec-2', title: 'Persuasive Technology / CREATE Action Funnel', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'concept-patterns-sec',
      title: 'Concept & Patterns',
      type: 'section',
      children: [
        {
          id: 'concept',
          title: 'Conceptual Design',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'User Personas / Define Target Users', type: 'subtopic' },
            { id: 'co-2', title: 'Understanding the Product / Business Model', type: 'subtopic' },
            { id: 'co-3', title: 'Competitor Analysis / SWOT Analysis', type: 'subtopic' }
          ]
        },
        {
          id: 'patterns',
          title: 'UX Patterns',
          type: 'topic',
          children: [
            { id: 'pa-1', title: 'Good Layout Rules / Flowcharts', type: 'subtopic' },
            { id: 'pa-2', title: 'Customer Experience Map (Mel Edwards)', type: 'subtopic' },
            { id: 'pa-3', title: 'Business Process Model (BPMN)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'best-practices-tools-sec',
      title: 'Best Practices & Tools',
      type: 'section',
      children: [
        {
          id: 'best',
          title: 'UX Best Practices',
          type: 'topic',
          children: [
            { id: 'bp-1', title: 'Getting Users Attention / Clear Distractions', type: 'subtopic' },
            { id: 'bp-2', title: 'Positive Intuitive Reaction / Social Proof', type: 'subtopic' },
            { id: 'bp-3', title: 'Avoid Choice Overload / Create Urgency', type: 'subtopic' }
          ]
        },
        {
          id: 'tools',
          title: 'Tools & Deliverables',
          type: 'topic',
          children: [
            { id: 'to-1', title: 'Wireframing / Prototyping / Frameworks', type: 'subtopic' },
            { id: 'to-2', title: 'Figma, Adobe XD, Sketch, Balsamiq', type: 'subtopic' },
            { id: 'to-3', title: 'Call to Action / Tutorials / Reminders', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-sec',
      title: 'Testing',
      type: 'section',
      children: [
        {
          id: 'test',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Multivariate Testing', type: 'subtopic' },
            { id: 'te-2', title: 'Incremental A/B Testing', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Design System Roadmap', type: 'topic', link: { id: 'design-system', title: 'Design System' } },
        { id: 'related-2', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-3', title: 'Product Manager Roadmap', type: 'topic', link: { id: 'product-manager', title: 'Product Manager' } }
      ]
    }
  ]
};
export const vibeCodingRoadmap = {
  id: 'vibe-coding',
  title: 'Vibe Coding',
  description: 'Master the art of coding at the speed of thought by leveraging AI, Copilots, and Agents',
  layout: 'linear',
  category: 'role',
  subscriberCount: '500,000',
  faq: {
    question: 'What is Vibe Coding?',
    answer: 'Vibe Coding is a modern paradigm where developers focus on high-level architecture, prompts, and "vibes," while AI models (like GitHub Copilot, Cursor, or ChatGPT) generate the boilerplate and logic.'
  },
  items: [
    {
      id: 'tools-planning-sec',
      title: 'Tools & Planning',
      type: 'section',
      children: [
        {
          id: 'tools',
          title: 'AI Tools & Planning',
          type: 'topic',
          children: [
            { id: 'to-1', title: 'Claude Code, Cursor, Windsurf, v0', type: 'subtopic' },
            { id: 'to-2', title: 'Plan before you Code / Work step by step', type: 'subtopic' },
            { id: 'to-3', title: 'Popular tech stacks / Keep code modular', type: 'subtopic' }
          ]
        },
        {
          id: 'prompt',
          title: 'Prompting & Context',
          type: 'topic',
          children: [
            { id: 'pr-1', title: 'One task at a time / Be specific', type: 'subtopic' },
            { id: 'pr-2', title: 'Use "act as" framing / Tell AI what NOT to do', type: 'subtopic' },
            { id: 'pr-3', title: 'Update Context (CLAUDE.md) / Clear Context', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'standards-debugging-sec',
      title: 'Standards & Debugging',
      type: 'section',
      children: [
        {
          id: 'standards',
          title: 'Standards & Refactoring',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Establish Standards Early / Catch bad habits', type: 'subtopic' },
            { id: 'st-2', title: 'Review & refactor codebase regularly', type: 'subtopic' },
            { id: 'st-3', title: 'Force refactoring to smaller modules', type: 'subtopic' }
          ]
        },
        {
          id: 'debug',
          title: 'Debugging & Version Control',
          type: 'topic',
          children: [
            { id: 'de-1', title: 'Let AI Debug, But Understand the fix', type: 'subtopic' },
            { id: 'de-2', title: 'Use MCP (Playwright) / Tell AI to add logs', type: 'subtopic' },
            { id: 'de-3', title: 'Commit Often with Clear Messages', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'testing-security-sec',
      title: 'Testing & Security',
      type: 'section',
      children: [
        {
          id: 'test',
          title: 'Testing',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Force AI To Test by Default / TDD', type: 'subtopic' },
            { id: 'te-2', title: 'Write breaking test for bugs then fix', type: 'subtopic' },
            { id: 'te-3', title: 'Refactor regularly after tests', type: 'subtopic' }
          ]
        },
        {
          id: 'security',
          title: 'Security Best Practices',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Never Hardcode your Secrets (env vars)', type: 'subtopic' },
            { id: 'se-2', title: 'Security audit of the application', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'AI Engineer Roadmap', type: 'topic', link: { id: 'ai-engineer', title: 'AI Engineer' } },
        { id: 'related-2', title: 'Prompt Engineering Roadmap', type: 'topic', link: { id: 'prompt-engineering', title: 'Prompt Engineering' } },
        { id: 'related-3', title: 'Full Stack Roadmap', type: 'topic', link: { id: 'full-stack', title: 'Full Stack' } }
      ]
    }
  ]
};
export const vueRoadmap = {
  id: 'vue',
  title: 'Vue',
  description: 'Master the progressive JavaScript framework for building approachable, performant, and versatile UIs',
  layout: 'linear',
  category: 'framework',
  subscriberCount: '190,000',
  faq: {
    question: 'Vue 2 (Options API) vs Vue 3 (Composition API)?',
    answer: 'Learn Vue 3 with the Composition API (using <script setup>). It is the modern standard for Vue development, offering better TypeScript support and logic reuse.'
  },
  items: [
    {
      id: 'components-templates-sec',
      title: 'Components & Templates',
      type: 'section',
      children: [
        {
          id: 'components',
          title: 'Components & API Styles',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Single File Components / Props, Events', type: 'subtopic' },
            { id: 'co-2', title: 'Options API vs Composition API', type: 'subtopic' },
            { id: 'co-3', title: 'Lifecycle Hooks / App Configurations', type: 'subtopic' }
          ]
        },
        {
          id: 'templates',
          title: 'Templates & Directives',
          type: 'topic',
          children: [
            { id: 'te-1', title: 'Interpolation / v-bind, v-model, v-on', type: 'subtopic' },
            { id: 'te-2', title: 'Conditional (v-if, v-show) / v-for', type: 'subtopic' },
            { id: 'te-3', title: 'v-slot, v-cloak / Custom Directives', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'rendering-events-sec',
      title: 'Rendering & Events',
      type: 'section',
      children: [
        {
          id: 'rendering',
          title: 'Rendering & Forms',
          type: 'topic',
          children: [
            { id: 're-1', title: 'Conditional & List Rendering', type: 'subtopic' },
            { id: 're-2', title: 'Forms Handling / Input Bindings', type: 'subtopic' },
            { id: 're-3', title: 'Optimizing Renders / Debugging', type: 'subtopic' }
          ]
        },
        {
          id: 'events',
          title: 'Events & Advanced',
          type: 'topic',
          children: [
            { id: 'ev-1', title: 'Event Handling / Key & Mouse Modifiers', type: 'subtopic' },
            { id: 'ev-2', title: 'Computed Properties / Watchers', type: 'subtopic' },
            { id: 'ev-3', title: 'Async Components / Teleport / Provide/Inject', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'ecosystem-testing-sec',
      title: 'Ecosystem & Testing',
      type: 'section',
      children: [
        {
          id: 'ecosystem',
          title: 'Ecosystem & Routing',
          type: 'topic',
          children: [
            { id: 'ec-1', title: 'Nuxt.js (SSR, SSG) / VitePress', type: 'subtopic' },
            { id: 'ec-2', title: 'Vue Router / Animations / Transition', type: 'subtopic' },
            { id: 'ec-3', title: 'Quasar / Vuetify / Element UI', type: 'subtopic' }
          ]
        },
        {
          id: 'state',
          title: 'State & API Calls',
          type: 'topic',
          children: [
            { id: 'st-1', title: 'Pinia (State Management)', type: 'subtopic' },
            { id: 'st-2', title: 'Axios, fetch / Tanstack Query', type: 'subtopic' },
            { id: 'st-3', title: 'Testing (Vitest, Cypress, Playwright)', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-2', title: 'JavaScript Roadmap', type: 'topic', link: { id: 'javascript', title: 'JavaScript' } },
        { id: 'related-3', title: 'React Roadmap', type: 'topic', link: { id: 'react', title: 'React' } }
      ]
    }
  ]
};
export const wordpressRoadmap = {
  id: 'wordpress',
  title: 'WordPress',
  description: 'Build custom themes, plugins, and headless solutions on the world\'s most popular CMS',
  layout: 'linear',
  category: 'framework',
  subscriberCount: '280,000',
  faq: {
    question: 'Is WordPress just for blogs?',
    answer: 'Not anymore. With Custom Post Types, Advanced Custom Fields, and REST APIs, WordPress can function as a full-fledged enterprise CMS or headless backend.'
  },
  items: [
    {
      id: 'fundamentals-concepts-sec',
      title: 'Fundamentals & Concepts',
      type: 'section',
      children: [
        {
          id: 'intro',
          title: 'Intro & Setup',
          type: 'topic',
          children: [
            { id: 'in-1', title: 'Frontend (HTML, CSS, JS) / Backend (PHP, SQL)', type: 'subtopic' },
            { id: 'in-2', title: 'What is a CMS? / wordpress.com vs .org', type: 'subtopic' },
            { id: 'in-3', title: 'LocalWP / XAMPP / Docker / VVV', type: 'subtopic' }
          ]
        },
        {
          id: 'concepts',
          title: 'WordPress Concepts',
          type: 'topic',
          children: [
            { id: 'co-1', title: 'Themes (Block, Classic, Hybrid, Universal)', type: 'subtopic' },
            { id: 'co-2', title: 'Plugins / Hooks (Actions, Filters)', type: 'subtopic' },
            { id: 'co-3', title: 'The Loop / Shortcodes / Page Editors', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'themes-plugins-sec',
      title: 'Themes & Plugins Dev',
      type: 'section',
      children: [
        {
          id: 'themes',
          title: 'Theme Development',
          type: 'topic',
          children: [
            { id: 'th-1', title: 'Block Themes (FSE, Patterns, Parts)', type: 'subtopic' },
            { id: 'th-2', title: 'Classic Themes (functions.php, Template Files)', type: 'subtopic' },
            { id: 'th-3', title: 'Child Themes / Template Hierarchy / Menus', type: 'subtopic' }
          ]
        },
        {
          id: 'plugins',
          title: 'Plugin Development',
          type: 'topic',
          children: [
            { id: 'pl-1', title: 'Plugin Basics / File Structure', type: 'subtopic' },
            { id: 'pl-2', title: 'Transients API / Cron Jobs / AJAX', type: 'subtopic' },
            { id: 'pl-3', title: 'REST API / Working with Databases', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'security-perf-sec',
      title: 'Security & Performance',
      type: 'section',
      children: [
        {
          id: 'security',
          title: 'Security & Hardening',
          type: 'topic',
          children: [
            { id: 'se-1', title: 'Firewall / Activity Logging / User Roles', type: 'subtopic' },
            { id: 'se-2', title: 'Vulnerability Monitoring / Virtual Patching', type: 'subtopic' },
            { id: 'se-3', title: 'User & Login Security / Best Practices', type: 'subtopic' }
          ]
        },
        {
          id: 'perf',
          title: 'Performance & Deployment',
          type: 'topic',
          children: [
            { id: 'pe-1', title: 'Caching / CDN / Core Web Vitals', type: 'subtopic' },
            { id: 'pe-2', title: 'Hosting (Shared, VPS, Managed)', type: 'subtopic' },
            { id: 'pe-3', title: 'WP-CLI / Bedrock / Automated Deployments', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'advanced-sec',
      title: 'Advanced',
      type: 'section',
      children: [
        {
          id: 'adv',
          title: 'Advanced WordPress',
          type: 'topic',
          children: [
            { id: 'ad-1', title: 'OOP in PHP / Design Patterns / Composer', type: 'subtopic' },
            { id: 'ad-2', title: 'Headless WordPress / Multisite / Localization', type: 'subtopic' },
            { id: 'ad-3', title: 'Testing (PHPUnit) / WP_DEBUG / SEO', type: 'subtopic' }
          ]
        }
      ]
    },
    {
      id: 'keep-learning',
      title: 'Related Tracks',
      type: 'section',
      children: [
        { id: 'related-1', title: 'PHP Roadmap', type: 'topic', link: { id: 'php', title: 'PHP' } },
        { id: 'related-2', title: 'Frontend Roadmap', type: 'topic', link: { id: 'frontend', title: 'Frontend' } },
        { id: 'related-3', title: 'Backend Beginner Roadmap', type: 'topic', link: { id: 'backend-beginner', title: 'Backend Beginner' } }
      ]
    }
  ]
};

export const productDesignRoadmap = {
  id: 'product-design',
  title: 'Product Design',
  description: 'Step by step guide to becoming a Product Designer',
  layout: 'linear',
  category: 'role',
  subscriberCount: '15,200',
  faq: {
    question: 'What is a Product Designer?',
    answer: 'A product designer is responsible for the overall user experience of a product, from discovering the problem to delivering the final design.'
  },
  items: [
    {
      id: 'fundamentals',
      title: 'Design Fundamentals',
      type: 'section',
      children: [
        { id: 'design-thinking', title: 'Design Thinking', type: 'topic' },
        { id: 'color-theory', title: 'Color Theory', type: 'topic' },
        { id: 'typography', title: 'Typography', type: 'topic' },
        { id: 'layout-grid', title: 'Layout & Grids', type: 'topic' }
      ]
    },
    {
      id: 'ux-research',
      title: 'UX Research',
      type: 'section',
      children: [
        { id: 'user-interviews', title: 'User Interviews', type: 'topic' },
        { id: 'personas', title: 'User Personas', type: 'topic' },
        { id: 'journey-mapping', title: 'Journey Mapping', type: 'topic' }
      ]
    },
    {
      id: 'ui-design',
      title: 'UI Design & Prototyping',
      type: 'section',
      children: [
        { id: 'wireframing', title: 'Wireframing', type: 'topic' },
        { id: 'figma', title: 'Figma Mastery', type: 'topic' },
        { id: 'prototyping', title: 'Interactive Prototyping', type: 'topic' },
        { id: 'design-systems', title: 'Design Systems', type: 'topic' }
      ]
    }
  ]
};

export const graphqlRoadmap = {
  id: 'graphql',
  title: 'GraphQL',
  description: 'Step by step guide to learning GraphQL',
  layout: 'linear',
  category: 'skill',
  subscriberCount: '22,100',
  faq: {
    question: 'What is GraphQL?',
    answer: 'GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.'
  },
  items: [
    {
      id: 'basics',
      title: 'GraphQL Basics',
      type: 'section',
      children: [
        { id: 'what-is-graphql', title: 'What is GraphQL?', type: 'topic' },
        { id: 'queries-mutations', title: 'Queries & Mutations', type: 'topic' },
        { id: 'schema-types', title: 'Schema & Types', type: 'topic' }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Concepts',
      type: 'section',
      children: [
        { id: 'resolvers', title: 'Resolvers', type: 'topic' },
        { id: 'fragments', title: 'Fragments', type: 'topic' },
        { id: 'subscriptions', title: 'Subscriptions', type: 'topic' },
        { id: 'directives', title: 'Directives', type: 'topic' }
      ]
    },
    {
      id: 'tools-ecosystem',
      title: 'Ecosystem & Tools',
      type: 'section',
      children: [
        { id: 'apollo-server', title: 'Apollo Server', type: 'topic' },
        { id: 'apollo-client', title: 'Apollo Client', type: 'topic' },
        { id: 'relay', title: 'Relay', type: 'topic' },
        { id: 'graphql-yoga', title: 'GraphQL Yoga', type: 'topic' }
      ]
    }
  ]
};

export const powerBiRoadmap = {
  id: 'power-bi',
  title: 'Power BI',
  description: 'Step by step guide to mastering Power BI',
  layout: 'linear',
  category: 'tool',
  subscriberCount: '18,500',
  faq: {
    question: 'What is Power BI?',
    answer: 'Power BI is an interactive data visualization software product developed by Microsoft with a primary focus on business intelligence.'
  },
  items: [
    {
      id: 'data-prep',
      title: 'Data Preparation',
      type: 'section',
      children: [
        { id: 'get-data', title: 'Get Data (Sources)', type: 'topic' },
        { id: 'power-query', title: 'Power Query Editor', type: 'topic' },
        { id: 'data-cleaning', title: 'Data Cleaning', type: 'topic' },
        { id: 'm-language', title: 'M Language Basics', type: 'topic' }
      ]
    },
    {
      id: 'data-modeling',
      title: 'Data Modeling & DAX',
      type: 'section',
      children: [
        { id: 'relationships', title: 'Relationships (Star Schema)', type: 'topic' },
        { id: 'dax-basics', title: 'DAX Fundamentals', type: 'topic' },
        { id: 'calculated-columns', title: 'Calculated Columns & Measures', type: 'topic' },
        { id: 'time-intelligence', title: 'Time Intelligence Functions', type: 'topic' }
      ]
    },
    {
      id: 'visualization',
      title: 'Visualization & Sharing',
      type: 'section',
      children: [
        { id: 'charts-graphs', title: 'Charts & Graphs', type: 'topic' },
        { id: 'custom-visuals', title: 'Custom Visuals', type: 'topic' },
        { id: 'power-bi-service', title: 'Power BI Service', type: 'topic' },
        { id: 'dashboards', title: 'Publishing Dashboards', type: 'topic' }
      ]
    }
  ]
};

export const codeReviewRoadmap = {
  id: 'code-review',
  title: 'Code Review',
  description: 'Best practices for conducting and participating in code reviews',
  layout: 'linear',
  category: 'best-practices',
  subscriberCount: '10,900',
  faq: {
    question: 'Why is Code Review important?',
    answer: 'Code review helps maintain code quality, prevents bugs from reaching production, and shares knowledge across the team.'
  },
  items: [
    {
      id: 'author-best-practices',
      title: 'As an Author',
      type: 'section',
      children: [
        { id: 'small-prs', title: 'Keep PRs Small', type: 'topic' },
        { id: 'good-descriptions', title: 'Write Good Descriptions', type: 'topic' },
        { id: 'self-review', title: 'Self Review First', type: 'topic' }
      ]
    },
    {
      id: 'reviewer-best-practices',
      title: 'As a Reviewer',
      type: 'section',
      children: [
        { id: 'understand-context', title: 'Understand the Goal', type: 'topic' },
        { id: 'check-logic', title: 'Check Logic & Edge Cases', type: 'topic' },
        { id: 'security-perf', title: 'Security & Performance', type: 'topic' },
        { id: 'constructive-feedback', title: 'Constructive Feedback', type: 'topic' }
      ]
    },
    {
      id: 'culture',
      title: 'Team Culture',
      type: 'section',
      children: [
        { id: 'timely-reviews', title: 'Timely Reviews', type: 'topic' },
        { id: 'nitpicks', title: 'Handling Nitpicks', type: 'topic' },
        { id: 'automated-checks', title: 'Automated CI/CD Checks', type: 'topic' }
      ]
    }
  ]
};
