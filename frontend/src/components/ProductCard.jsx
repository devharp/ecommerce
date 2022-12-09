import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

function ProductCard(props) {
    return (
        <div className="d-flex flex-column align-items-center m-4 p-5" style={{ boxShadow: '0 0 10px 5px rgb(0,0,0,0.1)', width: 'max-content' }}>
            <div className='d-flex' style={{ height: '13em', width: '13em', backgroundColor: 'red' }}>
                
                <img style={{ width: '100%' }} src={props.image} />
            </div>
            <div className="d-flex flex-column align-items-center mt-2">
                <small className="mb-2" style={{ fontWeight: '00', color: 'rgb(150, 150, 150)' }}>{props.category}</small>
                <h5 className="mb-2" style={{ width: '10em', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{props.title}</h5>
                <div className="mb-2" style={{ fontWeight: '700' }}>{props.price}</div>
                <div>
                    {(parseInt(props.ratings.rate) >= 1) && <StarIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}
                    {/* {((props.ratings.rate) > 0.5) && <StarHalfIcon sx={{ color: 'gold', fontSize: '1.25em' }} />} */}
                    {(props.ratings.rate < 0.5) && <StarBorderIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}

                    {(parseInt(props.ratings.rate) >= 2) && <StarIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}
                    {/* {(props.ratings.rate > 1.5) && <StarHalfIcon sx={{ color: 'gold', fontSize: '1.25em' }} />} */}
                    {(props.ratings.rate < 1.5) && <StarBorderIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}

                    {(parseInt(props.ratings.rate) >= 3) && <StarIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}
                    {/* {(props.ratings.rate > 2.5) && <StarHalfIcon sx={{ color: 'gold', fontSize: '1.25em' }} />} */}
                    {(props.ratings.rate < 2.5) && <StarBorderIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}

                    {(parseInt(props.ratings.rate) >= 4) && <StarIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}
                    {/* {(props.ratings.rate > 3.5) && <StarHalfIcon sx={{ color: 'gold', fontSize: '1.25em' }} />} */}
                    {(props.ratings.rate < 3.5) && <StarBorderIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}

                    {(parseInt(props.ratings.rate) >= 5) && <StarIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}
                    {/* {(props.ratings.rate > 4.5) && <StarHalfIcon sx={{ color: 'gold', fontSize: '1.25em' }} />} */}
                    {(props.ratings.rate < 4.5) && <StarBorderIcon sx={{ color: 'gold', fontSize: '1.25em' }} />}


                </div>
            </div>
        </div>
    )
}

export default ProductCard;