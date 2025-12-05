import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function saveFile(file: File, directory: string): Promise<string> {
  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure directory exists
  const uploadDir = join(process.cwd(), "public", directory);
  await mkdir(uploadDir, { recursive: true });

  // Create unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "-")}`;
  const filepath = join(uploadDir, filename);

  // Save file
  await writeFile(filepath, buffer);

  // Return relative URL
  return `/${directory}/${filename}`;
}
