import { getUserId } from '../auth/utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger('deleteTodoEnpoint')

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  logger.info(`Recieved DELETE for ${todoId}`)
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const authorization = event.headers.Authorization
  const userId = getUserId(authorization)

  const deleted = await deleteTodo(todoId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "deleted": deleted
    })
  }
}

