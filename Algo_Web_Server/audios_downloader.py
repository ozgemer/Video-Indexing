import subprocess
import os
from sys import platform

class Audio_Downloader:
    def __init__(self,file_name,main_path,audio_path,seconds):
        self.file_name = file_name
        self.main_path = main_path
        self.audio_path = audio_path
        self.seconds = seconds
    
    def split_audio(self):
        input_file_name = self.file_name
        if platform == "win32":
            current_audio_path = self.audio_path + '\\'
            vid_path = self.main_path + '\\' + self.file_name 
        else:
            current_audio_path = self.audio_path + '/'
            vid_path = self.main_path + '/' + self.file_name 

        # the location of the input file
        output_directory = self.main_path + input_file_name

        # using ffmpeg the audio.mp3 is splited into 60 seconds time steps.
        # save them in the following format audio.mp3out000.mp3, audio.mp3out001.mp3 ...
        # run the command as well
        seconds = self.seconds
        # support audio.mp3out%03d.mp3 files
        # !ffmpeg -i $file_name -f segment -segment_time $seconds -vn -acodec libmp3lame "{current_audio_path}audio.mp3out%03d.mp3"
        # cmd = f"ffmpeg -i {self.file_name} -f segment -segment_time {self.seconds} -vn -acodec libmp3lame '{current_audio_path}audio_%03d.mp3'"
        # os.system(cmd)
        
        command = ["ffmpeg", "-i", vid_path, "-f", "segment", "-segment_time", str(self.seconds), "-vn", "-acodec", "libmp3lame", f"{current_audio_path}audio_%03d.mp3"]
        subprocess.run(command)
        
        print('Split finished')
        
    def delete_audios(self):
        # set the directory path
        dir_path = self.audio_path

        # iterate through each file in the directory
        for file_name in os.listdir(dir_path):
            # check if the file is an image (e.g. ends with .jpg or .png)
            if file_name.endswith(".mp3"):
                # remove the file
                os.remove(os.path.join(dir_path, file_name))
                
        print('Audios deleted')