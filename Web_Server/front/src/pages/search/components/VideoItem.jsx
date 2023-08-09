import React from 'react';
import {
  ItemChapters,
  ItemContainer,
  ItemTitle,
  VideoDescription,
  Section,
  Chapter,
  ImageContainer,
} from './VideoItem.styled';
import PlayButton from '../../../assets/icons/video.png';
import ImageFromVideo from '../../../components/imagefromvideo/ImageFromVideo';

function VideoItem({ video, focusTopic }) {
  function hmsToSecondsOnly(str) {
    let p = str.split(':'),
      s = 0,
      m = 1;
    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }
    return s;
  }
  function getDuration(indexing) {
    let total = 0;
    for (const key of Object.keys(indexing)) {
      const end = hmsToSecondsOnly(key.split('-')[1]);
      if (end > total) total = end;
    }
    return new Date(total * 1000).toISOString().slice(11, 19);
  }
  function getTopicTime(indexing) {
    for (const key of Object.keys(indexing)) {
      if (indexing[key] === focusTopic) {
        return hmsToSecondsOnly(key.split('-')[0]);
      }
    }
  }
  return (
    <ItemContainer
      onClick={() => {
        if (focusTopic) {
          let timeInSec = getTopicTime(video.indexing);
          // console.log(timeInSec);
          // console.log(video);
          const url =
            window.location.origin +
            `/playVideo/${video.id}?seekTo=${timeInSec}`;
          window.location.href = url;
        } else {
          window.location.replace(`playVideo/${video.id}`);
        }
      }}
    >
      <ImageContainer>
        {/* <VideoImage src={video.image} height={75} className='vid-img'>
        </VideoImage> */}
        <ImageFromVideo videoLink={video.url} />

        <div className='middle'>
          <img src={PlayButton} id='play' alt='play-btn' />
        </div>
      </ImageContainer>
      <VideoDescription>
        <ItemTitle>{video.name}</ItemTitle>
        <Section>duration: {getDuration(video.indexing)}</Section>
        <ItemChapters>
          chapters:
          <br />
          {video.indexing &&
            video.tags.map(
              (c, i) =>
                c !== undefined &&
                c !== null &&
                c !== 'N/A' &&
                c !== 'unknown' &&
                c !== '' && (
                  <Chapter
                    className={`${focusTopic === c ? 'active' : ''}`}
                    key={i}
                  >
                    {c}
                  </Chapter>
                )
            )}
        </ItemChapters>
      </VideoDescription>
    </ItemContainer>
  );
}

export default VideoItem;
