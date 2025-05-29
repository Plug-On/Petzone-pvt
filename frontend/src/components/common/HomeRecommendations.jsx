import React, { useEffect, useState } from 'react';
import { apiUrl } from '../common/http';
import { Link } from 'react-router-dom';

const HomeRecommendations = () => {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch(`${apiUrl}/home/recommendations`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        const result = await res.json();
        console.log('API response:', result);
        setPopular(result.data);
      } catch (error) {
        console.error('Error fetching popular products:', error);
      }
    };

    fetchPopular();
  }, []);

  return (
    <section className='section-2 py-5'>
      <div className='container'>
        <h2>🔥 Popular Products</h2>
        <div className='row mt-4'>
          {popular && popular.map(product => (
            <div className='col-md-3 col-6' key={`popular-${product.id}`}>
              <div className='product card border-0'>
                <div className='card-img'>
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image_url} alt={product.title} className='w-100' />
                  </Link>
                </div>
                <div className='card-body pt-3'>
                  <Link to={`/product/${product.id}`}>{product.title}</Link>
                  <div className='price'>
                    Rs.{product.price} &nbsp;
                    {product.compare_price && (
                      <span className='text-decoration-line-through'>
                        Rs.{product.compare_price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeRecommendations;
