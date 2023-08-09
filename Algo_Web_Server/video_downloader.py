from pytube import YouTube


class Video_Downloader:
    def __init__(self,link,path,video_name):
        self.link = link
        self.path = path
        self.video_name = video_name

    def download_video(self):
        # Step 1: Create a YouTube object
        yt = YouTube(self.link)
        # yt = YouTube(self.link,use_oauth=True,allow_oauth_cache=True)
        video_lenght = yt.length
        title = yt.title

        # Step 2: Get all available streams
        streams = yt.streams.all()
        # streams = yt.streams

        # Step 3: Filter streams to get only mp4 video streams
        mp4_streams = yt.streams.filter(file_extension='mp4', mime_type='video/mp4')

        # Step 4: Get the first mp4 stream
        stream = mp4_streams.first()

        # Step 5: Download the video
        stream.download(output_path=self.path,filename = self.video_name)
        
        print('Download finished')

        return video_lenght,title

        
        
# yt = YouTube("https://www.youtube.com/watch?v=0p0o5cmgLdE",use_oauth=True,allow_oauth_cache=True)
# # yt = YouTube("https://www.youtube.com/watch?v=0p0o5cmgLdE")
# # print(yt._title)
# streams = yt.streams
# mp4_streams = yt.streams.filter(file_extension='mp4', mime_type='video/mp4')
# stream = mp4_streams.first()
# stream.download(filename = 'video.mp4')

# # video = yt.streams.get_highest_resolution()
# # video.download(filename=video.default_filename)


# print('Download finished')


