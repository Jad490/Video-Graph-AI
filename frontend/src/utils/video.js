export const extractFramesFromVideo = async (videoUrl, intervalSeconds = 2, maxFrames = 15) => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.src = videoUrl
    video.muted = true
    video.crossOrigin = 'anonymous'

    const frames = []
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    video.onloadedmetadata = async () => {
      const duration = video.duration
      const step = Math.min(intervalSeconds, duration / maxFrames)
      let currentTime = 0

      const captureFrame = async () => {
        if (currentTime > duration || frames.length >= maxFrames) {
          resolve(frames)
          return
        }

        return new Promise((seekResolve) => {
          video.currentTime = currentTime
          video.onseeked = () => {
            const scale = 512 / video.videoWidth
            canvas.width = 512
            canvas.height = video.videoHeight * scale

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const base64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1]
            frames.push({ time: currentTime, data: base64 })

            currentTime += (duration / maxFrames)
            seekResolve()
          }
        }).then(captureFrame)
      }

      await captureFrame()
    }
  })
}
