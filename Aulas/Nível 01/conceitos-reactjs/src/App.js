import React, { useState, useEffect } from 'react'
import api from './services/api'

import Header from './components/Header'

import './App.css'

const App = () => {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        api.get('projects')
            .then(response => setProjects(oldState => [...oldState, ...response.data]))
    }, [])

    async function handleAddProject() {
        // setProjects(oldState => [...oldState, `Novo Projeto ${Date.now()}`])
        const response = await api.post('projects', {
            title: `Novo Projeto ${Date.now()}`,
            owner: 'Yago Marinho'
        })
        const project = response.data
        setProjects([...projects, project])
    }

    return (
        <>
            <Header title='ReactJS' />
            <ul>
                {projects.map(project => <li key={project.id}>{project.title}, {project.owner}</li>)}
            </ul>
            <button type='button' onClick={handleAddProject} >Adicionar projeto</button>
        </>
    )
}

export default App