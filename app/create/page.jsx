// import { KeywordForm } from "@/components/keyword-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeywordForm } from "../components/keyword-form"

export default function CreatePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Content</h1>
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Keyword</CardTitle>
            <CardDescription>
              We'll search Google for the top results and generate SEO-optimized content based on your keyword.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KeywordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

