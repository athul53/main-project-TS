import React from 'react';
import { useLocation } from 'react-router-dom';
import ViewTravelStory from '../Home/ViewTravelStory';// Import your ViewTravelStory component

const StoryView = () => {
  const location = useLocation();
  const { story } = location.state; // Get the story data from the location state

  return (
    <div>
      <h1>Story Details</h1>
      <ViewTravelStory storyInfo={story} onClose={() => {}} showEditDelete={false} />
    </div>
  );
};

export default StoryView;