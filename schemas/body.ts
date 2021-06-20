import {languages} from '../languages'

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