import { useActionState } from "react";
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, Navigate } from 'react-router';

function LoginForm(props) {
    const [state, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});

    async function loginFunction(prevState, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            await props.handleLogin(credentials);
            props.handleClose(); // Close the modal after successful login
            return { success: true };
        } catch (error) {
            return { error: 'Login failed. Check your credentials.' };
        }

        
    }

    return (
        <>
            { isPending && <Alert variant="warning">Please, wait for the server's response...</Alert> }
            <div className="d-flex flex-column align-items-center justify-content-center">
                <Form action={formAction}>
                    <Form.Group controlId='username' className='mb-3'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' name='username' required />
                    </Form.Group>

                    <Form.Group controlId='password' className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' name='password' required minLength={2} />
                    </Form.Group>

                    {state.error && <p className="text-danger">{state.error}</p>}

                    <div className="d-flex justify-content-center gap-4">
                        <Button type='submit'  disabled={isPending}>Login</Button>
                        <Button variant="secondary"  onClick={props.handleClose} disabled={isPending}>Chiudi</Button>
                    </div>
                </Form>
            </div>
        </>
    );
}

function LogoutButton(props) {
  return <Button size="lg" onClick={props.logout}>Logout</Button>;
  
}

export { LoginForm, LogoutButton };