import "dotenv/config";
import {z} from "zod";

function hasDatabaseName(uri :string):boolean{
    try{
        const url = new URL(uri);
         return url.pathname.length>1;

    }catch{
        return false;
    }
}
const envSchema = z.object({
    NODE_ENV:z.enum(["development","test","production"]).default("development"),
    PORT:z.coerce.number().int().positive().default(4000),
MONGO_URI: z
    .string()
    .min(1, "MONGO_URI is required")
    .refine(
      (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGO_URI must start with mongodb:// or mongodb+srv://",
    )
    .refine(
      hasDatabaseName,
      "MONGO_URI must include a database name, e.g. ...mongodb.net/harate?retryWrites=true",
    ),
});
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
   for (const issue of parsed.error.issues) {
    console.error(`   - ${issue.path.map(String).join(".")}: ${issue.message}`);
  }
  process.exit(1);
}
export const env = parsed.data;