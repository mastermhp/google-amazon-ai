import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// import { clsx } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs) {
//   return twMerge(clsx(inputs))
// }

// // Helper function to serialize MongoDB documents
// export function serializeData(data) {
//   if (data === null || data === undefined) {
//     return data
//   }

//   // Handle arrays
//   if (Array.isArray(data)) {
//     return data.map((item) => serializeData(item))
//   }

//   // Handle objects
//   if (typeof data === "object") {
//     // Handle Date objects
//     if (data instanceof Date) {
//       return data.toISOString()
//     }

//     // Handle MongoDB ObjectId
//     if (data._id && typeof data._id === "object" && data._id.toString) {
//       return {
//         ...serializeData(Object.fromEntries(Object.entries(data))),
//         _id: data._id.toString(),
//       }
//     }

//     // Handle regular objects
//     const serialized = {}
//     for (const [key, value] of Object.entries(data)) {
//       // Handle ObjectId fields
//       if (key === "_id" && typeof value === "object" && value.toString) {
//         serialized[key] = value.toString()
//       } else {
//         serialized[key] = serializeData(value)
//       }
//     }
//     return serialized
//   }

//   // Return primitive values as is
//   return data
// }

