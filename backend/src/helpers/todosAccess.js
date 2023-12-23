//import * as AWS from '@aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, DynamoDBDocumentClient as DocumentClient } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../utils/logger.js'

// AWSXRay.enableAutomaticMode()

const docClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE
const todosIndex = process.env.TODOS_CREATED_AT_INDEX

const logger = createLogger('TodosAccess')

// Implement the dataLayer logic

export class TodosAccess {

  /**
   * 
   * @param {DynamoDBDocument} docClient
   */
  constructor(){
  }

  async getTodosForUser(userId) {
    logger.info('Getting all todos for a User: ' + userId)

    const command = new QueryCommand({
      TableName: todosTable,
      // IndexName: todosIndex,
      ExpressionAttributeValues: {
        ':userId': { S: userId }
      },
      KeyConditionExpression: 'userId = :userId',
    })
    logger.info('command: ' + JSON.stringify(command))
    const result = await docClient.send(command)
    logger.info('result: ' + JSON.stringify(result))

    const items = result.Items
    return items
  
  }

  async createTodo(todoItem) {
    logger.info('Creating a todo');
    await docClient.put({
      TableName: todosTable,
      Item: todoItem
    })

    return todoItem;
  }

  async updateTodo(todoId, todo, userId) {
    logger.info('Updating a todo: ' + todoId);
    const updated = await docClient.update({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#todo_name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done,
      },
      UpdateExpression: 'SET #todo_name = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW',
    })

    logger.info(JSON.stringify(updated.Attributes));
    return todo;
  }


  async deleteTodo(todoItemId, userId){
    logger.info(`Deleting a todo: ${todoItemId}`);
    await docClient.delete({
      TableName: todosTable,
      Key: {
        todoId: todoItemId,
        userId: userId
      },
    })

    return true;
  }
}