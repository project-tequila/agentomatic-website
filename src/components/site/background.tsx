export function SiteBackground() {
  return (
    <div className="agent-bg" aria-hidden="true">
      <video
        className="max-h-none min-h-full min-w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://static.wixstatic.com/media/c837a6_8420aadea8e84c4f979334b25dbccb4df000.jpg/v1/fill/w_1466,h_779,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_auto/c837a6_8420aadea8e84c4f979334b25dbccb4df000.jpg"
      >
        <source
          src="https://video.wixstatic.com/video/c837a6_8420aadea8e84c4f979334b25dbccb4d/720p/mp4/file.mp4"
          type="video/mp4"
        />
      </video>
      <div className="tech-grid" />
      <div className="tech-orb tech-orb--a" />
      <div className="tech-orb tech-orb--b" />
      <div className="agent-haze" />
    </div>
  );
}

