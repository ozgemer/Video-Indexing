import os
from moviepy.video.io.VideoFileClip import VideoFileClip
import cv2

class Image_Downloader:
    def __init__(self,file_name,main_path,images_path,seconds):
        self.file_name = file_name
        self.main_path = main_path
        self.images_path = images_path
        self.seconds = seconds
    
    def download_images(self):
        os.chdir(self.main_path)
        clip = VideoFileClip(self.file_name)
        for t in range(0, int(clip.duration), self.seconds):
            # Get the frame at time t
            os.chdir(self.main_path)
            frame = clip.get_frame(t)

            # Save the screenshot
            filename = f"screenshot_{t}.png"
            os.chdir(self.images_path)
            cv2.imwrite(filename, frame)

        # Step 4: Close the video clip
        clip.close()

        # return the dir to be on the main dir
        os.chdir(self.main_path)
        
        print('Images Downloaded')
        
    def delete_images(self):
        # set the directory path
        dir_path = self.images_path

        # iterate through each file in the directory
        for file_name in os.listdir(dir_path):
            # check if the file is an image (e.g. ends with .jpg or .png)
            if file_name.endswith(".jpg") or file_name.endswith(".png"):
                # remove the file
                os.remove(os.path.join(dir_path, file_name))
                
        print('Images deleted')