import { Request, Response } from 'express'
import createUser from './services/CreateUser'

export function helloWorld(request: Request, response: Response) {
    const user = createUser({
        name: 'Yago',
        email: 'yago@marinho.com.br',
        password: '654321',
        techs: [
            'ReactJs',
            'React-Native',
            'NodeJs',
            { title: 'Javascript', experience: 100 }
        ]
    })

    return response.json({ message: 'Hello World!' })
}