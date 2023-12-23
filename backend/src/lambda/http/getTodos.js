import { getUserId } from '../auth/utils.mjs'
import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos.js'

const todoTable = process.env.TODOS_TABLE

export async function handler(event) {
  const authorization = event.headers.Authorization
  const userId = getUserId(authorization)

  const items = await getTodosForUser(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "items": items
    })
  }
}