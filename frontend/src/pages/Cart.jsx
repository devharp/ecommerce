import * as React from 'react';
import {Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const columns = [
    { id: 'srno', label: 'Serial no', minWidth: 170 },
    { id: 'title', label: 'Title', minWidth: 100 },
    { id: 'image', label: 'Image', minWidth: 170, },
    { id: 'edit', label: 'Edit', minWidth: 170, },
    { id: 'quantity', label: 'Quantity', minWidth: 170, },
    { id: 'price', label: 'Price', minWidth: 170, },
];

const defrows = [
    { srno: '1', title: 'T Shirt', image: 'link here', edit: 'edit', quantity: '5' },
    { srno: '1', title: 'T Shirt', image: 'link here', edit: 'edit', quantity: '5' },
];

function Cart(props) {
    const host = props.host;
    let once = false;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [total, setTotal] = React.useState(0);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    async function fetchCartRows(){
        const res = await fetch(`${host}/cart`);
        const payload = await res.json();
        let temp = [];
        let temptotal = 0;
        for (let i = 0; i < payload.length; i++) {
            const e = payload[i];
            const res = await fetch(`${host}/products?pid=${e.pid}`);
            const prod = await res.json();
            temp.push({ srno: i + 1, title: prod[0].title, image: <CartRowImage src={prod[0].image} />, edit: <CartRowDeleteButton onClick={() => removeFromCart(e.pid)} />, quantity: e.quantity, price: `$${prod[0].price}` },);
            // setTotal(total + prod[0].price);
            temptotal += (prod[0].price * e.quantity);
        }
        setTotal(temptotal);
        setRows(temp);
    }

    async function removeFromCart(pid){
        console.log(pid);
        
        const res = await fetch(`${host}/cart`, {
            method: 'POST', 
            body: JSON.stringify({pid, type: 'DELETE'}),
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'text/plain'
            }
        });

        if(res.status === 200){
            fetchCartRows();
        }
    }

    async function emptyCart(){
        const res = await fetch(`${host}/cart`);
        const payload = await res.json();

        for (const e of payload) {
            
            await fetch(`${host}/cart`, {
                method: 'POST', 
                body: JSON.stringify({pid: e.pid, type: 'DELETE'}),
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'text/plain'
                }
            });
        }

        fetchCartRows();

    }

    async function init() {
        await fetchCartRows();
    }

    React.useEffect(() => {
        if (!once) {
            console.log('page loaded')
            init();
            once = true;
        }
    }, []);


    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column, i) => (
                                    <TableCell
                                        key={'sdfsdfs' + i}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, i) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={'dfdsfsdfrr' + i}>
                                            {columns.map((column, i) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={'fjsdfj' + i} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {(rows.length !== 0) && <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />}
            </Paper>
            <Box className='d-flex justify-content-around my-5'>
                <h4><span>Total: </span><span style={{ color: 'green' }}>${total}</span></h4>
                <BottomButtons emptyCart={emptyCart} />
            </Box>
        </>

    );
}

function CartRowImage(props) {
    return (
        <>
            <img style={{ height: '7em' }} src={props.src} />
        </>
    )
}

function CartRowDeleteButton(props){
    return(
    <>
        <Button variant='outlined' size='small' onClick={props.onClick} startIcon={<DeleteIcon/>} color='error'>delete</Button>
    </>
    );
}

function BottomButtons(props){
    return(
    <>
        <Button onClick={props.emptyCart} size='medium' variant='outlined' sx={{ bgcolor: 'rgb(50,50,50)', color: 'white', borderColor: 'white', '&:hover': { borderColor: 'rgb(50,50,50)', color: 'rgb(50, 50, 50)', bgcolor: 'white'  } }}>Empty Cart</Button>
        <Button size='medium' variant='contained'>Checkout</Button>
        <Link to='/'><Button size='medium' variant='contained'>Add More</Button></Link>
    </>
    )
}

export default Cart;