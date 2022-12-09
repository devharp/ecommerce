import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

function Home() {
    let once = false;
    const [searchtext, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    async function fetchProducts(query) {
        let link = 'http://localhost:3000/products';
        if(query.length !== null){
            link += `?search=${query}`
        }
        const res = await fetch(link)
        const payload = await res.json();
        setProducts(payload);
    }
    useEffect(() => {
        if (!once) {
            fetchProducts();
            once = true;
        }

    }, []);

    async function userSearchQuery(event) {
        const query = event.target.value;
        if (query.length === 0) {
            fetchProducts(null);
            return;
        }
        fetchProducts(query)
    }

    return (
        <div>
            <NavBar searchQuery={userSearchQuery} ></NavBar>
            <h1 className='d-flex justify-content-center' style={{ marginTop: '3em' }}>Products</h1>
            <div className="d-flex px-4 justify-content-around flex-wrap">
                {/* <ProductCard category='mens shopping' title='Product Name' price='$349.99' ratings={{ rate: 3.9, count: 120 }} /> */}
                {
                    products.map((e, i) => {
                        return (

                            <ProductCard key={'sdfdsf' + i} image={e.image} category={e.category} title={e.title} price={'$' + e.price} ratings={e.rating} />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Home;