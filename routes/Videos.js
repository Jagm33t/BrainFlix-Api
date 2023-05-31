const express = require('express');
const router = express.Router();
//importing data
const videoData = require('../data/video-details.json');

const fs = require('fs');
const uuid = require('uuid');

router.get('/', (req, res) => {
  // res.json(videoData);
  const newVideo = videoData.map(video => {
    return {
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    }
    
  })
  //response with status and video details
  res.status(200).send(newVideo)

});

router.get('/:videoId', (req,res)=>{
  // res.json(videoData);
  
  const videoId = req.params.videoId;
  const videoActive = videoData.find(video =>{
    return video.id === videoId
  })
    //response with status and video details
  res.status(200).send(videoActive);
});
router.post('/', (req,res) =>{
  res.json(videoData);
})

// router.get('/:videoId/comments')

router.post('/',(req,res)=>{
const {title , description } = req.body;
videoData.push({
  "id": uuid.v4(),
  "title": title,
    "channel": "Jagmeet Singh",
    "image": "",
    "description": description,
    "views": "12345",
    "likes": "890,135",
    "duration": "4:01",
    "video": "https://project-2-api.herokuapp.com/stream",
    "timestamp": Date.now(),
    "comments": [
      {
        "id": "33bba08b-1b51-4153-ba7e-6da76b5ec1b9",
        "name": "Ronaldo",
        "comment": "There have been a few players described as the new George Best over the years, but this is the first time it's been a compliment to me",
        "likes": 0,
        "timestamp": 1998522461000,
      },
    ]
})
fs.writeFileSync('../data/video-details.json', JSON.stringify(videoData));
res.json(videoData)

})
module.exports = router;
