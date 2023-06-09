import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { exampleArray } from '../../constants/index';

const MernStarter = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/test`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse()); // show latest post on top
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleDelete = async (e, prop) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/test/${prop}?_method=DELETE`, {
          method: 'POST',
      });
      await response.json();
      window.location.reload(); // Refresh the page
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div>
        <h1>MERN Starter Code</h1>
        <p>This is a starter code for MERN projects.</p>
      </div>
      <div>
        <h3>CREATE</h3>
        <Link to='/create'>
          <Button colorScheme='green' variant='solid' leftIcon={<AddIcon />}>
            Create a Post
          </Button>
        </Link>
      </div>
      <div>
        <h3>DATA FROM MONGODB</h3>
        {loading ? ( 'Loading...' ) : (
          <ul>
            {allPosts?.map((e, i) => (
              <li key={i}>
                {e.name}
                <Link 
                  to={`/update/${e._id}`} 
                  state={{ 
                    id: e._id,
                    name: e.name,
                    createdAt: e.createdAt,
                    updatedAt: e.updatedAt,
                  }}
                >
                  <Button colorScheme='yellow' variant='solid'>UPDATE</Button>
                </Link>
                <form onSubmit={(event) => handleDelete(event, e._id)}>
                  <Button colorScheme='red' variant='solid' type="submit">DELETE</Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3>DATA FROM STATIC CONSTANTS</h3>
        {exampleArray.map((e, i) => (
          <p key={i}>{e}</p>
        ))}
      </div>
    </section>
  )
}

export default MernStarter;