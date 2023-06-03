const express = require("express");
const router = express.Router();
//importing data
const videoData = require("../data/video-details.json");
const fs = require("fs");
const uuid = require("uuid");
// const myImage = require("../public/images/image0.jpeg")
const hostPath = "http://localhost:8080/images/";


// Using function to get time period 
const timeDifference = (timestamp ) => {
  //Current date
  const now = new Date();
  //Date from data
  const commentTime = new Date(timestamp);
  //  difference in seconds calculation
  const differenceSeconds = Math.floor((now - commentTime) / 1000);

  if (differenceSeconds < 60) {
    return `${differenceSeconds} seconds ago`;
 //Result in Minutes
  } else if (differenceSeconds < 3600) {
    const differenceMinutes = Math.floor(differenceSeconds / 60);
    return `${differenceMinutes} minutes ago`;
//Result in  Hours 
  } else if (differenceSeconds < 86400) {
    const differenceHours = Math.floor(differenceSeconds / 3600);
    return `${differenceHours} hours ago`;
  } else {//3600 * 24 gives days
    const differenceDays = Math.floor(differenceSeconds / 86400);
    return `${differenceDays} days ago`;
  }
};

router.get("/", (req, res) => {
  // res.json(videoData);
  const newVideo = videoData.map((video) => {
    return {
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: hostPath + video.image,
    };
  });
  //response with status and video details
  res.status(200).send(newVideo);
});

router.get("/:videoId", (req, res) => {
  // res.json(videoData);

  const videoId = req.params.videoId;
  const videoActive = videoData.find((video) => {
    return video.id === videoId;
  });
 
  // Check if the video is found
  if (!videoActive) {
    return res.status(404).send("Video not found");
  }

  // Create the updated video object
  const updatedVideoActive = {
    ...videoActive,
    image: hostPath + videoActive.image,
  };

  // Response with status and updated video details
  res.status(200).send(updatedVideoActive);
});


router.delete('/:videoId/comments/:commentId', (req, res) => {
  const videoId = req.params.videoId;
  const commentId = req.params.commentId;

  // Find the video by ID
  const video = videoData.find(video => video.id === videoId);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  // Find the index of the comment within the video's comments array
  const commentIndex = video.comments.findIndex(comment => comment.id === commentId);

  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  // Remove the comment from the video's comments array
  video.comments.splice(commentIndex, 1);

  return res.sendStatus(200);
});

router.post("/:videoId", (req, res) => {
  const videoId = req.params.videoId;
  console.log("Received POST request for videoId:", videoId);

  const { comment } = req.body;
  console.log("Received comment:", comment);

  // Find the video object with the matching videoId
  const video = videoData.find((video) => video.id === videoId);

  // Check if the video is found
  if (!video) {
    return res.status(404).send("Video not found");
  }

  // Create a new comment object
  const newComment = {
    id: uuid.v4(),
    name: "John Doe", // Example name
    comment: comment,
    likes: 0,
    timestamp: timeDifference(Date.now()),
  };

  // Add the new comment to the video's comments array
  video.comments.unshift(newComment);

  // Write the updated videoData array to the JSON file
  fs.writeFileSync("./data/video-details.json", JSON.stringify(videoData));

  // Send the new comment as the response
  res.json(newComment);
});

router.post("/", (req, res) => {

  const { title, description } = req.body;



  const newVid = {
    id: uuid.v4(),//generating random id
    title: title,
    channel: "Jagmeet Singh",
    image: "image0.jpeg",
    description: description,
    views: "12345",
    likes: "890,135",
    duration: "4:01",
    video: "image0.jpeg",
    timestamp: Date.now(),
    comments: [
      {
        id: "33bba08b-1b51-4153-ba7e-6da76b5ec1b9",
        name: "Ronaldo",
        comment:
          "There have been a few players described as the new George Best over the years, but this is the first time it's been a compliment to me",
        likes: 0,
        timestamp: Date.now(),
      },
    ],
  };
  videoData.push(newVid);
  fs.writeFileSync("./data/video-details.json", JSON.stringify(videoData));
  res.json(newVid);
});

module.exports = router;