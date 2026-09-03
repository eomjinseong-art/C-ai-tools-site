import { revalidatePath } from "next/cache";

export function revalidatePublicPaths() {
  revalidatePath("/", "layout");
}
