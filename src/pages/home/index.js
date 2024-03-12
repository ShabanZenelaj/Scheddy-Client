import {Alert, Box, Button, Chip, Grid, Slide, Snackbar, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const SlideTransition = (props) => {
    return <Slide {...props} direction='up' />
}

const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    // Extract day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    // Add the appropriate suffix to the day
    let dayWithSuffix;
    if (day % 10 === 1 && day !== 11) {
        dayWithSuffix = `${day}st`;
    } else if (day % 10 === 2 && day !== 12) {
        dayWithSuffix = `${day}nd`;
    } else if (day % 10 === 3 && day !== 13) {
        dayWithSuffix = `${day}rd`;
    } else {
        dayWithSuffix = `${day}th`;
    }

    return `${dayWithSuffix} of ${month} ${year}`;
}

const Home = () => {
    const [items, setItems] = useState([]);
    const [workedHours, setWorkedHours] = useState("0.00");
    const [punchIn, setPunchIn] = useState(true);
    const [snackbar, setSnackbar] = useState({show: false, message: '', color: 'success'});
    const [cookies, removeCookie] = useCookies([]);

    const navigate = useNavigate();

    const date = new Date();

    const fetchItems = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/attendance`, { withCredentials: true }).then((res) => {
            setItems(res.data)
        }).catch((err) => {
            if(err.response.status === 401){
                navigate("/login");
            }
        })
    }

    useEffect(() => {
        if (!cookies.token) {
            navigate("/login");
        }
        fetchItems()
    }, []);

    useEffect(() => {
        const dateObj = new Date();
        const timezoneOffset = dateObj.getTimezoneOffset();
        dateObj.setUTCMinutes(dateObj.getUTCMinutes() - timezoneOffset);

        const date =
            dateObj.getUTCFullYear() +
            '-' +
            ('0' + (dateObj.getUTCMonth() + 1)).slice(-2) +
            '-' +
            ('0' + dateObj.getUTCDate()).slice(-2);

        const calculateWorkedHours = () => {

            setWorkedHours(Number(items.find((item) => {
                return item.date === date
            })?.total ?? 0).toFixed(2) || "0.00")
        }

        const punchInOrOut = () => {
            const todayRecords = items.find((item) => {
                return item.date === date
            });

            if(todayRecords !== undefined) {
                if(todayRecords.time.length > 0){
                    const index = todayRecords.time.length - 1;
                    const latestTime = todayRecords.time[index];
                    if(latestTime.end !== undefined){
                        setPunchIn(true);
                    } else {
                        setPunchIn(false);
                    }
                } else {
                    setPunchIn(true);
                }
            } else {
                setPunchIn(true);
            }
        }

        calculateWorkedHours()
        punchInOrOut()
    }, [items]);

    const handlePunch = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/attendance`, {}, { withCredentials: true }).then((res) => {
            setSnackbar({show: true, message: punchIn ? 'Punched in successfully' : 'Punched out successfully', color: 'success'})
            fetchItems()
        }).catch(() => {
            setSnackbar({show: true, message: punchIn ? 'Punch in failed' : 'Punch out failed', color: 'error'})
        })
    }

    const handleLogout = () => {
        removeCookie("token");
        navigate("/login");
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnackbar({show: false, message: snackbar.message, color: snackbar.color})
    }

    return (
        <Box sx={{
                margin: {md: 10, xs: 1}
            }}
        >
            <Typography variant="h2">Welcome!</Typography>
            <Typography variant="h4">Today's date is: {formatDate(date)}</Typography>
            <Typography variant="h5">You worked for: {workedHours} hours</Typography>

            <Grid
                container
                mt={10}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Grid
                    item
                    sm={6}
                    xs={12}
                    sx={{
                        display: 'flex',
                        gap: '25px',
                        marginBottom: {
                            xs: '20px',
                            sm: '0'
                        }
                    }}
                >
                    {
                        punchIn ?
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                color="success"
                                onClick={() => handlePunch()}
                            >
                                PUNCH IN
                            </Button>
                            :
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                color="warning"
                                onClick={() => handlePunch()}
                            >
                                PUNCH OUT
                            </Button>
                    }
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="error"
                        onClick={() => handleLogout()}
                    >
                        LOG OUT
                    </Button>
                </Grid>
            </Grid>
            <Grid
                container
                mt={5}
                py={1}
                sx={{
                    borderBottom: '1px solid black'
                }}
            >
                <Grid
                    item
                    xs={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'end'
                    }}
                >
                    <Typography sx={{ fontSize: '1.2em'}}>Date</Typography>
                </Grid>
                <Grid
                    item
                    xs={7}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'end'
                    }}
                >
                    <Typography sx={{ fontSize: '1.2em'}}>Time</Typography>
                </Grid>
                <Grid
                    item
                    xs={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'end'
                    }}
                >
                    <Typography sx={{ fontSize: '1.2em'}}>Total</Typography>
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
            <Grid container>
                {items.map((item, index) => {
                    return (
                        <Grid
                            key={index}
                            container
                            py={1}
                            sx={{
                                borderBottom: '1px solid #c3c3c3',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Grid item xs={3}>
                                {item.date}
                            </Grid>
                            <Grid item xs={7}>
                                {item.time.map((value, index) => {
                                    return (
                                        <Chip
                                            key={index}
                                            size="medium"
                                            label={value.start + (value?.end !== undefined ? ' - ' + value.end : '')}
                                            color="primary"
                                            variant={value?.end !== undefined ? 'filled' : 'outlined'}
                                            sx={{
                                                marginRight: '5px',
                                                marginY: '5px'
                                            }}
                                        />
                                    )
                                })}
                            </Grid>
                            <Grid item xs={2}>
                                {Number(item.total).toFixed(2)} hours
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
            <Snackbar
                open={snackbar.show}
                onClose={handleCloseSnackbar}
                autoHideDuration={1500}
                key={1}
                TransitionComponent={SlideTransition}
            >
                <Alert
                    elevation={3}
                    variant='filled'
                    onClose={handleCloseSnackbar}
                    severity={snackbar.color}
                >
                    {snackbar?.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Home;