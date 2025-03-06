import Link from "next/link"
import { PlusCircle } from "lucide-react"
// import { ContentList } from "@/components/content-list"
import { Button } from "@/components/ui/button"
import { ContentList } from "../components/content-list"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Content</h1>
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>
      <ContentList />
    </div>
  )
}

