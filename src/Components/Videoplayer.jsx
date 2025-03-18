import "../index.css"

import { FaForwardFast } from "react-icons/fa6";
import { FaPlay,FaPause ,FaFastBackward ,FaVolumeMute  } from "react-icons/fa";
import { use, useEffect, useRef, useState } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { GoScreenFull } from "react-icons/go";


function Videoplayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress , setProgress] = useState(0)
  const videotag = useRef(null);
  const elementRef = useRef(null);
 const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
const [mute, setMute] = useState(false)
  const [volume, setVolume] = useState(100)
  const [src, setSrc] = useState("video/test.mp4")
  const filesrc=useRef(null)
  const disableContextMenu = (e) => {
    e.preventDefault();
  };

  const playPause = () => {
    if (isPlaying) {
      videotag.current.pause();
    } else {
      videotag.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    
    videotag.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  }, []);

 

  const getDuration = (second) => {
    let min = (second / 60).toFixed(2).replace('.', ':')
    if (min < 10) {
      min = `0${min}`
      
    }
    else if (min > 60) {
      min = (min / 60).toFixed(2).replace('.', ':')
      
    }
    return min
   }

  useEffect(() => { 
    const player = videotag.current;

    player.addEventListener('loadedmetadata',  ()=> {
      setDuration(player.duration)
      setCurrentTime(player.currentTime)
      // video progress
      player.addEventListener('timeupdate', () => {
        setProgress((player.currentTime / player.duration) * 100)
      })
      // videi running
      player.addEventListener('timeupdate', () => {
        setCurrentTime(player.currentTime)
      })
     })

  }, [])
  
  // full screen
  const enterFullscreen = () => {
    if (elementRef.current) {
      if (elementRef.current.requestFullscreen) {
        elementRef.current.requestFullscreen();
      } else if (elementRef.current.mozRequestFullScreen) { // Firefox
        elementRef.current.mozRequestFullScreen();
      } else if (elementRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elementRef.current.webkitRequestFullscreen();
      } else if (elementRef.current.msRequestFullscreen) { // IE/Edge
        elementRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.mozFullScreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // progress bar change on click
  const changeProgressOnClick = (e) => {
    const newTime = e.nativeEvent.offsetX / e.target.clientWidth * videotag.current.duration;
    videotag.current.currentTime = newTime;
  };

  // forward and backward
  const forward = () => {
    videotag.current.currentTime += 5;
  };
  const backward = () => {
    videotag.current.currentTime -= 5;
  } 

  // mute and unmute
  const muteUnmute = () => {
    if (mute) {
      videotag.current.muted = false;
    } else {
      videotag.current.muted = true;
    }
    setMute(!mute);
  };
  
  // value of progress bar
  const soundIncreaseDecrease = (e) => {
    const value = e.target.value;
    setVolume(value)
   
    if (value == 0) {
      // console.log("mute")
      setMute(true)
    }
    else {
      setMute(false)
    }
    videotag.current.volume = value / 100;
  };
  const srcDynmic = () => {
    let filetag = filesrc.current;
    let reader = new FileReader()
    reader.readAsDataURL(filetag.files[0]);
    reader.onload = () => {
      let filename=reader.result;
      setSrc(filename)
    }
  }

  return (
    <div className="w-[90%] min-w-[300px]  mx-auto videoplayer relative bg-amber-50 shadow-2xl" ref={elementRef}>
      <video src={src} ref={videotag}  className="vd" onContextMenu={disableContextMenu} />
      <div className=" bg-gradient-to-t from-black to transparent absolute bottom-0 lef-0 w-full space-y-1 p-2">
        <div className="h-[10px] bg-white cursor-pointer rounded-2xl" onClick={changeProgressOnClick}>
          <div  className="bg-rose-400  h-full rounded-2xl" style={{width:progress+'%'}}/>
        </div>

        <div className="flex text-white justify-between items-center ">
          <div className="flex items-center gap-4">
            <button className="cursor-pointer" onClick={backward}>
              <FaFastBackward  />
            </button>
            <button onClick={playPause} className="cursor-pointer">                                          
              {
                isPlaying ? (
                  <FaPause />
                ) : (
                  <FaPlay />
                )
              }
      
            </button>
            <button className="cursor-pointer" onClick={forward}>
            <FaForwardFast/>

            </button>
       </div>
          <div>{getDuration(currentTime)}/{getDuration(duration) }</div>

          <div className="flex gap-3">
            <button className="cursor-pointer " onChange={soundIncreaseDecrease}>
              <input type="range" name="" id=""  className="cursor-pointer bg-blue-900 w-[50px]" min={0} max={100} value={volume} onChange={e=>setVolume(e.target.value)} step={0.1}/>
            </button>
            <button className="cursor-pointer" onClick={muteUnmute}>
              {mute ? <FaVolumeMute   /> : <HiSpeakerWave  />}
         
            </button>
            
            <button onClick={toggleFullscreen} className="cursor-pointer">
              <GoScreenFull  />
            </button>
   

       </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-2 ">
        <input type="file" name="" id="" className="w-full h-[35px] bg-blue-400" onChange={srcDynmic} accept="video/*" ref={filesrc}/>
      </div>
    </div>
  )
}
export default Videoplayer;