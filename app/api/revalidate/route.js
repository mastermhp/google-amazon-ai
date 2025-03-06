import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { path, secret } = await request.json()

    // Verify the secret to prevent unauthorized revalidations
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    // Revalidate the specified path
    revalidatePath(path)

    return NextResponse.json({ revalidated: true, path })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

