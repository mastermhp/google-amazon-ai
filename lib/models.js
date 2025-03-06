// import { ObjectId } from "mongodb"
// import clientPromise from "./mongodb"

// // Content collection
// export async function saveContent(content) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const result = await db.collection("contents").insertOne({
//     ...content,
//     createdAt: new Date(),
//   })

//   return { ...content, _id: result.insertedId }
// }

// export async function getContentHistory(limit = 20, skip = 0) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const contents = await db.collection("contents").find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

//   const total = await db.collection("contents").countDocuments({})

//   return { contents, total }
// }

// export async function getContentById(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("contents").findOne({ _id: new ObjectId(id) })
// }

// export async function deleteContent(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("contents").deleteOne({ _id: new ObjectId(id) })
// }

// export async function updateContent(id, updatedContent) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const result = await db.collection("contents").updateOne(
//     { _id: new ObjectId(id) },
//     {
//       $set: {
//         ...updatedContent,
//         updatedAt: new Date(),
//       },
//     },
//   )

//   if (result.matchedCount === 0) {
//     return null
//   }

//   return db.collection("contents").findOne({ _id: new ObjectId(id) })
// }

// // Prompt templates collection
// export async function savePromptTemplate(template) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   if (template._id) {
//     const { _id, ...data } = template
//     const objectId = new ObjectId(_id)

//     await db.collection("promptTemplates").updateOne(
//       { _id: objectId },
//       {
//         $set: {
//           ...data,
//           updatedAt: new Date(),
//         },
//       },
//     )

//     return db.collection("promptTemplates").findOne({ _id: objectId })
//   } else {
//     const result = await db.collection("promptTemplates").insertOne({
//       ...template,
//       createdAt: new Date(),
//     })

//     return { ...template, _id: result.insertedId }
//   }
// }

// export async function getPromptTemplates() {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("promptTemplates").find({}).toArray()
// }

// export async function getPromptTemplateById(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("promptTemplates").findOne({ _id: new ObjectId(id) })
// }

// export async function deletePromptTemplate(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("promptTemplates").deleteOne({ _id: new ObjectId(id) })
// }

// export async function getDefaultPromptTemplate() {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const template = await db.collection("promptTemplates").findOne({ isDefault: true })

//   if (!template) {
//     // Create default template if none exists
//     const defaultTemplate = {
//       name: "Default Template",
//       template: `Create a comprehensive, SEO-optimized {{contentType}} about "{{keyword}}".
  
// Use these keywords: {{keywords}}

// Based on these titles from top search results:
// {{titles}}

// And these snippets:
// {{snippets}}

// Include the following image placeholders in appropriate places within the content:
// {{imagePrompts}}

// The content should be well-structured with headings and subheadings,
// and include an introduction and conclusion.

// Content length should be {{contentLength}} (short: ~300 words, medium: ~600 words, long: ~1000 words).

// Also generate a meta description for SEO purposes.`,
//       isDefault: true,
//       createdAt: new Date(),
//     }

//     const result = await db.collection("promptTemplates").insertOne(defaultTemplate)
//     return { ...defaultTemplate, _id: result.insertedId }
//   }

//   return template
// }

// // User authentication
// export async function authenticateUser(username, password) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   // For a real application, you should hash passwords and use proper auth
//   // This is a simplified example
//   const user = await db.collection("users").findOne({ username })

//   if (!user) {
//     // Check if this is the first login attempt and create admin user
//     const usersCount = await db.collection("users").countDocuments({})

//     if (usersCount === 0 && username === "admin" && password === "password123") {
//       // Create the admin user
//       const newUser = {
//         username: "admin",
//         password: "password123", // In a real app, hash this password
//         role: "admin",
//         createdAt: new Date(),
//       }

//       await db.collection("users").insertOne(newUser)
//       return { success: true, user: { name: "Admin", role: "admin" } }
//     }

//     return { success: false, error: "Invalid credentials" }
//   }

//   if (user.password === password) {
//     return { success: true, user: { name: user.username, role: user.role } }
//   }

//   return { success: false, error: "Invalid credentials" }
// }







// import { ObjectId } from "mongodb"
// import clientPromise from "./mongodb"

// // Content collection - Google Search Content
// export async function saveContent(content) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const result = await db.collection("contents").insertOne({
//     ...content,
//     type: "google-search",
//     createdAt: new Date(),
//   })

//   return { ...content, _id: result.insertedId }
// }

// // Amazon Product Review Content
// export async function saveAmazonReview(review) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const result = await db.collection("amazon-reviews").insertOne({
//     ...review,
//     type: "amazon-review",
//     createdAt: new Date(),
//   })

//   return { ...review, _id: result.insertedId }
// }

// export async function getAmazonReviewHistory(limit = 20, skip = 0) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const reviews = await db
//     .collection("amazon-reviews")
//     .find({})
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .toArray()

//   const total = await db.collection("amazon-reviews").countDocuments({})

//   return { reviews, total }
// }

// export async function getAmazonReviewById(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("amazon-reviews").findOne({ _id: new ObjectId(id) })
// }

// export async function deleteAmazonReview(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("amazon-reviews").deleteOne({ _id: new ObjectId(id) })
// }

// export async function getContentHistory(limit = 20, skip = 0) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const contents = await db.collection("contents").find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

//   const total = await db.collection("contents").countDocuments({})

//   return { contents, total }
// }

// export async function getContentById(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("contents").findOne({ _id: new ObjectId(id) })
// }

// export async function deleteContent(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("contents").deleteOne({ _id: new ObjectId(id) })
// }

// export async function updateContent(id, updatedContent) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const result = await db.collection("contents").updateOne(
//     { _id: new ObjectId(id) },
//     {
//       $set: {
//         ...updatedContent,
//         updatedAt: new Date(),
//       },
//     },
//   )

//   if (result.matchedCount === 0) {
//     return null
//   }

//   return db.collection("contents").findOne({ _id: new ObjectId(id) })
// }

// // Prompt templates collection
// export async function savePromptTemplate(template) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   if (template._id) {
//     const { _id, ...data } = template
//     const objectId = new ObjectId(_id)

//     await db.collection("promptTemplates").updateOne(
//       { _id: objectId },
//       {
//         $set: {
//           ...data,
//           updatedAt: new Date(),
//         },
//       },
//     )

//     return db.collection("promptTemplates").findOne({ _id: objectId })
//   } else {
//     const result = await db.collection("promptTemplates").insertOne({
//       ...template,
//       createdAt: new Date(),
//     })

//     return { ...template, _id: result.insertedId }
//   }
// }

// export async function getPromptTemplates() {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("promptTemplates").find({}).toArray()
// }

// export async function getPromptTemplateById(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("promptTemplates").findOne({ _id: new ObjectId(id) })
// }

// export async function deletePromptTemplate(id) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   return db.collection("promptTemplates").deleteOne({ _id: new ObjectId(id) })
// }

// export async function getDefaultPromptTemplate() {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   const template = await db.collection("promptTemplates").findOne({ isDefault: true })

//   if (!template) {
//     // Create default template if none exists
//     const defaultTemplate = {
//       name: "Default Template",
//       template: `Create a comprehensive, SEO-optimized {{contentType}} about "{{keyword}}".
  
// Use these keywords: {{keywords}}

// Based on these titles from top search results:
// {{titles}}

// And these snippets:
// {{snippets}}

// Include the following image placeholders in appropriate places within the content:
// {{imagePrompts}}

// The content should be well-structured with headings and subheadings,
// and include an introduction and conclusion.

// Content length should be {{contentLength}} (short: ~300 words, medium: ~600 words, long: ~1000 words).

// Also generate a meta description for SEO purposes.`,
//       isDefault: true,
//       createdAt: new Date(),
//     }

//     const result = await db.collection("promptTemplates").insertOne(defaultTemplate)
//     return { ...defaultTemplate, _id: result.insertedId }
//   }

//   return template
// }

// // User authentication
// export async function authenticateUser(username, password) {
//   const client = await clientPromise
//   const db = client.db("content-generator")

//   // For a real application, you should hash passwords and use proper auth
//   // This is a simplified example
//   const user = await db.collection("users").findOne({ username })

//   if (!user) {
//     // Check if this is the first login attempt and create admin user
//     const usersCount = await db.collection("users").countDocuments({})

//     if (usersCount === 0 && username === "admin" && password === "password123") {
//       // Create the admin user
//       const newUser = {
//         username: "admin",
//         password: "password123", // In a real app, hash this password
//         role: "admin",
//         createdAt: new Date(),
//       }

//       await db.collection("users").insertOne(newUser)
//       return { success: true, user: { name: "Admin", role: "admin" } }
//     }

//     return { success: false, error: "Invalid credentials" }
//   }

//   if (user.password === password) {
//     return { success: true, user: { name: user.username, role: user.role } }
//   }

//   return { success: false, error: "Invalid credentials" }
// }



import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

// Content collection - Google Search Content
export async function saveContent(content) {
  const client = await clientPromise
  const db = client.db("content-generator")

  const result = await db.collection("contents").insertOne({
    ...content,
    type: "google-search",
    createdAt: new Date(),
  })

  return { ...content, _id: result.insertedId }
}

// Amazon Product Review Content
export async function saveAmazonReview(review) {
  const client = await clientPromise
  const db = client.db("content-generator")

  const result = await db.collection("amazon-reviews").insertOne({
    ...review,
    type: "amazon-review",
    createdAt: new Date(),
  })

  return { ...review, _id: result.insertedId }
}

export async function getAmazonReviewHistory(limit = 20, skip = 0) {
  const client = await clientPromise
  const db = client.db("content-generator")

  const reviews = await db
    .collection("amazon-reviews")
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection("amazon-reviews").countDocuments({})

  return { reviews, total }
}

export async function getAmazonReviewById(id) {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("amazon-reviews").findOne({ _id: new ObjectId(id) })
}

export async function deleteAmazonReview(id) {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("amazon-reviews").deleteOne({ _id: new ObjectId(id) })
}

export async function getContentHistory(limit = 20, skip = 0) {
  const client = await clientPromise
  const db = client.db("content-generator")

  const contents = await db.collection("contents").find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

  const total = await db.collection("contents").countDocuments({})

  return { contents, total }
}

export async function getContentById(id) {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("contents").findOne({ _id: new ObjectId(id) })
}

export async function deleteContent(id) {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("contents").deleteOne({ _id: new ObjectId(id) })
}

export async function updateContent(id, updatedContent) {
  const client = await clientPromise
  const db = client.db("content-generator")

  const result = await db.collection("contents").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updatedContent,
        updatedAt: new Date(),
      },
    },
  )

  if (result.matchedCount === 0) {
    return null
  }

  return db.collection("contents").findOne({ _id: new ObjectId(id) })
}

// Prompt templates collection
export async function savePromptTemplate(template) {
  const client = await clientPromise
  const db = client.db("content-generator")

  if (template._id) {
    const { _id, ...data } = template
    const objectId = new ObjectId(_id)

    await db.collection("promptTemplates").updateOne(
      { _id: objectId },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    return db.collection("promptTemplates").findOne({ _id: objectId })
  } else {
    const result = await db.collection("promptTemplates").insertOne({
      ...template,
      createdAt: new Date(),
    })

    return { ...template, _id: result.insertedId }
  }
}

export async function getPromptTemplates() {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("promptTemplates").find({}).toArray()
}

export async function getPromptTemplateById(id) {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("promptTemplates").findOne({ _id: new ObjectId(id) })
}

export async function deletePromptTemplate(id) {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("promptTemplates").deleteOne({ _id: new ObjectId(id) })
}

export async function getDefaultPromptTemplate() {
  const client = await clientPromise
  const db = client.db("content-generator")

  const template = await db.collection("promptTemplates").findOne({ isDefault: true })

  if (!template) {
    // Create default template if none exists
    const defaultTemplate = {
      name: "Default Template",
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

Content length should be {{contentLength}} (short: ~300 words, medium: ~600 words, long: ~1000 words).

Also generate a meta description for SEO purposes.`,
      isDefault: true,
      createdAt: new Date(),
    }

    const result = await db.collection("promptTemplates").insertOne(defaultTemplate)
    return { ...defaultTemplate, _id: result.insertedId }
  }

  return template
}

// Add these functions for Amazon review prompt templates
export async function saveAmazonPromptTemplate(template) {
  const client = await clientPromise
  const db = client.db("content-generator")

  if (template._id) {
    const { _id, ...data } = template
    const objectId = new ObjectId(_id)

    await db.collection("amazonPromptTemplates").updateOne(
      { _id: objectId },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    return db.collection("amazonPromptTemplates").findOne({ _id: objectId })
  } else {
    const result = await db.collection("amazonPromptTemplates").insertOne({
      ...template,
      createdAt: new Date(),
    })

    return { ...template, _id: result.insertedId }
  }
}

export async function getAmazonPromptTemplates() {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("amazonPromptTemplates").find({}).toArray()
}

export async function getAmazonPromptTemplateById(id) {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("amazonPromptTemplates").findOne({ _id: new ObjectId(id) })
}

export async function deleteAmazonPromptTemplate(id) {
  const client = await clientPromise
  const db = client.db("content-generator")

  return db.collection("amazonPromptTemplates").deleteOne({ _id: new ObjectId(id) })
}

export async function getDefaultAmazonPromptTemplate() {
  const client = await clientPromise
  const db = client.db("content-generator")

  const template = await db.collection("amazonPromptTemplates").findOne({ isDefault: true })

  if (!template) {
    // Create default template if none exists
    const defaultTemplate = {
      name: "Default Amazon Review Template",
      template: `You are an expert product reviewer. Create an SEO-friendly blog post comparing these Amazon products:

{{productDetails}}

Target Keywords: {{keywords}}

Your blog post should include:
1. An engaging introduction about the product category.
2. A comparison table of all products with their key features, prices, and ratings.
3. Detailed reviews with pros and cons.
4. "Best for" recommendations (e.g., "Best Value", "Premium Choice").
5. A buying guide explaining important factors.
6. A conclusion with final recommendations.
7. An FAQ section with 3-5 common questions.

Format the content in markdown with proper headings, bullet points, and emphasis.
Include suggestions for affiliate links marked as: **[AFFILIATE LINK OPPORTUNITY]**.`,
      isDefault: true,
      createdAt: new Date(),
    }

    const result = await db.collection("amazonPromptTemplates").insertOne(defaultTemplate)
    return { ...defaultTemplate, _id: result.insertedId }
  }

  return template
}

// Update the getAllContent function to get both types of content
export async function getAllContent(limit = 20, skip = 0) {
  const client = await clientPromise
  const db = client.db("content-generator")

  // Get Google Search content
  const googleContents = await db.collection("contents").find({}).sort({ createdAt: -1 }).toArray()

  // Get Amazon Review content
  const amazonReviews = await db.collection("amazon-reviews").find({}).sort({ createdAt: -1 }).toArray()

  // Combine and sort by createdAt
  const allContent = [...googleContents, ...amazonReviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(skip, skip + limit)

  const total = googleContents.length + amazonReviews.length

  return { contents: allContent, total }
}

// User authentication
export async function authenticateUser(username, password) {
  const client = await clientPromise
  const db = client.db("content-generator")

  // For a real application, you should hash passwords and use proper auth
  // This is a simplified example
  const user = await db.collection("users").findOne({ username })

  if (!user) {
    // Check if this is the first login attempt and create admin user
    const usersCount = await db.collection("users").countDocuments({})

    if (usersCount === 0 && username === "admin" && password === "password123") {
      // Create the admin user
      const newUser = {
        username: "admin",
        password: "password123", // In a real app, hash this password
        role: "admin",
        createdAt: new Date(),
      }

      await db.collection("users").insertOne(newUser)
      return { success: true, user: { name: "Admin", role: "admin" } }
    }

    return { success: false, error: "Invalid credentials" }
  }

  if (user.password === password) {
    return { success: true, user: { name: user.username, role: user.role } }
  }

  return { success: false, error: "Invalid credentials" }
}

