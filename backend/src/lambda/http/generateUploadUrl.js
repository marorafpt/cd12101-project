
import { createAttachmentPresignedUrl } from '../../businessLogic/todos.js'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger('GenerateUploadUrl');

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  logger.info(`Recieved POST requet for upload url to todoId: ${todoId}`)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const uploadUrl = await createAttachmentPresignedUrl(todoId, userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "uploadUrl": uploadUrl
    })
  }
}

