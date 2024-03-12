import {Box, Button, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async data => {
        axios.post(`${process.env.REACT_APP_API_URL}/user`, data, { withCredentials: true }).then((res) => {
            navigate("/");
        }).catch(() => {
            setError("login", {
                message: "Username or password is incorrect",
            })
        })
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Typography variant="h2">Login!</Typography>
                <Typography variant="h5">Please enter your username and password</Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mt={3} gap={1} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            label="Username"
                            placeholder="Please enter your username"
                            name="username"
                            {...register("username", {
                                required: true,
                                onChange: () => {
                                    clearErrors(['login']);
                                }
                            })}
                        />
                        {errors.username?.type === "required" && (
                            <Typography color="error">Username is required.</Typography>
                        )}
                        <TextField
                            type="password"
                            label="Password"
                            placeholder="Please enter your password"
                            name="password"
                            {...register("password", {
                                required: true,
                                onChange: () => {
                                    clearErrors(['login']);
                                }
                            })}
                        />
                        {errors.password?.type === "required" && (
                            <Typography color="error">Password is required.</Typography>
                        )}
                        {errors.login && (
                            <Typography color="error">{errors.login.message}</Typography>
                        )}

                        <Button type="submit" color="success" variant="contained" size="large">LOGIN</Button>

                        <Typography>Don't have an account? <Link to={"/signup"}>Register now!</Link></Typography>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default Login