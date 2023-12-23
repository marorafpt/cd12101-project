import { getUserId } from '../auth/utils.mjs'
import { updateTodo } from '../../businessLogic/todos.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger('updateTodoEnpoint')

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  logger.info(`Recieved UPDATE for ${todoId}. updatedTodo: ${updatedTodo}`)
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const authorization = event.headers.Authorization
  const userId = getUserId(authorization)

  const item = await updateTodo(todoId, updatedTodo, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "item": item
    })
  }
}
