import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../auth/utils.mjs'
import { createTodo } from '../../businessLogic/todos.js'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todoTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)
  const itemId = uuidv4()

  const parsedBody = JSON.parse(event.body)

  const authorization = event.headers.Authorization
  const userId = getUserId(authorization)

  const newItem = await createTodo(parsedBody, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "item": newItem
    })
  }
}