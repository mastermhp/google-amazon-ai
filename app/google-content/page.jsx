// import ContentGenerator from "@/components/content-generator"
import { getPromptTemplatesAction } from "@/lib/actions"
import ContentGenerator from "../components/content-generator"

export default async function GoogleContentPage() {
  let promptTemplates = []
  let error = null

  try {
    promptTemplates = await getPromptTemplatesAction()
  } catch (err) {
    console.error("Error loading prompt templates:", err)
    error = err.message
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">AI Google Content Generator</h1>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>There was a problem loading templates. The application will still work with default settings.</p>
          <p className="text-sm mt-2">Technical details: {error}</p>
        </div>
      )}

      <ContentGenerator promptTemplates={promptTemplates} />
    </main>
  )
}

