"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, Trash2, Edit } from "lucide-react"
import {
  getAmazonPromptTemplatesAction,
  saveAmazonPromptTemplateAction,
  deleteAmazonPromptTemplateAction,
} from "@/lib/actions"
import AdminLayout from "@/app/components/admin-layout"

export default function AmazonPromptTemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState({
    name: "",
    template: "",
    isDefault: false,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await getAmazonPromptTemplatesAction()
      setTemplates(data)
    } catch (error) {
      console.error("Error loading templates:", error)
      setError("Failed to load Amazon prompt templates")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewTemplate = () => {
    setCurrentTemplate({
      name: "",
      template: "",
      isDefault: false,
    })
    setIsEditing(true)
  }

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template)
    setIsEditing(true)
  }

  const handleSaveTemplate = async () => {
    if (!currentTemplate.name || !currentTemplate.template) {
      setError("Name and template content are required")
      return
    }

    setIsLoading(true)
    try {
      await saveAmazonPromptTemplateAction(currentTemplate)
      await loadTemplates()
      setIsEditing(false)
      setCurrentTemplate({
        name: "",
        template: "",
        isDefault: false,
      })
    } catch (error) {
      console.error("Error saving template:", error)
      setError("Failed to save Amazon prompt template")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTemplate = async (id) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return
    }

    setIsLoading(true)
    try {
      await deleteAmazonPromptTemplateAction(id)
      await loadTemplates()
    } catch (error) {
      console.error("Error deleting template:", error)
      setError("Failed to delete Amazon prompt template")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Amazon Prompt Templates</h1>
          <Button onClick={handleNewTemplate}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>{currentTemplate._id ? "Edit Template" : "New Template"}</CardTitle>
              <CardDescription>Create or edit a prompt template for Amazon product reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Template Name
                </label>
                <Input
                  id="name"
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                  placeholder="E.g., Detailed Amazon Review Template"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="template" className="text-sm font-medium">
                  Template Content
                </label>
                <Textarea
                  id="template"
                  value={currentTemplate.template}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, template: e.target.value })}
                  placeholder="Enter your prompt template with placeholders like {{productDetails}}, {{keywords}}, etc."
                  className="min-h-[300px]"
                />
                <p className="text-xs text-gray-500">
                  Available placeholders: {"{{"} productDetails {"}},"} {"{{"} keywords {"}}"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={currentTemplate.isDefault}
                  onCheckedChange={(checked) => setCurrentTemplate({ ...currentTemplate, isDefault: checked })}
                />
                <label htmlFor="isDefault" className="text-sm font-medium">
                  Set as default template
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Template"
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : templates.length > 0 ? (
              templates.map((template) => (
                <Card key={template._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        {template.isDefault && <CardDescription>Default Template</CardDescription>}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTemplate(template._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-[200px]">
                      {template.template}
                    </pre>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500">
                    Last updated: {new Date(template.updatedAt || template.createdAt).toLocaleString()}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No Amazon prompt templates found. Create your first template.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

