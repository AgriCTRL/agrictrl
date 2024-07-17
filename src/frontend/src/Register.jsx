import { useState } from 'react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [id, setId] = useState('');

    const handlePrev = async (e) => {
        e.preventDefault();
        try {
            const request = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/users/${id - 1}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });

            const result = await request.json();
            setId(result.id);
            setUsername(result.username);
            setAge(result.age);
        }
        catch (error) {
            console.error('Error: ', error)
        }
    }

    const handleNext = async (e) => {
        e.preventDefault();
        try {
            const request = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/users/${id + 1}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });

            const result = await request.json();
            setId(result.id);
            setUsername(result.username);
            setAge(result.age);
        }
        catch (error) {
            console.error('Error: ', error)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault();

        const user = {
            username,
            age: Number(age),
        };

        try {
            const response = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });

            const result = await response.json();
            console.log('User created: ', result);
            setId(result.id);
        }
        catch (error) {
            console.error('Error: ', error)
        }
    }

    const handleReset = () => {        
        setId('');
        setUsername('');
        setAge('');
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        const user = {
            id: Number(id),
            username,
            age: Number(age),
        };

        try {
            const response = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/users`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });

            const result = await response.json();
            console.log('User updated: ', result);
        }
        catch (error) {
            console.error('Error: ', error);
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/users`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Number(id) })
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            console.log('User deleted');
            handleReset();
        }
        catch (error) {
            console.error('Error: ', error);
        }
    }

return (
    <div className="bg-blue-400 w-fit p-5 flex mx-auto flex-col items-center">
        <form action="#" className='flex flex-col items-center'>
            <p className="text-2xl">User Table</p>
            <input type="text" readOnly value={id}/>
            <input className='mt-5' type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input className='mt-5' type="text" placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)}/>
            <div className='mt-10'>
                <button className='bg-white mr-5 px-5 rounded-full' onClick={handlePrev}>Previous</button>
                <button className='bg-white mr-5 px-5 rounded-full' onClick={handleNext}>Next</button>
                <button className='bg-white mr-5 px-5 rounded-full' onClick={handleUpdate}>Update</button>
                <button className='bg-white mr-5 px-5 rounded-full' onClick={handleDelete}>Delete</button>
            </div>
            <div className='mt-5'>
                <button className='bg-white mr-5 px-5 rounded-full' onClick={handleReset}>New</button>
                <button className='bg-white mr-5 px-5 rounded-full' onClick={handleCreate}>Create</button>
            </div>
        </form>
    </div>
);
}
 
export default Register;