import React, { useState, useRef, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { makeStyles, withStyles } from '@mui/styles';
// import { makeStyles, withStyles } from "@mui/core/styles";

import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import VolumeUp from '@mui/icons-material/VolumeUp';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeMute from '@mui/icons-material/VolumeMute';
import FullScreen from '@mui/icons-material/Fullscreen';
import Popover from '@mui/material/Popover';
import screenful from 'screenfull';
import Controls from './components/Controls';
import {
  SearchVideoByID,
  SearchVideosByTag,
} from '../../services/SearchService';

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: '100%',
    minHeight: '400px',
    height: '40vh',
    position: 'relative',
    // "&:hover": {
    //   "& $controlsWrapper": {
    //     visibility: "visible",
    //   },
    // },
  },
  reactPlayer: {
    height: '100%',
  },
  controlsWrapper: {
    visibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topControls: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '16px',
  },
  middleControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomWrapper: {
    display: 'flex',
    flexDirection: 'column',

    // background: "rgba(0,0,0,0.6)",
    // height: 60,
    padding: '16px',
  },

  bottomControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // height:40,
  },

  button: {
    margin: '16px',
  },
  controlIcons: {
    color: '#777',

    fontSize: 50,
    transform: 'scale(0.9)',
    '&:hover': {
      color: '#fff',
      transform: 'scale(1)',
    },
  },

  bottomIcons: {
    color: '#999',
    '&:hover': {
      color: '#fff',
    },
  },

  volumeSlider: {
    width: 100,
  },
}));

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

//   console.log("Video id: "+ videoID);
let videoDataRes;
//   await SearchVideoByID(videoID).then(
//     (res) => videoDataRes = res
//     );
function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement='top' title={value}>
      {children}
    </Tooltip>
  );
}

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function MyVideoPlayer({ setTopicVideos, setTopicFocus }) {
  function hmsToSecondsOnly(str) {
    var p = str.split(':'),
      s = 0,
      m = 1;

    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }

    return s;
  }
  function ReformatIndexing(indexing) {
    const marks = [];
    let total = 0;
    for (const [key, myVal] of Object.entries(indexing)) {
      const end = hmsToSecondsOnly(key.split('-')[1]);
      if (end > total) {
        total = end;
      }
    }
    for (const [key, myVal] of Object.entries(indexing)) {
      const start = hmsToSecondsOnly(key.split('-')[0]);
      const value = (start / total) * 100;
      const myLabel = myVal;
      marks.push({ value, myLabel });
    }
    return marks;
  }
  const setCurrentTopicHandler = (topic) => {
    // console.log("Updating topic");
    setCurrentTopic(topic);
  };

  const classes = useStyles();
  const [showControls, setShowControls] = useState(false);
  const videoID = window.location.href
    .substring(window.location.href.lastIndexOf('/') + 1)
    .split('?')[0];
  const seekToSentence = window.location.href
    .substring(window.location.href.lastIndexOf('/') + 1)
    .split('?')[1];
  const [url, setUrl] = useState();
  const [currentTopic, setCurrentTopic] = useState();
  const [indexing, setIndexing] = useState();

  useEffect(() => {
    // code to run after render goes here
    SearchVideoByID(videoID).then((res) => {
      console.log(res);
      let testMarks = ReformatIndexing(res.indexing);
      const myURL = res.url.replace('https://', 'http://');
      // console.log(testMarks);
      setIndexing(testMarks);
      setUrl(myURL);
      console.log(myURL);
      // console.log(videoSeekTo);
    });
    // SearchVideosByTag("Points").then(res => console.log(res));
    setTimeout(() => {
      document.querySelectorAll('iframe').forEach((element, index, array) => {
        element.style.minHeight = '400px';
        element.style.pointerEvents = 'none';
      });
      if (seekToSentence) {
        const videoSeekTo = seekToSentence.split('=')[1];
        playerRef.current.seekTo(videoSeekTo);
      }
    }, 1000);
  }, []);
  // const [count, setCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState('normal');
  // const [bookmarks, setBookmarks] = useState([]);
  const [state, setState] = useState({
    pip: false,
    playing: true,
    controls: false,
    light: false,

    muted: true,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);
  const {
    playing,
    controls,
    light,

    muted,
    loop,
    playbackRate,
    pip,
    played,
    seeking,
    volume,
  } = state;

  const handlePlayPause = () => {
    if (state.playing) {
      SearchVideosByTag(currentTopic).then((res) => {
        setTopicVideos(res);
      });
      setTopicFocus(currentTopic);
    }
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  function SetClosestTopic(value, marks) {
    let closestMark = marks[0];
    let smallestDist = 100;
    for (let i = 0; i < marks.length; i++) {
      if (
        smallestDist > Math.abs(marks[i].value - value) &&
        marks[i].value <= value
      ) {
        smallestDist = Math.abs(marks[i].value - value);
        closestMark = marks[i];
      }
    }
    // console.log(closestMark.myLabel);
    setCurrentTopic(closestMark.myLabel);
  }

  const handleProgress = (changeState) => {
    // console.log("Progress");
    SetClosestTopic(state.played * 100, indexing);
    if (count > 3) {
      controlsRef.current.style.visibility = 'hidden';
      count = 0;
    }
    if (controlsRef.current.style.visibility == 'visible') {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    //   console.log({ newValue });

    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    //   console.log({ value: e.target });
    setState({ ...state, seeking: false });
    // console.log(sliderRef.current.value)
    playerRef.current.seekTo(newValue / 100, 'fraction');
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleVolumeSeekDown = (e, newValue) => {
    setState({ ...state, seeking: false, volume: parseFloat(newValue / 100) });
  };
  const handleVolumeChange = (e, newValue) => {
    // console.log(newValue);
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    //   console.log("mousemove");
    if (controlsRef.current) {
      controlsRef.current.style.visibility = 'visible';
      count = 0;
    }
  };

  const hanldeMouseLeave = () => {
    if (state.playing) {
      if (controlsRef.current) {
        controlsRef.current.style.visibility = 'hidden';
        count = 0;
      }
    }
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat == 'normal' ? 'remaining' : 'normal'
    );
  };

  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const hanldeMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  // const addBookmark = () => {
  //   const canvas = canvasRef.current;
  //   canvas.width = 160;
  //   canvas.height = 90;
  //   const ctx = canvas.getContext("2d");

  //   ctx.drawImage(
  //     playerRef.current.getInternalPlayer(),
  //     0,
  //     0,
  //     canvas.width,
  //     canvas.height
  //   );
  //   const dataUri = canvas.toDataURL();
  //   canvas.width = 0;
  //   canvas.height = 0;
  //   const bookmarksCopy = [...bookmarks];
  //   bookmarksCopy.push({
  //     time: playerRef.current.getCurrentTime(),
  //     display: format(playerRef.current.getCurrentTime()),
  //     image: dataUri,
  //   });
  //   setBookmarks(bookmarksCopy);
  // };

  const currentTime =
    playerRef && playerRef.current
      ? playerRef.current.getCurrentTime()
      : '00:00';

  const duration =
    playerRef && playerRef.current ? playerRef.current.getDuration() : '00:00';
  const elapsedTime =
    timeDisplayFormat == 'normal'
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  return (
    <>
      {/* <AppBar position="fixed">
          <Toolbar>
            <Typography>React Video Player</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar /> */}
      <Container maxWidth='md'>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={hanldeMouseLeave}
          ref={playerContainerRef}
          className={classes.playerWrapper}
        >
          {url && (
            <>
              <ReactPlayer
                ref={playerRef}
                width='100%'
                height='100%'
                url={url}
                pip={pip}
                playing={playing}
                controls={false}
                light={light}
                loop={loop}
                playbackRate={playbackRate}
                volume={volume}
                muted={muted}
                onPlay={() => setState({ ...state, playing: true })}
                onPause={() => setState({ ...state, playing: false })}
                //   onBuffer={console.log("Ready")}
                onProgress={handleProgress}
                config={{
                  youtube: {
                    playerVars: { modestbranding: 1 },
                    preload: true,
                  },
                  file: {
                    attributes: {
                      crossorigin: 'anonymous',
                    },
                  },
                }}
              />
              <Controls
                ref={controlsRef}
                // currentTopic = {currentTopic}
                // setCurrentTopic = {setCurrentTopicHandler}
                marks={indexing}
                onSeek={handleSeekChange}
                onSeekMouseDown={handleSeekMouseDown}
                onSeekMouseUp={handleSeekMouseUp}
                onDuration={handleDuration}
                onRewind={handleRewind}
                onPlayPause={handlePlayPause}
                onFastForward={handleFastForward}
                playing={playing}
                played={played}
                elapsedTime={elapsedTime}
                totalDuration={totalDuration}
                onMute={hanldeMute}
                muted={muted}
                onVolumeChange={handleVolumeChange}
                onVolumeSeekDown={handleVolumeSeekDown}
                onChangeDispayFormat={handleDisplayFormat}
                playbackRate={playbackRate}
                onPlaybackRateChange={handlePlaybackRate}
                onToggleFullScreen={toggleFullScreen}
                volume={volume}
                // onBookmark={addBookmark}
              />
            </>
          )}
        </div>
        {/* <canvas ref={canvasRef} /> */}
      </Container>
    </>
    // <Subjects indexing={vide}/>
  );
}
export default MyVideoPlayer;
