export const success = (body: any, statusCode = 200) => ({
  statusCode,
  body: JSON.stringify(body)
});

export const failure = (message: string, statusCode = 400) => ({
  statusCode,
  body: JSON.stringify({ message })
});
