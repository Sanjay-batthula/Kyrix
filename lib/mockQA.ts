export type QA = {
  question: string;
  answers: Record<string, (name: string, hour: number) => string>;
};

const getTimeGreeting = (hour: number) => {
  if (hour < 12) return 'good morning';
  if (hour < 18) return 'good afternoon';
  return 'good evening';
};

export const mockQA: QA[] = [
  {
    question: 'how does ai learn?',
    answers: {
      'openai-gpt4': () => 'AI learns by processing data, identifying patterns, and improving its performance over time.',
      'gemini': () => 'AI learns from data and feedback, adjusting its actions.',
      'grok': () => 'AI gets smarter by learning from lots of examples.',
      'claude': () => 'AI systems learn by analyzing data and refining their models.',
    },
  },
  {
    question: 'can ai be creative?',
    answers: {
      'openai-gpt4': () => 'AI can generate creative outputs, but its creativity is based on patterns in data.',
      'gemini': () => 'AI can create art, music, and ideas, but it lacks true originality.',
      'grok': () => 'AI can make cool stuff, but it’s not truly creative like humans.',
      'claude': () => 'AI can mimic creativity, but genuine creativity is uniquely human.',
    },
  },
  {
    question: 'what are ai limitations?',
    answers: {
      'openai-gpt4': () => 'AI is limited by data quality, bias, and inability to understand context deeply.',
      'gemini': () => 'AI can make mistakes and lacks common sense.',
      'grok': () => 'AI can’t always get things right or understand feelings.',
      'claude': () => 'AI is limited by its training and cannot fully replicate human judgment.',
    },
  },
  {
    question: 'is ai expensive?',
    answers: {
      'openai-gpt4': () => 'AI can be costly to develop and deploy, but prices are decreasing as technology advances.',
      'gemini': () => 'AI can be expensive, but it’s getting more affordable.',
      'grok': () => 'AI can cost a lot, but it’s cheaper now than before.',
      'claude': () => 'AI costs depend on complexity and scale.',
    },
  },
  {
    question: 'can ai make mistakes?',
    answers: {
      'openai-gpt4': () => 'Yes, AI can make mistakes, especially if trained on poor data.',
      'gemini': () => 'AI can make errors, so human oversight is important.',
      'grok': () => 'AI messes up sometimes, just like people.',
      'claude': () => 'AI can err, especially when faced with unfamiliar situations.',
    },
  },
  {
    question: 'how is ai used in healthcare?',
    answers: {
      'openai-gpt4': () => 'AI helps diagnose diseases, analyze medical images, and personalize treatments.',
      'gemini': () => 'AI supports doctors by analyzing data and improving patient care.',
      'grok': () => 'AI helps doctors spot problems and treat patients.',
      'claude': () => 'AI is used for diagnosis, treatment planning, and research in healthcare.',
    },
  },
  {
    question: 'can ai improve productivity?',
    answers: {
      'openai-gpt4': () => 'AI automates tasks and streamlines workflows, boosting productivity.',
      'gemini': () => 'AI helps people work faster and smarter.',
      'grok': () => 'AI makes work easier and quicker.',
      'claude': () => 'AI enhances productivity by automating repetitive tasks.',
    },
  },
  {
    question: 'is ai safe?',
    answers: {
      'openai-gpt4': () => 'AI is safe when used responsibly, but risks exist if mismanaged.',
      'gemini': () => 'AI is mostly safe, but needs careful oversight.',
      'grok': () => 'AI is safe if used right, but can be risky.',
      'claude': () => 'AI safety depends on design, use, and regulation.',
    },
  },
  {
    question: 'can ai help climate change?',
    answers: {
      'openai-gpt4': () => 'AI can help monitor environmental changes and optimize energy use.',
      'gemini': () => 'AI helps track climate and find solutions.',
      'grok': () => 'AI can help fight climate change by analyzing data.',
      'claude': () => 'AI supports climate research and sustainable practices.',
    },
  },
  {
    question: 'how does ai affect society?',
    answers: {
      'openai-gpt4': () => 'AI changes how we work, learn, and interact, with both positive and negative impacts.',
      'gemini': () => 'AI shapes society, creating new opportunities and challenges.',
      'grok': () => 'AI changes life, sometimes for better, sometimes for worse.',
      'claude': () => 'AI influences society in many ways, requiring thoughtful management.',
    },
  },
  {
    question: 'hi',
    answers: {
      'openai-gpt4': (name, hour) => `Hi ${name}, ${getTimeGreeting(hour)}! How can I help you today?`,
      'gemini': (name, hour) => `Hey ${name}, ${getTimeGreeting(hour)}! What can I do for you?`,
      'grok': (name, hour) => `Yo ${name}, ${getTimeGreeting(hour)}! Ready to assist.`,
      'claude': (name, hour) => `Hello ${name}, ${getTimeGreeting(hour)}. How may I assist you?`,
    },
  },
  {
    question: 'hii',
    answers: {
      'openai-gpt4': (name, hour) => `Hii ${name}, ${getTimeGreeting(hour)}! How can I assist?`,
      'gemini': (name, hour) => `Hii ${name}, ${getTimeGreeting(hour)}! Need any help?`,
      'grok': (name, hour) => `Hii ${name}, ${getTimeGreeting(hour)}! Let’s get started.`,
      'claude': (name, hour) => `Hii ${name}, ${getTimeGreeting(hour)}. How may I help?`,
    },
  },
  {
    question: 'hello',
    answers: {
      'openai-gpt4': (name, hour) => `Hello ${name}, ${getTimeGreeting(hour)}! What would you like to explore?`,
      'gemini': (name, hour) => `Hello ${name}, ${getTimeGreeting(hour)}! How can I help today?`,
      'grok': (name, hour) => `Hello ${name}, ${getTimeGreeting(hour)}! Ready when you are.`,
      'claude': (name, hour) => `Hello ${name}, ${getTimeGreeting(hour)}. How may I assist you?`,
    },
  },
  {
    question: 'which llm are you',
    answers: {
      'openai-gpt4': () => `I am OpenAI GPT-4.`,
      'gemini': () => `I am Gemini.`,
      'grok': () => `I am Grok.`,
      'claude': () => `I am Anthropic Claude.`,
    },
  },
  {
    question: 'what is ai',
    answers: {
      'openai-gpt4': () => 'AI (Artificial Intelligence) is the simulation of human intelligence processes by machines, especially computer systems.',
      'gemini': () => 'AI stands for Artificial Intelligence, which enables machines to mimic human thinking and actions.',
      'grok': () => 'AI is tech that lets computers act smart, like humans.',
      'claude': () => 'Artificial Intelligence is the ability of machines to perform tasks that typically require human intelligence.',
    },
  },
  {
    question: 'difference between ai and ml',
    answers: {
      'openai-gpt4': () => 'AI is a broad field focused on creating intelligent machines, while ML (Machine Learning) is a subset of AI that enables machines to learn from data.',
      'gemini': () => 'AI is the overall concept of intelligent machines; ML is a technique within AI that learns from data.',
      'grok': () => 'AI is the big idea, ML is how computers learn stuff on their own.',
      'claude': () => 'AI covers all intelligent behavior; ML is specifically about learning from data.',
    },
  },
  {
    question: 'will ai replace human?',
    answers: {
      'openai-gpt4': () => 'AI will automate some tasks, but humans will remain essential for creativity, empathy, and complex decision-making.',
      'gemini': () => 'AI may change jobs, but humans are still needed for many roles.',
      'grok': () => 'AI will help, not fully replace humans.',
      'claude': () => 'AI will augment human abilities, not entirely replace them.',
    },
  },
  {
    question: 'how to build a project',
    answers: {
      'openai-gpt4': () => 'Start by defining your goal, plan the steps, gather resources, and build incrementally. Test and iterate.',
      'gemini': () => 'Set your objective, break it down, and build step by step.',
      'grok': () => 'Figure out what you want, make a plan, and start building.',
      'claude': () => 'Identify the purpose, outline tasks, and execute them systematically.',
    },
  },
  {
    question: 'is ai threat to data -privacy',
    answers: {
      'openai-gpt4': () => 'AI can pose risks to data privacy if not managed properly. Responsible use and regulation are key.',
      'gemini': () => 'AI may threaten privacy, so safeguards are important.',
      'grok': () => 'AI can be risky for privacy if not handled right.',
      'claude': () => 'AI must be used carefully to protect data privacy.',
    },
  },
  {
    question: 'should ai be used in education',
    answers: {
      'openai-gpt4': () => 'AI can personalize learning and support teachers, but should be used thoughtfully.',
      'gemini': () => 'AI can help education, but needs careful use.',
      'grok': () => 'AI is cool for learning, but not a replacement for teachers.',
      'claude': () => 'AI can enhance education if applied responsibly.',
    },
  },
  {
    question: 'analyze impact of ai on future employment',
    answers: {
      'openai-gpt4': () => 'AI will transform jobs, automating routine tasks and creating new roles. Adaptation and upskilling will be crucial.',
      'gemini': () => 'AI will change the job market, requiring new skills.',
      'grok': () => 'AI will shift jobs, some will go, new ones will come.',
      'claude': () => 'AI will impact employment, emphasizing adaptability and lifelong learning.',
    },
  },
  
];

export function getMockResponse(
  question: string,
  model: string,
  name: string,
  hour: number
): string {
  const qa = mockQA.find(q => q.question === question.toLowerCase());
  if (!qa) return `${getTimeGreeting(hour)}, ${name}. How can I help you?`;
  const responder = qa.answers[model];
  return responder ? responder(name, hour) : `${getTimeGreeting(hour)}, ${name}.`;
}

export function getUserName(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userName') || '';
  }
  return '';
}
