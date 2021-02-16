interface TechObject {
    title: string
    experience: number
}

interface userProps {
    name?: string
    email: string
    password: string
    techs: Array<string | TechObject>
}

export default function createUser({ name, email, password }: userProps) {
    const user = {
        name,
        email,
        password
    }
    return user
}