import React from "react";

const Video = ({ src }) => {
  return (
    <>
      <video style={{objectFit:"cover"}} autoPlay muted loop>
        <source src={src} />
      </video>
    </>
  );
};

export default Video;
