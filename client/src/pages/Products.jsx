import { Flex, Select, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { CardProduct } from '../components';

const Products = () => {
  const [products, setProducts] = useState([]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const response = await fetch(
  //     `http://localhost:8080/api/product/${products.Type}/reviews`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         user: username,
  //         review: review,
  //       }),
  //     }
  //   );

  //   const data = await response.json();
  //   console.log(data);
  //   // update state with the new product data returned from the server
  //   setProducts(data);
  //   // clear the form inputs
  //   setUsername('');
  //   setReview('');
  // };

  useEffect(() => {
    fetch('http://localhost:8080/api/product')
      .then(
        (data) => data.json(),
        (err) => console.log(err)
      )
      .then(
        (parsedData) => {
          console.log(parsedData);
          setProducts(parsedData);
        },
        (err) => console.log(err)
      );
  }, []);

  return (
    <div>
      <h1>Lorem ipsum dolor sit amet consectetur.</h1>
      <h2>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus laborum
        dolores necessitatibus earum dolore velit, quo distinctio unde facere
        aperiam accusantium aliquam ea tempore repudiandae officia, animi culpa
        temporibus illo obcaecati hic ducimus. Cumque, repudiandae.
      </h2>
      <Flex direction='row' justify='space-between' align='center' px='5%'>
        {/* Filter */}
        <Text>Filter by</Text>
        <Select placeholder='Products'>
          <option value='option1'>Desk</option>
          <option value='option2'>Monitor</option>
          <option value='option3'>Chair</option>
          <option value='option4'>Keyboard</option>
          <option value='option5'>Mouse</option>
          <option value='option6'>Mousepad</option>
          <option value='option7'>Speaker</option>
          <option value='option8'>Headphone</option>
          <option value='option9'>PC</option>
          <option value='option10'>Laptop</option>
          <option value='option11'>Light</option>
          <option value='option12'>Riser</option>
          <option value='option13'>Accessories</option>
        </Select>
        <Select placeholder='Brands'>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>

        {/* Sort */}
        <Text>Sort by</Text>
        <Select placeholder='Sort by'>
          <option value='option1'>✨ Newest</option>
          <option value='option1'>🏷️ Price</option>
          <option value='option2'>⭐ Highest rating</option>
          <option value='option3'>❤️ Most likes</option>
          <option value='option4'>🔥 Trending</option>
        </Select>
      </Flex>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        {/* {productsData.map((item) => (
          <div key={item.productId}>
            <CardProduct
              img={item.img}
              type={item.type}
              brand={item.brand}
              model={item.model}
              slug={`/products/${item.productId}`}
            />
          </div>
        ))} */}
        {products.map((item) => (
          <div key={item.type}>
            <CardProduct
              img={item.img}
              type={item.type}
              brand={item.brand}
              model={item.model}
              ratings={item.ratings}
              reviews={item.reviews}
              slug={`/products/${item.type}`}
            />
          </div>
        ))}
      </div>
      <div>
        {products.map((product) => (
          <div key={product._id}>
            {/* <button onClick={() => setShowReviews(!showReviews)}>
              {showReviews ? 'Hide Reviews' : 'Show Reviews'}
            </button>
            {showReviews && (
              <ul>
                {product.reviews.map((review) => (
                  <li key={review._id}>
                    {review.user}: {review.review}
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleSubmit}>
              <label htmlFor='username'>Username:</label>
              <input
                type='text'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <label htmlFor='review'>Review:</label>
              <textarea
                id='review'
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
              <br />
              <button type='submit'>Add Review</button>
            </form> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
