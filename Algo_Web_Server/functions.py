from video_downloader import Video_Downloader
from audios_downloader import Audio_Downloader
from whisper_model import Whisper_Model
import os
from sys import platform
from gpt_indexing import gpt_index_video
import configparser

content_path = os.getcwd()

if platform == "win32":
    last_dirs = content_path.split('\\')[-1]
    if last_dirs != 'Algo_Web_Server':
        content_path += '\Algo_Web_Server'

    images_path = content_path + '\Images'
    audios_path = content_path + '\Audios'
    video_path = content_path + '\\video.mp4'
else:
    last_dirs = content_path.split('/')[-1]
    if last_dirs != 'Algo_Web_Server':
        content_path += '/Algo_Web_Server'

    images_path = content_path + '/Images'
    audios_path = content_path + '/Audios'
    video_path = content_path + '/video.mp4'

vid_name = 'video.mp4'
seconds = 45
# seconds = 90
image_taker_pace = 15

if not os.path.exists(images_path):
    os.makedirs(images_path)

if not os.path.exists(audios_path):
    os.makedirs(audios_path)


my_subject_list = ["Points", "Lines", "Planes","Midpoint", "Distance Formulas",
                   "Classify Angles", "Classify Polygons", "Perimeter", "Circumference", "Area",
                   " Conditional Statements", "Pairs of Lines", "Pairs of Angles", "Parallel Lines", "Transversals",
                   "Triangle Sum Properties", "Congruent by SSS", "Congruent by SAS", "Congruent by ASA",
                   "Congruent by AAS", "Equilateral Triangles","Perpendicular Bisectors",
                   "Angle Bisectors of Triangles", "Medians", "Altitudes","Similar Polygons", "Triangles Similar by AA",
                   "Triangles Similar by SSS", "Triangles Similar by SAS","Sine Ratio", "Cosine Ratio", "Tangent Ratio"]



def download_vid(link):
    global video_len
    VideoDownloader = Video_Downloader(link, content_path, vid_name)
    video_len,title = VideoDownloader.download_video()
    return title


def index_video(link,inner_topics,topic = "Geometry"):
    rewrite_inner_subjects(inner_topics)
    
    ############################################
    # topic = 'Biology'
    ############################################
    
    # auto = auto_from_function
    title = download_vid(link)
    split_audio()
    results = whisper_results()
    # audio_results, classes = model_results(results)
    

    # audio_results = gpt_index_video(results, my_subject_list,auto)
    # my_subject_list = get_topic_from_config(topic) 
    # audio_results = gpt_index_video(results, my_subject_list)
    audio_results, is_new_topic = gpt_index_video(results,topic)
    
    # print(audio_results)
    # images_results = recognize_images()
    # final_index = final_indexing(audio_results, images_results)
    final_gpt_indexing = gpt_final_indexing(audio_results)
    os.remove(video_path)
    topic_list = None
    if not is_new_topic:
        topic_list = get_topics_list_from_config()
        
    inner_subject_list = parse_ini_file()
    return final_gpt_indexing, topic_list,title,inner_subject_list


def split_audio():
    AudioDownloader = Audio_Downloader(vid_name, content_path, audios_path, seconds)
    AudioDownloader.split_audio()
    # AudioDownloader.delete_audios()


def whisper_results():
    # Use whisper model to transcripte the mp3 audios
    WhisperModel = Whisper_Model('base', audios_path)
    results = WhisperModel.text_to_speech()
    AudioDownloader = Audio_Downloader(vid_name, content_path, audios_path, seconds)
    AudioDownloader.delete_audios()
    WhisperModel.print_results()

    return results


def gpt_final_indexing(audio_results):
    split_time = seconds
    audio_res_time_slices = {}
    start_time = 0
    end_time = start_time + split_time
    for i in audio_results:
        audio_res_time_slices[f"{start_time}-{end_time}"] = audio_results[i]
        start_time += split_time
        end_time += split_time
    updated_audio_results = update_dict(audio_res_time_slices, split_time)
    
    updated_audio_results = fix_last_subject(audio_res_time_slices)
    
    final_dict = connect_time_slices(updated_audio_results)
    final_time_slice = list(final_dict.keys())[-1]
    new_final_time_slice = f"{final_time_slice.split('-')[0]}-{video_len}"
    final_dict[new_final_time_slice] = final_dict[final_time_slice]
    if new_final_time_slice != final_time_slice:
        final_dict.pop(final_time_slice, None)
    final_dict = convert_final_indexing(final_dict)
    return final_dict
    

def update_dict(original_dict, time_slice_duration):
    new_dict = {}
    for key, value in original_dict.items():
        start, end = key.split('-')
        start = int(start)
        end = int(end)
        while start < end:
            new_key = f"{start}-{start + time_slice_duration}"
            new_dict[new_key] = value
            start += time_slice_duration
    return new_dict


def calculate_new_results(aud_dict, imgs_dict, classes):
    final_dict = {}
    multiplier = 0.35
    if len(aud_dict.keys()) > len(imgs_dict.keys()):
        keys = aud_dict.keys()
    else:
        keys = imgs_dict.keys()
    for key in keys:
        if key not in aud_dict.keys():
            max_idx = imgs_dict[key].argmax()
            final_dict[key] = classes[max_idx]
            break
        if key not in imgs_dict.keys():
            max_idx = aud_dict[key].argmax()
            final_dict[key] = classes[max_idx]
            break

        audio_dist_array = aud_dict[key]
        image_dist_array = imgs_dict[key]
        for img in image_dist_array:
            index = classes.index(img)
            img_dist_val = image_dist_array[img]
            audio_dist_array[index] *= (1 + (img_dist_val * multiplier))
        max_index = audio_dist_array.argmax()
        final_dict[key] = classes[max_index]

    return final_dict


def connect_time_slices(final_dict):
    new_dict = {}
    counter = 0
    start = 0
    end = 0
    last_subject = None
    for time in final_dict:
        counter += 1
        start_time, end_time = time.split('-')
        subject = final_dict[time]
        if last_subject == None:
            last_subject = subject
        if final_dict[time] == last_subject:
            end = end_time
            if counter == len(final_dict):
                key = f'{start}-{end}'
                new_dict[key] = last_subject
            continue
        else:
            key = f'{start}-{end}'
            new_dict[key] = last_subject
            last_subject = final_dict[time]
            start = start_time
            end = end_time
            if counter == len(final_dict):
                key = f'{start}-{end}'
                new_dict[key] = subject

    return new_dict

def convert_seconds_to_minutes(seconds):
    minutes = seconds // 60
    remaining_seconds = seconds % 60
    return f"{minutes}:{remaining_seconds:02d}"


def convert_final_indexing(final_indexing):
    keys = list(final_indexing.keys())
    for key in keys:
        start,end = key.split('-')
        start = int(start)
        end = int(end)
        start = convert_seconds_to_minutes(start)
        end = convert_seconds_to_minutes(end)
        new_key = f'{start}-{end}'
        final_indexing[new_key] = final_indexing.pop(key)
        # del final_indexing[key]
        
    return final_indexing


def get_topics_list_from_config():
    path = "subjects_config.ini"
    content_path = os.getcwd()
    config_file_name = ""
    if platform == "win32":
        config_file_name = content_path + f"\Algo_Web_Server\{path}"
    else:
        config_file_name = content_path + f"/{path}"
    config_file_name = os.path.normpath(config_file_name)
    config = configparser.ConfigParser()
    config.read(config_file_name)
    sections = config.sections()
    return sections
    
    
    
def fix_last_subject(results: dict):
    bad_subject_list = ["n/a","n/a (unknown subject)","unknown","uncategorized","unidentified","uncertain",
                    "unspecified","not found","subject not recognized","subject not found"
                    ,"unknown subject","null","null subject", "none","n/a (not related to subject list)"]
    keys = list(results.keys())
    if len(keys) >= 2:
        last_key = keys[-1]
        one_before_last = keys[-2]
        if calculate_time_difference(last_key) <= 15 or str(results[last_key]).lower() in bad_subject_list:
           results[last_key] = results[one_before_last]
           return results
        else:
            return results
        
        
        
def calculate_time_difference(time_steps):
    start, end = time_steps.split("-")

    time_difference = int(end) - int(start)
    return time_difference

    
    
def write_new_subject(topic:str,new_subject_list:list,path='subjects_config.ini'):
    topic = topic.lower()
    content_path = os.getcwd()
    config_file_name = ""
    if platform == "win32":
        config_file_name = content_path + f"\Algo_Web_Server\{path}"
    else:
        config_file_name = content_path + f"/{path}"
        
    config = configparser.ConfigParser()
    config.read(config_file_name)
    if not config.has_section(topic):
        config.add_section(topic)
    else:
        existing_subject_list = config.get(topic,'subjects').split(',')
        new_subject_list = new_subject_list + existing_subject_list
        new_subject_list = list(set(new_subject_list))
    config.set(topic, 'subjects', ','.join(new_subject_list))



    # Write the updated configuration to the INI file
    with open(config_file_name, 'w') as configfile:
        config.write(configfile)
        
        
def rewrite_inner_subjects(subject:dict):
    for key,value in subject.items():
        subject_list = str(value).split(",")
        write_new_subject(key,subject_list)
        
        
def parse_ini_file(file_path='subjects_config.ini'):
    content_path = os.getcwd()
    config_file_name = ""
    if platform == "win32":
        config_file_name = content_path + f"\Algo_Web_Server\{file_path}"
    else:
        config_file_name = content_path + f"/{file_path}"
    result = {}
    
    with open(config_file_name, 'r') as file:
        content = file.read()
    
    sections = content.split('\n\n')
    
    for section in sections:
        lines = section.strip().split('\n')
        
        if len(lines) < 2:
            continue
        
        section_name = lines[0].strip('[]')
        subject_line = [line.strip() for line in lines if line.lower().startswith('subjects')]
        
        if not subject_line:
            continue
        
        subject_line = subject_line[0]
        subjects = subject_line.split('=')[1].strip()
        keywords = [keyword.strip() for keyword in subjects.split(',')]
        keywords = ','.join(keywords)
        result[section_name] = keywords
    
    return result

