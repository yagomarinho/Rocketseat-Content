import React, { useState, useEffect } from "react";
import api from './services/api'

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {

    api.get('repositories')
      .then(response => setRepositories(oldRepositories => [...oldRepositories, ...response.data]))

  }, [])
  async function handleAddRepository() {
    const { data: repository } = await api.post('repositories', { title: 'Novo Titulo para o Repositorio', url: 'https://github.com/yagomarinho/conceitos-reactjs', techs: ['ReactJs', 'Babel', 'Webpack', 'JSX'] })

    setRepositories([...repositories, repository])
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`, {
      params: {
        id
      }
    })
    const index = repositories.findIndex(repository => repository.id === id)
    const newRepositories = [...repositories]
    newRepositories.splice(index, 1)
    setRepositories(newRepositories)
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}

            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
          </button>
          </li>)
        )}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
