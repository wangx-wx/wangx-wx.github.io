export type NowItem = {
  emoji: string;
  text: string;
};

export type TechItem = {
  name: string;
  note?: string;
  emoji?: string;
};

export type TechStackGroup = {
  title: string;
  items: TechItem[];
};

export type FeaturedProject = {
  name: string;
  description: string;
  tags: string[];
  url: string;
  highlight?: string;
};

export type OpenSourceContribution = {
  name: string;
  description: string;
  tags: string[];
  url: string;
  highlight?: string;
};

export const NOW_ITEMS: NowItem[] = [
  {
    emoji: "🎯",
    text: "深入研究 AI Coding 生态：Claude Code、MCP、Agent SDK 的工程落地。",
  },
  {
    emoji: "🔨",
    text: "在做企业级 Claude Code Skills，聚焦智能客服等业务场景。",
  },
  {
    emoji: "📚",
    text: "探索 LLM 与传统后端服务的协作模式、可观测性与团队提效路径。",
  },
];

export const TECH_STACK: TechStackGroup[] = [
  {
    title: "日常使用",
    items: [
      { name: "Java", note: "业务服务 / 中台", emoji: "☕" },
      { name: "Spring Boot", note: "微服务框架", emoji: "🌱" },
      { name: "MySQL", note: "OLTP", emoji: "🐬" },
      { name: "Redis", note: "缓存 / 分布式锁", emoji: "🟥" },
      { name: "Docker / K8s", note: "部署与运维", emoji: "🐳" },
    ],
  },
  {
    title: "在探索",
    items: [
      { name: "Claude Code", note: "Skills / Plugins", emoji: "🤖" },
      { name: "MCP", note: "模型上下文协议", emoji: "🔌" },
      { name: "Agent SDK", note: "智能体编排", emoji: "🧠" },
      { name: "Go", note: "工具链 / CLI", emoji: "🐹" },
    ],
  },
];

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    name: "wx-cc-plugins",
    description:
      "面向企业场景的 Claude Code 插件集合，内含智能客服等业务 Skill，沉淀 AI Coding 在团队中的实践方案。",
    tags: ["Claude Code", "Plugins", "Skills", "AI", "Enterprise"],
    url: "https://github.com/wangx-wx/wx-cc-plugins",
    highlight: "企业级 Skills · 智能客服",
  },
];

export const OPEN_SOURCE_CONTRIBUTIONS: OpenSourceContribution[] = [
  {
    name: "alibaba/spring-ai-alibaba",
    description:
      "面向 Java 开发者的 AI 应用框架，提供 Agent、RAG、MCP 等能力的一站式集成方案，是 Spring 生态接入大模型的重要基础设施。",
    tags: ["Spring", "Java", "AI", "Agent", "RAG"],
    url: "https://github.com/alibaba/spring-ai-alibaba",
    highlight: "Spring 生态 · AI 框架",
  },
  {
    name: "spring-ai-alibaba/examples",
    description:
      "Spring AI Alibaba 的官方示例工程，覆盖从入门到企业级落地的典型场景，帮助开发者快速理解和上手框架能力。",
    tags: ["Spring AI", "Examples", "Best Practices"],
    url: "https://github.com/spring-ai-alibaba/examples",
    highlight: "官方示例 · 实践参考",
  },
];
