from video_downloader import Video_Downloader
from audios_downloader import Audio_Downloader
from whisper_model import Whisper_Model
from images_downloader import Image_Downloader
from models import *
import os
from sys import platform
from images_reco import recognize_new_image, mse
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


def index_video(link,topic = "Geometry"):
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
    return final_gpt_indexing, topic_list,title


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


def model_results(whisper_results):
    dic_results = {}
    # df = create_database(dataset,subject_list)
    # SVM = SVM_Text_Model(df)
    SVM = SVM_Text_Model()
    i = 0
    for chunk in whisper_results:
        print('Chunk start from:', i, ' end in:', i + seconds)
        result = SVM.svm_single_pred(chunk)
        print("*" * 50)
        key = f'{i}-{i + seconds}'
        dic_results[key] = result
        i += seconds

    return dic_results, SVM.classes


def recognize_images():
    ImageDownloader = Image_Downloader(vid_name, content_path, images_path, image_taker_pace)
    ImageDownloader.download_images()
    prediction = {}
    i = 0
    if platform == "win32":
        df_path = os.getcwd() + "\Model_dir\embedding_ConvNeXtBase_ex2.csv"
    else:
        df_path = os.getcwd() + "/Model_dir/embedding_ConvNeXtBase_ex2.csv"
    df = pd.read_csv(df_path)

    paths_list = []
    threshold = 7

    for image in os.listdir(images_path):
        if platform == "win32":
            img_path = images_path + f"\{image}"
        else:
            img_path = images_path + f"/{image}"
        paths_list.append(img_path)

    start_time = 0
    end_time = image_taker_pace
    if len(paths_list) == 1:
        prediction[f"{start_time}-{end_time}"] = recognize_new_image(df, paths_list[0])
    elif len(paths_list) == 2:
        img1 = paths_list[0]
        img2 = paths_list[1]
        error, _ = mse(img1, img2)
        if error < threshold:
            end_time = image_taker_pace * 2
            prediction[f"{start_time}-{end_time}"] = recognize_new_image(df, paths_list[0])
        else:
            prediction[f"{start_time}-{end_time}"] = recognize_new_image(df, paths_list[0])
            end_time += image_taker_pace
            start_time += image_taker_pace
            prediction[f"{start_time}-{end_time}"] = recognize_new_image(df, paths_list[1])
    else:
        for i in range(len(paths_list) - 1):
            img1 = paths_list[i]
            img2 = paths_list[i + 1]
            error, _ = mse(img1, img2)
            print("Image matching Error between the two images:", error)
            if error < threshold:
                end_time += image_taker_pace
                if i == (len(paths_list) - 2):
                    prediction[f"{start_time}-{end_time}"] = recognize_new_image(df, img1)

            else:
                prediction[f"{start_time}-{end_time}"] = recognize_new_image(df, img1)
                start_time = end_time
                end_time += image_taker_pace

    ImageDownloader.delete_images()
    return prediction


def final_indexing(audio_results, images_results):
    class_renamed = ['Decision-Trees', 'Linear-Regression', 'Logistic-Regression', 'neural-network',
                     'Support-Vector-Machines', 'K-nearest-neighbors']
    split_time = min(image_taker_pace, seconds)
    audio_results = update_dict(audio_results, split_time)
    images_results = update_dict(images_results, split_time)
    final_dict = calculate_new_results(audio_results, images_results, class_renamed)
    final_dict = connect_time_slices(final_dict)
    final_time_slice = list(final_dict.keys())[-1]
    new_final_time_slice = f"{final_time_slice.split('-')[0]}-{video_len}"
    final_dict[new_final_time_slice] = final_dict[final_time_slice]
    if new_final_time_slice != final_time_slice:
        final_dict.pop(final_time_slice, None)
    final_dict = convert_final_indexing(final_dict)
    return final_dict


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
        config_file_name = content_path + f"/Algo_Web_Server/{path}"
    config_file_name = os.path.normpath(config_file_name)
    config = configparser.ConfigParser()
    config.read(config_file_name)
    sections = config.sections()
    return sections
    
    
    
def fix_last_subject(results: dict):
    bad_subject_list = ["unknown","uncategorized","unidentified","uncertain",
                        "unspecified","not found","subject not recognized","subject not found"
                        ,"unknown subject","null","null subject"]
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

    