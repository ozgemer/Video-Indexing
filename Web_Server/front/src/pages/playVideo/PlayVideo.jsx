import React, { useState, useRef } from 'react';
import MyVideoPlayer from '../../components/videoplayer/MyVideoPlayer';
import { FormContainer } from '../../utils/Form.styled';
import SearchResultsList from '../search/SearchResultsList';
import Subjects from './components/Subjects';
import ImageFromVideo from '../../components/imagefromvideo/ImageFromVideo';
function PlayVideo() {
  const [topicVideos, setTopicVideos] = useState([]);
  const [topic, setTopic] = useState();

  const setTopicFocus = (t) => {
    setTopic(t);
    console.log(t);
  };
  const setTopicVideosHandler = (videos) => {
    setTopicVideos(videos);
    console.log('updated videos:', videos);
  };
  const getVideoID = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };
  return (
    <FormContainer>
      <MyVideoPlayer
        setTopicVideos={setTopicVideosHandler}
        setTopicFocus={setTopic}
      />
      {topic && <Subjects currentTopic={topic} />}
      {topicVideos && (
        <SearchResultsList
          results={topicVideos}
          ignore={getVideoID()}
          focusTopic={topic}
        />
      )}
    </FormContainer>
  );
}

export default PlayVideo;
