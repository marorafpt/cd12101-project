import jsonwebtoken from 'jsonwebtoken'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJRKv2KtUKKD73MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1nZWl3dzRkZ2FuYTZ6bXRkLnVzLmF1dGgwLmNvbTAeFw0yMzEyMjAy
MzMyMDhaFw0zNzA4MjgyMzMyMDhaMCwxKjAoBgNVBAMTIWRldi1nZWl3dzRkZ2Fu
YTZ6bXRkLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAPS/66gjp8FY/nALbxuskuPrieCpX/tDglcy26GAWGJXB1GKwb5WcC39+/GW
ZWQaK6UbJV3V6mAsspflgDdqeOyfTK8tAzdTmwkejfmTwGE91PKkga349PB7R/M9
DArnZJwLWLjYK5VuHnBllnYK1jLMJsikUlsxYEc8/5DAikXGU+zqsOrk0Yw+vHNv
MMXK+yuEJt/hVEBx5MKnRmShjepOW81nAX62VA96YI3e3JLgMm/4oKvj2YevODB2
+UONdQ197hfxt8m6EIX3K07E+hS1SKnF7B9tk7CjVtghhAcmonPOF2c8svvgMYxq
PqIEqJncVrXDwGPLLg/qfKbbL9kCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUPm6Uda6f0CHCAP2ClDR8zql9d9IwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBzkH00Y9KnwvzYDlQB7WzAdb7SrjeQ+WqKc8EmfMlU
agqr751fPtsbP/v0X1SBN+/MEpXn9Ixm6eRX5489fDvcgZSBWPqE67Ax0zt+0MsU
pdNzCJ4b5AF4VdBkKx1ZYcoTAiy9FfExNvz9s3iR/wRv2QHQ2jNoD38ryhROe2HR
yj+wI5ZVnJtRg31Vo0gTtGnfXs4g87c+r7tEzY9jssVzKxuLLS04CesFazx8UvCA
r6KVkenX40hZrhKm7QMsu/8jABmoZSvRcuGY9qvAj5qZcdvmEpk9+Y2meDK3TL1M
OBy8/WJKO28DHpIsO72i8B6UE7RpVC4NjTvoLpwFhW+r
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader) {
  if (!authHeader) throw new Error('No authorization header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authorization header')

  const split = authHeader.split(' ')
  const token = split[1]

  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}
