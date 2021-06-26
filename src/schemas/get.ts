export const getSchema = {
  produces: ["text/html"],
  response: {
    200: { description: 'HTML page for the corresponding challenge', type: "string" },
  },
};
