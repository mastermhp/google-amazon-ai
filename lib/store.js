// In-memory store to replace MongoDB
let contents = [];
let promptTemplates = [
  {
    id: "default",
    name: "Default",
    template: `Create a comprehensive, SEO-optimized {{contentType}} about "{{keyword}}".
  
Use these keywords: {{keywords}}

Based on these titles from top search results:
{{titles}}

And these snippets:
{{snippets}}

Include the following image placeholders in appropriate places within the content:
{{imagePrompts}}

The content should be well-structured with headings and subheadings,
and include an introduction and conclusion.

Content length should be {{contentLength}} (short: ~1000 words, medium: ~1500 words, long: ~2000 words).

Also generate a meta description for SEO purposes.`,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
];

// Initialize from localStorage if available
if (typeof window !== "undefined") {
  try {
    const storedContents = localStorage.getItem("contents");
    if (storedContents) {
      contents = JSON.parse(storedContents);
    }

    const storedTemplates = localStorage.getItem("promptTemplates");
    if (storedTemplates) {
      promptTemplates = JSON.parse(storedTemplates);
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
}

// Helper to save to localStorage
const saveToStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("contents", JSON.stringify(contents));
      localStorage.setItem("promptTemplates", JSON.stringify(promptTemplates));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
};

// Content methods
export function saveContent(content) {
  const id = Date.now().toString();
  const newContent = {
    ...content,
    _id: id,
    createdAt: new Date().toISOString(),
  };

  contents.unshift(newContent); // Add to beginning of array
  saveToStorage();

  return newContent;
}

export function getContentHistory(limit = 20, skip = 0) {
  const paginatedContents = contents.slice(skip, skip + limit);
  return { contents: paginatedContents, total: contents.length };
}

export function getContentById(id) {
  return contents.find((content) => content._id === id) || null;
}

export function deleteContent(id) {
  const initialLength = contents.length;
  contents = contents.filter((content) => content._id !== id);
  saveToStorage();

  return { deleted: contents.length < initialLength };
}

export function updateContent(id, updatedContent) {
  const index = contents.findIndex((content) => content._id === id);
  if (index !== -1) {
    contents[index] = {
      ...contents[index],
      ...updatedContent,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage();
    return contents[index];
  }
  return null;
}

// Prompt template methods
export function getPromptTemplates() {
  return promptTemplates;
}

export function getPromptTemplateById(id) {
  return promptTemplates.find((template) => template.id === id) || null;
}

export function savePromptTemplate(template) {
  if (template.id) {
    // Update existing template
    const index = promptTemplates.findIndex((t) => t.id === template.id);
    if (index !== -1) {
      promptTemplates[index] = {
        ...template,
        updatedAt: new Date().toISOString(),
      };
    }
  } else {
    // Create new template
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    promptTemplates.push(newTemplate);
  }

  saveToStorage();
  return template;
}

export function deletePromptTemplate(id) {
  const initialLength = promptTemplates.length;
  promptTemplates = promptTemplates.filter((template) => template.id !== id);
  saveToStorage();

  return { deleted: promptTemplates.length < initialLength };
}

export function getDefaultPromptTemplate() {
  return (
    promptTemplates.find((template) => template.isDefault) || promptTemplates[0]
  );
}

// Simple auth
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password123",
};

export function authenticate(username, password) {
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    return { success: true, user: { name: "Admin", role: "admin" } };
  }
  return { success: false, error: "Invalid credentials" };
}
