import { podmanInputSchema } from "./podmanInput";
import { podmanOutputSchema } from "./podmanOutput";

export const postSchema = {
  body: podmanInputSchema,
  consumes: ["application/json"],
  produces: ["application/json"],
  response: { 200: podmanOutputSchema },
};
