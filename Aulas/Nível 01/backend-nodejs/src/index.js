const express = require('express')
const cors = require('cors')
const { uuid, isUuid } = require('uuidv4')
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
    return response.json({ message: 'Hello World!' })
})

const projects = []

function logRequest(request, response, next) {
    const { method, url } = request

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.time(logLabel)

    next()

    console.timeEnd(logLabel)
}

function validateProjectId(request, response, next) {
    const { id } = request.params

    if (!isUuid(id)) return response.status(400).json({ error: 'Invalid Project ID.' })

    return next()
}

app.use(logRequest)

app.use('/projects/:id', validateProjectId)

app.get('/projects', (request, response) => {
    const { title } = request.query

    const results = title ? projects.filter(projects => projects.title.includes(title)) : projects

    return response.json(results)
})

app.post('/projects', (request, response) => {
    const { title, owner } = request.body
    const project = { id: uuid(), title, owner }
    projects.push(project)
    return response.json(project)
})

app.put('/projects/:id', (request, response) => {
    const { id } = request.params
    const body = request.body

    const index = projects.findIndex(project => project.id === id)

    if (index < 0) return response.status(400).json({ error: 'Project Not Found!' })

    const project = { id, ...body }
    projects[index] = project

    return response.json(project)
})

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params

    const index = projects.findIndex(project => project.id === id)
    if (index < 0) return response.status(400).json({ error: 'Project Not Found!' })

    projects.splice(index, 1)

    return response.status(204).send()
})

app.listen(3333, () => {
    console.log('Back-end started!')
})