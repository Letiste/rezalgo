import { containerInputSchema } from "./containerInput";
import { containerOutputSchema } from "./containerOutput";

export const postSchema = {
  body: containerInputSchema,
  consumes: ["application/json"],
  produces: ["application/json"],
  response: { 200: containerOutputSchema },
};
