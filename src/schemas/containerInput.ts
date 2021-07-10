import {languages} from './languages'

/**
 * Schema of the body for the POST request
 * serving for validation.
 */

export const containerInputSchema = {
  type: "object",
  description: "The input to run the challenge.",
  required: ["language", "data"],
  properties: {
    language: {
      type: "string",
      description: "The language in which th challenge will be runned.",
      enum: Object.keys(languages) as Array<keyof typeof languages>,
    },
    data: {
      type: "string",
      description: "The code to be runned."
    }
  }
} as const
