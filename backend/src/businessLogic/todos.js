import { TodosAccess } from '../helpers/todosAccess.js'
import { AttachmentUtils } from './attachmentUtils.js';
import { createLogger } from '../utils/logger.js'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// Implement businessLogic

const logger = createLogger('Todos')


const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

/**
 * @param {} todo 
 * @returns 
 */
function formatTodo(todo) {
  var formatted = {}
  for (const key in todo) {
    formatted[key] = Object.values(todo[key])[0]
  }
  return formatted
}

export async function getTodosForUser(userId) {
  logger.info('Getting all todos');

  const items = await todosAccess.getTodosForUser(userId)
  return items.map(todo => formatTodo(todo))
}

export async function createTodo(createTodoRequest, userId){

  try {
    logger.info("Creating a new todo");

    if (createTodoRequest.name.trim().length == 0) {
      throw new Error("Name cannot be an empty string");
    }

    const itemId = uuid.v4()

    return await todosAccess.createTodo({
      todoId: itemId,
      userId: userId,
      createdAt: new Date().toISOString(),
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: `https://${AttachmentUtils.bucketName}.s3.amazonaws.com/${itemId}`
    })
  } catch (error) {
    createError(error);
  }

}
export async function updateTodo(
  todoItemId,
  updateTodoRequest,
  userId,
) {

  try {
    logger.info("Updating a todo");


    if (updateTodoRequest.name.trim().length == 0) {
      throw new Error("Name cannot be an empty string");
    }

    return await todosAccess.updateTodo(todoItemId = todoItemId, updateTodoRequest, userId);
  } catch (error) {
    createError(error);
  }
}

export async function deleteTodo(todoItemId, userId) {
  try {
    return await todosAccess.deleteTodo(todoItemId, userId);
  } catch (error) {
    createError(error);
  }
}

export async function createAttachmentPresignedUrl(todoId, userId) {
  try {
    if (!userId) throw new Error("User Id is missing");

    return await attachmentUtils.getUploadUrl(todoId);
  } catch (error) {
    createError(error);
  }
}
