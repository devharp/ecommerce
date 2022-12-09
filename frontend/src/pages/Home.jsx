import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

function Home() {
    let once = false;
    const [searchtext, setSearchText] = useState('');
    const [products, setProducts] = useState([]);

    const [cartitems, setCartItems] = useState([]);

    async function handleCartItems(items){
        console.log(items);
        setCartItems(items);
    }
    
    useEffect(() => {
        if (!once) {
            fetchProducts(null);
            once = true;
        }

    }, []);
    async function fetchProducts(query) {
        let link = 'http://localhost:3000/products';
        if(query !== null){
            link += `?search=${query}`
        }
        const res = await fetch(link);
        const payload = await res.json();
        // console.log('recv: payload: ', payload);
        setProducts(payload);
    }
    async function userSearchQuery(event) {
        const query = event.target.value;
        if (query.length === 0) {
            fetchProducts(null);
            return;
        }
        fetchProducts(query)
    }

    function onAddCartClicked(pid){
        let found = false;
        for (const e of cartitems) {
            if(e === pid){
                found = true;
                break;
            }
        }
        if(!found){
            handleCartItems([...cartitems, pid]);
        }
    }

    function removeFromCart(pid){
        let temp = [];
        for (const e of cartitems) {
            if(e.pid !== pid){
                temp.push(e);
            }
        }
        handleCartItems(temp);
    }

    return (
        <div>
            <NavBar cartitems={String(cartitems.length)} searchQuery={userSearchQuery} ></NavBar>
            <h1 className='d-flex justify-content-center' style={{ marginTop: '3em' }}>Products</h1>
            <div className="d-flex px-4 justify-content-around flex-wrap">
                {/* <ProductCard category='mens shopping' title='Product Name' price='$349.99' ratings={{ rate: 3.9, count: 120 }} /> */}
                {
                    products.map((e, i) => {
                        let bought = false;
                        let quantity = 0;
                        for (const f of cartitems) {
                            if(f.pid === e.pid){ bought = true; quantity = f.quantity}
                        }

                        function onAddItem(){
                            let temp = []
                            for (const f of cartitems) {
                                if(f.pid === e.pid){
                                    temp.push({ pid: f.pid, quantity: f.quantity+1 })
                                }
                                else{
                                    temp.push(f);
                                }
                            }
                            handleCartItems(temp);
                        }

                        function onRemoveItem(){
                            let temp = []
                            for (const f of cartitems) {
                                if(f.pid === e.pid){
                                    temp.push({ pid: f.pid, quantity: f.quantity-1 })
                                }
                                else{
                                    temp.push(f);
                                }
                            }
                            handleCartItems(temp);
                        }

                        return (

                            <ProductCard onAddItem={onAddItem} onRemoveItem={onRemoveItem} quantity={quantity} bought={bought} removeFromCart={() => {removeFromCart(e.pid)}} onAddCartClicked={() => {onAddCartClicked({pid: e.pid, quantity: 1})}} key={'sdfdsf' + i} image={e.image} category={e.category} title={e.title} price={'$' + e.price} ratings={e.rating} />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Home;