import {languages} from './languages'

/**
 * Schema of the body for the POST request
 * serving for validation.
 */

export const bodySchema = {
  type: "object",
  required: ["language", "data"],
  properties: {
    language: {
      type: "string",
      enum: Object.keys(languages) as Array<keyof typeof languages>,
    },
    data: {
      type: "string"
    }
  }
} as const