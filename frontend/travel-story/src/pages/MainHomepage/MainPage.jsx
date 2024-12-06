import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';
import './main.css';
import axiosInstance from '../../utils/axiosInstance'; 
import Modal from 'react-modal';
import ViewTravelStoryReadOnly from '../MainHomepage/ViewTravelStoryReadOnly.jsx'; // Adjust the path as necessary
import ProfileInfo from '../../components/Cards/Profileinfo.jsx'; // Import ProfileInfo
import TravelStoryCardReadOnly from './TravelStoryReadOnly.jsx';

function App() {
  const countries = [
    { image: 'src/assets/country-1.jpg', name: 'Santorini, Greece' },
    { image: 'src/assets/country-2.jpg', name: 'Vernazza, Italy' },
    { image: 'src/assets/country-3.jpg', name: 'San Francisco' },
    { image: 'src/assets/country-4.jpg', name: 'Navagio, Greece' },
    { image: 'src/assets/country-5.jpg', name: 'Ao Nang, Thailand' },
    { image: 'src/assets/country-6.jpg', name: 'Phi Phi Island, Thailand' },
  ];

  const [stories, setStories] = useState([]); // State to hold stories
  const [selectedStory, setSelectedStory] = useState(null); // State to hold the selected story for viewing
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(3); // State to manage the number of visible stories
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // State to hold user info

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); // Set user info
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getUserInfo(); // Fetch user info on component mount
    const fetchStories = async () => {
      try {
        const response = await axiosInstance.get("/get-all-travel-stories"); // Fetch stories from the new endpoint
        if (response.data && response.data.stories) {
          setStories(response.data.stories); // Set the fetched stories
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories(); // Call the fetch function
  }, []);

  const handleViewStory = (story) => {
    setSelectedStory(story); // Set the selected story to view
    setIsViewModalOpen(true); // Open the modal
  };

  const handleSeeMore = () => {
    setVisibleStoriesCount((prevCount) => prevCount + 3); // Increase the count of visible stories
  };

  return (
    <div>
      <nav className="main-nav">
        <div className="nav__logo"><a href="#">Travel Story</a></div>
        <ul className="nav__links">
          <li className="link">Home</li>
          <li className="link">View Story</li>
        </ul>
        {userInfo && ( // Render ProfileInfo if userInfo is available
          <ProfileInfo userInfo={userInfo} onLogout={() => {
            localStorage.clear();
            window.location.href = "/login"; // Redirect to login
          }} />
        )}
      </nav>

      <header>
        <div className="section__container">
          <div className="header__content">
            <h1>Travel</h1>
            <p>
              Embark on a journey with TravelStory to explore breathtaking destinations. From serene beaches to cultural wonders, our travel guides and tips help you plan unforgettable adventures. Let every destination inspire your story.
            </p>
            <button>
              <Link to="/login">Open</Link>
            </button>
          </div>
        </div>
      </header>

      {/* journey section */}
      <section className="journey__container">
        <div className="section__container">
          <h2 className="section__title">Start Your Journey</h2>
          <p className="section__subtitle">The most searched countries</p>
          <div className="journey__grid">
            {countries.map((country, index) => (
              <div className="country__card" key={index}>
                <img src={country.image} alt={country.name} />
                <div className="country__name">
                  <i className="ri-map-pin-2-fill"></i>
                  <span>{country.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* story section */}
      <section className="travel-story-section">
        <div className="section__container">
          <h2 className="section__title">Travel Stories</h2>
          <div className="banner__grid">
            {stories.slice(0, visibleStoriesCount).map((story, index) => (
              <TravelStoryCardReadOnly
                key={index}
                imgUrl={story.imageUrl}
                title={story.title}
                date={story.visitedDate}
                story={story.story}
                visitedLocation={story.visitedLocation}
                onClick={() => handleViewStory(story)} // Handle story click
                onFavouiteClick={() => console.log(`Favouriting story: ${story.title}`)} // Placeholder for favourite click
              />
            ))}
          </div>
          {visibleStoriesCount < stories.length && ( // Show "See More" button if there are more stories
            <button className="see-more-button" onClick={handleSeeMore}>
              See More
            </button>
          )}
        </div>
      </section>

      {/* Modal for viewing story */}
      {isViewModalOpen && (
        <Modal 
          isOpen={isViewModalOpen}
          onRequestClose={() => {
            setIsViewModalOpen(false);
            setSelectedStory(null);
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
              zIndex: 999,
            },
          }}
          appElement={document.getElementById("root")}
          className="model-box"
        >
          <ViewTravelStoryReadOnly 
            storyInfo={selectedStory} 
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedStory(null);
            }} 
          />
        </Modal>
      )}

      <section className="display__container">
        <div className="section__container">
          <h2 className="section__title">Why Choose Us</h2>
          <p className="section__subtitle">
            The gladdest moment in human life, is a departure into unknown lands.
          </p>
          <div className="display__grid">
            <div className="display__card grid-1">
              <img src="src/assets/grid-1.jpg" alt="grid" />
            </div>
            <div className="display__card">
              <i className="ri-earth-line"></i>
              <h4>Passionate Travel</h4>
              <p>Fuel your passion for adventure and discover new horizons</p>
            </div>
            <div className="display__card">
              <img src="src/assets/grid-2.jpg" alt="grid" />
            </div>
            <div className="display__card">
              <img src="src/assets/grid-3.jpg" alt="grid" />
            </div>
            <div className="display__card">
              <i className="ri-road-map-line"></i>
              <h4>Beautiful Places</h4>
              <p>Uncover the world's most breathtakingly beautiful places</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="section__container">
          <h4>Travel Story</h4>
          <div className="social__icons">
            <span><i className="ri-facebook-fill"></i></span>
            <span><i className="ri-twitter-fill"></i></span>
            <span><i className="ri-instagram-line"></i></span>
            <span><i className="ri-linkedin-fill"></i></span>
          </div>
          <p>
            Travel Story makes one modest. You see what a tiny place you occupy in the world.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
