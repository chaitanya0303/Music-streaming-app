import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { FaHeart, FaMugHot, FaMusic, FaPause, FaPauseCircle, FaPlay, FaPlayCircle } from 'react-icons/fa';

function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios
        .get(`https://musicbackend-feog.onrender.com/playlist/${user.id}`)
        .then((response) => {
          const playlistData = response.data;
          setPlaylist(playlistData);
        })
        .catch((error) => {
          console.error('Error fetching playlist items: ', error);
        });
    } else {
      console.log('ERROR: User not found');
    }

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
    playlist.forEach((item) => {
      const audioElement = document.getElementById(`audio-${item._id}`);
      if (audioElement) {
        handlePlay(item._id, audioElement);
      }
    });

    // Cleanup event listeners
    return () => {
      playlist.forEach((item) => {
        const audioElement = document.getElementById(`audio-${item._id}`);
        if (audioElement) {
          audioElement.removeEventListener('play', () => handleAudioPlay(item._id, audioElement));
        }
      });
    };
  }, [playlist, currentlyPlaying]);

  const removeFromPlaylist = async (itemId) => {
    try {
      await axios.post(`https://musicbackend-feog.onrender.com/playlist/remove`, { itemId });
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const response = await axios.get(`http://localhost:7000/playlist/${user.id}`);
        setPlaylist(response.data);
      } else {
        console.log('ERROR: User not found');
      }
    } catch (error) {
      console.error('Error removing item from playlist: ', error);
    }
  };

  const playAllSongs = () => {
    const currentSongAudio = document.getElementById(`audio-${playlist[0]._id}`);

    if (currentSongAudio.paused) {
      // Start playing from the first song
      currentSongAudio.play();
  
      // Set up the event listener to play the next song when the current one ends
      currentSongAudio.addEventListener('ended', () => {
        const nextIndex = (playlist.indexOf(playlist[0]) + 1) % playlist.length;
        const nextSongAudio = document.getElementById(`audio-${playlist[nextIndex]._id}`);
        
        if (nextSongAudio) {
          // Play the next song
          nextSongAudio.play();
        }
      });
      setIsPlaying(true)
      
    } else {
      // Pause the currently playing audio
      currentSongAudio.pause();
      setIsPlaying(false)
    }
  };
  
  return (
    <div>
      <Sidebar />
      <div style={{
  marginLeft: "200px",
  backgroundImage: "url('https://media.istockphoto.com/id/1290631799/vector/musical-notation-cute-background.jpg?b=1&s=170667a&w=0&k=20&c=F9sEy-XpIWlgIQSa5tczIZZ8-sBxZ-u7cSvnPEOa2ac=')",
  backgroundSize: "cover",
  minHeight: "100vh",
  marginBottom: "0"
}}>
     
        <div className="container mx-auto p-8">
          <h2 className="text-3xl font-semibold mb-4 text-center">Playlist</h2>
          <Button
            style={{ backgroundColor: 'green', border: 'none', marginBottom: '10px' }}
            onClick={playAllSongs}
          >
         {isPlaying?<FaPauseCircle/>:<FaPlayCircle/>}
          </Button>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Actions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {playlist.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div style={{ display: 'flex' }}>
                      <img
                        src={item.image}
                        alt="Item Image"
                        className="rounded"
                        style={{ height: '50px', width: '50px' }}
                      />
                      <div style={{ paddingLeft: '20px' }}>
                        <strong> {item.title}</strong>
                        <p>
                          <td>{item.singer}</td>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{item.genre}</td>
                  <td>
                    <audio controls id={`audio-${item._id}`} style={{ width: '280px' }}>
                      <source src={`https://musicbackend-feog.onrender.com/${item.songUrl}`} />
                    </audio>
                  </td>
                  <td>
                    <Button
                      style={{ backgroundColor: 'red', border: 'none' }}
                      onClick={() => removeFromPlaylist(item.itemId)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
