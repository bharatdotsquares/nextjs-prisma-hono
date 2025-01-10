import { Jwt } from 'hono/utils/jwt'

const genToken = (id: string) => {
  return Jwt.sign({ id }, process.env.AUTH_SECRET || '')
}

export default genToken