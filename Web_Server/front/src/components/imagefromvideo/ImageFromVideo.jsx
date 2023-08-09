import React, { useState,useRef,usePreview,useEffect } from 'react';

function ImageFromVideo({videoLink}){

    const[link, setLink] = useState();
    function get_youtube_id(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }
    useEffect(() => {
        let finishedUrl = "https://img.youtube.com/vi/" + get_youtube_id(videoLink) + "/0.jpg";
        setLink(finishedUrl);
    });

    return(

        <img       
            style={{ width: "100%", height: "100%"}}
            src={link}
        />    
    );
}

export default ImageFromVideo;