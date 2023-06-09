import { Flex, Select, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { CardProduct } from '../components';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/product`)
      .then(
        (data) => data.json(),
        (err) => console.log(err)
      )
      .then(
        (parsedData) => {
          setProducts(parsedData);
          console.log(`setProducts with parsedData:`, parsedData);
        },
        (err) => console.log(err)
      );
  }, []);

  // Get available product types from the fetched data
  const availableTypes = [...new Set(products.map((product) => product.type))];
  const avaliableBrands = [
    ...new Set(products.map((product) => product.brand)),
  ];
  const avaliableModels = [
    ...new Set(products.map((product) => product.model)),
  ];

  const groupedProducts = products.reduce((acc, item) => {
    const {
      type,
      brand,
      model,
      img,
      ratings,
      title,
      description,
      features,
      specifications,
    } = item;
    const existingProduct = acc.find(
      (group) =>
        group.type === type && group.brand === brand && group.model === model
    );
    if (existingProduct) {
      existingProduct.users.push(item.user);
      existingProduct.ratings.push(...ratings);
    } else {
      acc.push({
        img,
        type,
        brand,
        model,
        title,
        description,
        features,
        specifications: [...specifications],
        ratings: [...ratings],
        users: [item.user],
      });
    }
    return acc;
  }, []);

  // Remove duplicates from groupedProducts array
  const uniqueProducts = groupedProducts.reduce((acc, product) => {
    const existingProductIndex = acc.findIndex(
      (p) =>
        p.type === product.type &&
        p.brand === product.brand &&
        p.model === product.model
    );
    if (existingProductIndex === -1) {
      acc.push(product);
    }
    return acc;
  }, []);
  // Filtered products based on selected product type and brand
  const filteredProducts = uniqueProducts.filter((product) => {
    if (selectedProduct && selectedBrand && selectedModel) {
      return (
        product.type === selectedProduct &&
        product.brand === selectedBrand &&
        product.model === selectedModel
      );
    } else if (selectedProduct && selectedBrand) {
      return (
        (product.type === selectedProduct ||
          product.brand === selectedProduct) &&
        (product.type === selectedBrand || product.brand === selectedBrand)
      );
    } else if (selectedProduct && selectedModel) {
      return (
        (product.type === selectedProduct ||
          product.brand === selectedProduct) &&
        product.model === selectedModel
      );
    } else if (selectedBrand && selectedModel) {
      return (
        (product.type === selectedBrand || product.brand === selectedBrand) &&
        product.model === selectedModel
      );
    } else if (selectedProduct) {
      return (
        product.type === selectedProduct ||
        product.brand === selectedProduct ||
        product.model === selectedProduct
      );
    } else if (selectedBrand) {
      return (
        product.type === selectedBrand ||
        product.brand === selectedBrand ||
        product.model === selectedBrand
      );
    } else if (selectedModel) {
      return (
        product.type === selectedModel ||
        product.brand === selectedModel ||
        product.model === selectedModel
      );
    } else {
      return true;
    }
  });
  console.log(filteredProducts);
  console.log(avaliableBrands);
  return (
    <div>
      <Text
        as={'h1'}
        lineHeight={1.1}
        bgGradient='linear(to-r, red.400,pink.400)'
        bgClip='text'
        className='mt-[8px] font-bold md:text-[40px] text-[28px] text-white text-center'
      >
        View All Products
      </Text>
      <h2 className='mt-[8px] font-normal sm:text-[28px] text-[18px] text-center text-secondary-white  mb-6'>
        Check out all the top-rated gadgets by programmers, gamers and traders
        worldwide.
      </h2>
      <Flex direction='row' align='center' px='5%' color={'gray.300'}>
        {/* Filter */}
        <Select
          placeholder='Filter by Products'
          border='1px'
          borderColor='gray.600'
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          mx='0.5rem'
        >
          {/* Dynamically generated options */}
          {availableTypes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <Select
          placeholder='Filter by Brand'
          border='1px'
          borderColor='gray.600'
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          mx='0.5rem'
        >
          {/* Dynamically generated options */}
          {avaliableBrands.map((brand, i) => (
            <option key={i} value={brand}>
              {brand}
            </option>
          ))}
        </Select>
        {/* <Select
          placeholder='Filter by Model'
          border='1px' 
          borderColor='gray.600'
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          mx="0.5rem"
        >
          {avaliableModels.map((model, i) => (
            <option key={i} value={model}>
              {model}
            </option>
          ))}
        </Select> */}
        {/* Sort */}
        <Select
          placeholder='Sort by'
          border='1px'
          borderColor='gray.600'
          mx='0.5rem'
        >
          <option value='option1'>✨ Newest</option>
          <option value='option2'>🏷️ Price</option>
          <option value='option3'>⭐ Highest rating</option>
          <option value='option4'>❤️ Most likes</option>
          <option value='option5'>🔥 Trending</option>
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
        {filteredProducts.map((group) => (
          <div key={`${group.type}-${group.brand}-${group.model}`}>
            <CardProduct
              img={group.img}
              type={group.type}
              brand={group.brand}
              model={group.model}
              title={group.title}
              description={group.description}
              features={group.features}
              specifications={group.specifications}
              ratings={group.ratings}
              slug={`/products/${group.type}`}
              users={group.users}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
