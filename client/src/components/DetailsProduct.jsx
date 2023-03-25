import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
} from '@chakra-ui/react';
// import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';

// "Simple" from https://chakra-templates.dev/page-sections/productDetails
import React, { useState } from 'react';
//import { useState }
export default function DetailsProduct({
  img,
  brand,
  model,
  ratings,
  reviews,
}) {
  const textColor = useColorModeValue('gray.500', 'gray.400');
  const boldColor = useColorModeValue('gray.200', 'gray.600');
  const buttonBg = useColorModeValue('gray.900', 'gray.50');
  const buttonColor = useColorModeValue('white', 'gray.900');
  const yellowText = useColorModeValue('yellow.500', 'yellow.300');

  const [showReviews, setShowReviews] = useState(false);
  return (
    <Container maxW={'7xl'}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded={'md'}
            alt={'product image'}
            src={img}
            fit={'cover'}
            align={'center'}
            w={'100%'}
            h={{ base: '100%', sm: '400px', lg: '500px' }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}
            >
              {model}
            </Heading>
            <Text color={textColor} fontWeight={300} fontSize={'2xl'}>
              {brand}
            </Text>
            <Text color={textColor} fontWeight={300} fontSize={'2xl'}>
              {reviews.length} review{reviews.length > 1 && 's'}
              <Button onClick={() => setShowReviews(!showReviews)}>
                {showReviews ? 'Hide reviews' : 'Show reviews'}
              </Button>
              {showReviews && (
                <Text color={textColor} fontWeight={300} fontSize={'2xl'}>
                  {reviews.map((review) => (
                    <div key={review._id}>
                      <b>{review.user}:</b> {review.review}
                    </div>
                  ))}
                </Text>
              )}
              <Button>Add Review</Button>
              <Button>Update Review</Button>
              {/* <div>
                <label htmlFor='rating'>Rating</label>
                <select id='rating'>
                  <option value=''>Select</option>
                  <option value='1'>1- Poor</option>
                  <option value='2'>2- Fair</option>
                  <option value='3'>3- Good</option>
                  <option value='4'>4- Very good</option>
                  <option value='5'>5- Excelent</option>
                </select>
              </div>
              <div>
                <label htmlFor='comment'>Comment</label>
                <textarea id='comment'></textarea>
              </div> */}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={<StackDivider borderColor={boldColor} />}
          >
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text color={textColor} fontSize={'2xl'} fontWeight={'300'}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore
              </Text>
              <Text fontSize={'lg'}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                aliquid amet at delectus doloribus dolorum expedita hic, ipsum
                maxime modi nam officiis porro, quae, quisquam quos
                reprehenderit velit? Natus, totam.
              </Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={yellowText}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Features
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>Chronograph</ListItem>
                  <ListItem>Master Chronometer Certified</ListItem>{' '}
                  <ListItem>Tachymeter</ListItem>
                </List>
                <List spacing={2}>
                  <ListItem>Anti‑magnetic</ListItem>
                  <ListItem>Chronometer</ListItem>
                  <ListItem>Small seconds</ListItem>
                </List>
              </SimpleGrid>
            </Box>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={yellowText}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Product Details
              </Text>

              <List spacing={2}>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Between lugs:
                  </Text>{' '}
                  20 mm
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Bracelet:
                  </Text>{' '}
                  leather strap
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Case:
                  </Text>{' '}
                  Steel
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Case diameter:
                  </Text>{' '}
                  42 mm
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Dial color:
                  </Text>{' '}
                  Black
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Crystal:
                  </Text>{' '}
                  Domed, scratch‑resistant sapphire crystal with anti‑reflective
                  treatment inside
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Water resistance:
                  </Text>{' '}
                  5 bar (50 metres / 167 feet){' '}
                </ListItem>
              </List>
            </Box>
          </Stack>

          <Button
            rounded={'none'}
            w={'full'}
            mt={8}
            size={'lg'}
            py={'7'}
            bg={buttonBg}
            color={buttonColor}
            textTransform={'uppercase'}
            _hover={{
              transform: 'translateY(2px)',
              boxShadow: 'lg',
            }}
          >
            Purchase
          </Button>

          <Stack direction='row' alignItems='center' justifyContent={'center'}>
            <MdLocalShipping />
            <Text>You will be redirected to an external website</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
