import jsonwebtoken from 'jsonwebtoken'

/**
 * Parse an authorization header
 * @param authorizationHeader authorization header to parse
 * @returns a user id from the JWT token
 */
 export function getUserId(authorizationHeader) {
    const split = authorizationHeader.split(' ')
    const jwtToken = split[1]

    const decodedJwt = jsonwebtoken.decode(jwtToken)
    return decodedJwt.sub
  }