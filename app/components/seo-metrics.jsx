// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"

// export function SeoMetrics({ metrics }) {
//   return (
//     <div className="grid gap-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>SEO Performance</CardTitle>
//           <CardDescription>Key metrics for search engine optimization</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-sm font-medium">Keyword Density</span>
//                 <span className="text-sm text-muted-foreground">{metrics.keywordDensity}%</span>
//               </div>
//               <Progress value={metrics.keywordDensity * 20} className="h-2" />
//               <p className="text-xs text-muted-foreground">Optimal keyword density is between 1-3%</p>
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-sm font-medium">Readability Score</span>
//                 <span className="text-sm text-muted-foreground">{metrics.readabilityScore}/100</span>
//               </div>
//               <Progress value={metrics.readabilityScore} className="h-2" />
//               <p className="text-xs text-muted-foreground">Higher scores indicate easier readability</p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <span className="text-sm font-medium">Word Count</span>
//                 <p className="text-2xl font-bold">{metrics.wordCount}</p>
//               </div>
//               <div>
//                 <span className="text-sm font-medium">Heading Structure</span>
//                 <p className="text-2xl font-bold">{metrics.headingStructure}</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Meta Description</CardTitle>
//           <CardDescription>Preview of how your content might appear in search results</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="p-4 border rounded-md bg-muted/50">
//             <p className="text-sm">{metrics.metaDescription}</p>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Suggested Keywords</CardTitle>
//           <CardDescription>Related keywords to consider for future content</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap gap-2">
//             {metrics.suggestedKeywords.map((keyword, index) => (
//               <Badge key={index} variant="secondary">
//                 {keyword}
//               </Badge>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }




"use client"
import { BarChart, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function SeoMetrics({ metrics }) {
  if (!metrics) return null

  const getReadabilityColor = (score) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getHeadingStructureStatus = () => {
    const { h1, h2, h3 } = metrics.headingStructure

    if (h1 === 1 && h2 >= 2 && h3 >= 2) {
      return { status: "good", message: "Good heading structure" }
    } else if (h1 > 1) {
      return { status: "warning", message: "Multiple H1 headings detected" }
    } else if (h1 === 0) {
      return { status: "error", message: "Missing H1 heading" }
    } else if (h2 === 0) {
      return { status: "warning", message: "Missing H2 headings" }
    }

    return { status: "good", message: "Acceptable heading structure" }
  }

  const headingStatus = getHeadingStructureStatus()

  return (
    <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
      <div className="flex items-center mb-4">
        <BarChart className="text-blue-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold">SEO Analysis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Word Count</div>
          <div className="text-2xl text-gray-700 font-bold">{metrics.wordCount}</div>
          <div className={`text-sm mt-1 ${metrics.wordCount >= 1500 ? "text-green-500" : "text-yellow-500"}`}>
            {metrics.wordCount >= 1500 ? "Good length" : "Consider adding more content"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Readability Score</div>
          <div className="text-2xl text-gray-700 font-bold">{metrics.readabilityScore}</div>
          <div className={`text-sm mt-1 ${getReadabilityColor(metrics.readabilityScore)}`}>
            {metrics.readabilityScore >= 80
              ? "Easy to read"
              : metrics.readabilityScore >= 60
                ? "Moderately readable"
                : "Difficult to read"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Heading Structure</div>
          <div className="flex items-center">
            {headingStatus.status === "good" && <CheckCircle className="text-green-500 mr-1" size={16} />}
            {headingStatus.status === "warning" && <AlertCircle className="text-yellow-500 mr-1" size={16} />}
            {headingStatus.status === "error" && <AlertCircle className="text-red-500 mr-1" size={16} />}
            <div className="text-sm text-gray-700">{headingStatus.message}</div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            H1: {metrics.headingStructure.h1}, H2: {metrics.headingStructure.h2}, H3: {metrics.headingStructure.h3}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Affiliate Opportunities</div>
          <div className="text-2xl text-gray-700 font-bold">{metrics.affiliateLinkOpportunities}</div>
          <div className="text-sm mt-1 text-blue-500">Potential revenue points</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Info className="text-blue-500 mr-1" size={16} />
          Keyword Density
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(metrics.keywordDensity).map(([keyword, count]) => (
            <div key={keyword} className="flex justify-between bg-white p-2 rounded shadow-sm text-sm">
              <span className="font-medium text-gray-700 truncate mr-2">{keyword}</span>
              <span className={`${count > 0 ? "text-green-500" : "text-red-500"}`}>
                {count} {count === 1 ? "mention" : "mentions"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

