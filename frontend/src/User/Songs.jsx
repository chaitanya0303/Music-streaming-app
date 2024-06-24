import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../User/Sidebar';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';

function Songs() {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      console.log('ERROR: User not found');
      return;
    }

    // Fetch all items
    axios
      .get(`https://musicbackend-feog.onrender.com/mysongs`)
      .then((response) => {
        const taskData = response.data;
        setItems(taskData);
      })
      .catch((error) => {
        console.error('Error fetching tasks: ', error);
      });

    // Fetch wishlist items
    axios.get(`https://musicbackend-feog.onrender.com/wishlist/${user.id}`)
    .then((response) => {
      const wishlistData = response.data;
      setWishlist(wishlistData);
    });

    axios.get(`https://musicbackend-feog.onrender.com/playlist/${user.id}`)
    .then((response) => {
        const playlistData = response.data;
        setPlaylist(playlistData);
      });

    // Function to handle audio play
    const handleAudioPlay = (itemId, audioElement) => {
      if (currentlyPlaying && currentlyPlaying !== audioElement) {
        currentlyPlaying.pause(); // Pause the currently playing audio
      }
      setCurrentlyPlaying(audioElement); // Update the currently playing audio
     
    };

    // Event listener to handle audio play
    const handlePlay = (itemId, audioElement) => {
      audioElement.addEventListener('play', () => {
        handleAudioPlay(itemId, audioElement);
      });
    };

    // Add event listeners for each audio element
    items.forEach((item) => {
      const audioElement = document.getElementById(`audio-${item._id}`);
      if (audioElement) {
        handlePlay(item._id, audioElement);
      }
    });

    // Cleanup event listeners
    return () => {
      items.forEach((item) => {
        const audioElement = document.getElementById(`audio-${item._id}`);
        if (audioElement) {
          audioElement.removeEventListener('play', () => handleAudioPlay(item._id, audioElement));
        }
      });
    };
  }, [items, currentlyPlaying, searchTerm]);

  const addToWishlist = async (itemId) => {
    try {
      // Find the selected item by itemId
      const selectedItem = items.find((item) => item._id === itemId);

      if (!selectedItem) {
        throw new Error('Selected item not found');
      }

      // Destructure the needed properties
      const { title, image,genre,songUrl,singer, _id: itemId2 } = selectedItem;

      const userId = JSON.parse(localStorage.getItem('user')).id;
      const userName = JSON.parse(localStorage.getItem('user')).name;

      // Add item to the wishlist
      await axios.post(`https://musicbackend-feog.onrender.com/wishlist/add`, { itemId: itemId2, title, image, userId, userName,songUrl,singer,genre });

      // Refresh the wishlist items
      const response = await axios.get(`http://localhost:7000/wishlist/${userId}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error adding item to wishlist: ', error);
    }
  };

  const removeFromWishlist = async (itemId) => {   
    try {
      // Remove item from the wishlist
      await axios.post(`https://musicbackend-feog.onrender.com/wishlist/remove`, { itemId });

      // Refresh the wishlist items
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const response = await axios.get(`https://musicbackend-feog.onrender.com/wishlist/${user.id}`);
        setWishlist(response.data);
      } else {
        console.log('ERROR: User not found');
      }
    } catch (error) {
      console.error('Error removing item from wishlist: ', error);
    }
  };

  const isItemInWishlist = (itemId) => {
    return wishlist.some((item) => item.itemId === itemId);
  };

  const addToPlaylist = async (itemId) => {
    try {
      // Find the selected item by itemId
      const selectedItem = items.find((item) => item._id === itemId);

      if (!selectedItem) {
        throw new Error('Selected item not found');
      }

      // Destructure the needed properties
      const { title, image,genre,songUrl,singer, _id: itemId2 } = selectedItem;

      const userId = JSON.parse(localStorage.getItem('user')).id;
      const userName = JSON.parse(localStorage.getItem('user')).name;

      // Add item to the wishlist
      await axios.post(`https://musicbackend-feog.onrender.com/playlist/add`, { itemId: itemId2, title, image, userId, userName,songUrl,singer,genre });

      // Refresh the wishlist items
      const response = await axios.get(`https://musicbackend-feog.onrender.com/playlist/${userId}`);
      setPlaylist(response.data);
      alert("Song Added To Playlist")
    } catch (error) {
      console.error('Error adding item to playlist: ', error);
    }
  };

  const removeFromPlaylist = async (itemId) => {   
    try {
      // Remove item from the wishlist
      await axios.post(`https://musicbackend-feog.onrender.com/playlist/remove`, { itemId });

      // Refresh the wishlist items
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const response = await axios.get(`https://musicbackend-feog.onrender.com/playlist/${user.id}`);
        setPlaylist(response.data);
      alert("Song Removed From Playlist")

      } else {
        console.log('ERROR: User not found');
      }
    } catch (error) {
      console.error('Error removing item from wishlist: ', error);
    }
  };

  const isItemInPlaylist = (itemId) => {
    return playlist.some((item) => item.itemId === itemId);
  };

  const filteredItems = items.filter((item) => {
    const lowerCaseQuery = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerCaseQuery) ||
      item.singer.toLowerCase().includes(lowerCaseQuery) ||
      item.genre.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <div>
        <Sidebar/>
        
        <div style={{ marginLeft: "200px", backgroundImage: "url('https://media.istockphoto.com/id/1290631799/vector/musical-notation-cute-background.jpg?b=1&s=170667a&w=0&k=20&c=F9sEy-XpIWlgIQSa5tczIZZ8-sBxZ-u7cSvnPEOa2ac=')",backgroundSize: "cover"}}>


     <div className="container mx-auto p-8 "  >
  {/* Your content here */}


  <h2 className="text-3xl font-bold mb-3 text-center text-teal-800">Songs List</h2>


        <InputGroup className="mb-3">
          <InputGroup.Text id="search-icon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search by singer, genre, or song name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ outline: 'none', boxShadow: 'none', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
            className="search-input"
          />
        </InputGroup>
        <br />
        <div style={{ width: '960px', display: 'grid', gridTemplateColumns: 'auto auto auto auto', gap: '30px' }}>
          {filteredItems.map((item, index) => (
            <div key={item._id} className="bg-white p-4 rounded shadow">
              <img
                src={item.image}
                alt="Item Image"
                className="rounded-t-lg"
                style={{ height: '200px', width: '250px' }}
              />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p className="text-xl font-bold mb-2">{item.title}</p>
                  {isItemInWishlist(item._id) ? (
                    <Button
                      style={{ backgroundColor: 'white', border: 'none' }}
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      <FaHeart color="red" style={{ fontSize: '20px' }} />
                    </Button>
                  ) : (
                    <Button style={{ backgroundColor: 'white', border: 'none' }} onClick={() => addToWishlist(item._id)}>
                      <FaRegHeart color="black" style={{ fontSize: '20px' }} />
                    </Button>
                  )}
                </div>
                <p className="text-gray-700 mb-2">Genre: {item.genre}</p>
                <p className="text-teal-500 font-bold">Singer: {item.singer}</p>
                <audio controls id={`audio-${item._id}`} style={{ width: '250px' }}>
                  <source src={`http://localhost:7000/${item.songUrl}`} />
                </audio>
              </div>
              <div>
              {isItemInPlaylist(item._id) ? (
                   <div style={{display:"flex",justifyContent:"center",}}>

                    <Button
                      style={{ backgroundColor: 'red', border: 'none',marginTop:"10px", }}
                      onClick={() => removeFromPlaylist(item._id)}
                    >
                     Remove From Playlist
                    </Button>
                    </div>

                  ) : (
                    
                   <div style={{display:"flex",justifyContent:"center"}}>
                     <Button style={{ backgroundColor: 'red', border: 'none',marginTop:"10px"}} onClick={() => addToPlaylist(item._id)}>
                      
                      AddtoPlayList
                    </Button>
                    </div>
                  )}
            </div>
            </div>
          ))}
        </div>
      </div>
     </div>
    </div>
  );
}

export default Songs;





