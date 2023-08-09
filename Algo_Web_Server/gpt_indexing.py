import openai
from apikey import api_key as ak
from apikey import api_key2 as ak2
from apikey import api_key3 as ak3
# import ast
import os
import json
import time
# import re
import configparser
from sys import platform
import random


# openai.api_key = ak

api_key_list = [ak,ak2,ak3]


my_subject_list = ["Introduction","Conclusion","Points", "Lines", "Planes" ,"Midpoint", "Distance Formulas",

  "Classify Angles" , "Classify Polygons", "Perimeter", "Circumference", "Area", " Conditional Statements","Pairs of Lines", "Pairs of Angles", "Parallel Lines", "Transversals","Triangle Sum Properties", "Congruent by SSS", "Congruent by SAS", "Congruent by ASA",
  "Congruent by AAS", "Equilateral Triangles","Perpendicular Bisectors", "Angle Bisectors of Triangles", "Medians", "Altitudes","Similar Polygons", "Triangles Similar by AA", "Triangles Similar by SSS", "Triangles Similar by SAS","Sine Ratio", "Cosine Ratio", "Tangent Ratio"]

chunkk = "And we know it looks something like this, but when you identify a line, you want to use two points that are on the line. Like, say, for example, if you have a point x and y that are on the line, the way you write at the notation, it's kind of like a pictograph, you know, or a picture, like,"


def send_prompt(subjects,chunks,api_key,topic):
    ## new_subject = True
    # main_subject = 'Biology'
    
    # new_subject_list = None
    
    # if new_subject == True:
    #     if does_subject_exist(main_subject) == False:
    #         print('The subject does NOT exist')
    #         new_subject_list = get_new_subject_list(main_subject)
    #         new_subject_list = extract_inner_subjects(new_subject_list)
    #         write_new_subject(main_subject,new_subject_list,'subjects_config.ini')
    #         time.sleep(70)
    #     else:
    #         print('The subject does exist')
    #         new_subject_list = get_topic_from_config(main_subject)


    auto = False
    openai.api_key = api_key
        
    # prompt = f"""
    # lets play game - rules:
    # 1. you get as input json key - chunk number and value : {chunks}, and subjects list -\n {subjects_str}.
    # 2. output(the value that you return as answer) give me back json in single line that the key is the chunk number and
    #     the value is the subject that you choose as the most fit to relate with this chunk from the list that you get.
    # 3. one more rule and the most important - you can't chose anything except subjects from the subjects list!
    # """
    
    # if new_subject_list != None:
    #     subjects = new_subject_list
        
    subjects_str = ""
    for sub in  subjects:
        subjects_str += sub + "\n"
        
    
    prompt = f"""Given a JSON object with numerical keys and text values extracted from a video, your goal is to classify the text using a known subject list. The output should be a JSON object containing a single subject from the list corresponding to the input key-value pairs. If there is no exact match for a text, you can use previously classified subjects to classify the unknown subject. However, if the subject is already known, classify it regularly without considering the previous subjects. The output format should be in the form of a dictionary where the numerical keys represent the input keys, and the values represent the classified subjects.
    Subject List: {subjects_str}
    Input JSON: {chunks}
    Example output:
    {{"1": "Scale Factor","2": "Angle Angle Similarity","3": "Similar Triangles"}}
    Please ensure that the output consists solely of the JSON object with the classified subjects.
    """
    
    auto_prompt = f"""Given a transcript extracted from a video related to the main subject of 
    '{topic}', a JSON format containing subject-text pairs, 
    and a classification task centered around the main subject, 
    classify each subject based on the text and return the results in JSON format.
    The JSON format should have identifiers as keys (e.g., '1', '2', etc.) and the corresponding subject classification as values. The classification should be based on the main subject provided ('{topic}') and should include relevant categories or concepts related to the main subject. The video content and the classification subjects should be centered around the main subject.
    {chunks}
    """
    
    final_prompt = ""
    if auto == True:
        final_prompt = auto_prompt
    else:
        final_prompt = prompt
            
    print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    print('Final prompt lenght (45 seconds):',len(final_prompt))
    print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    output = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.3,
        messages=[
            {"role": "user",
             "content": final_prompt}]
    )

    response = str(output["choices"][0]["message"]["content"])
    # results = clean_json_string(response)
    # results = ast.literal_eval(response)
    results = json.loads(response)

    json_result = {}
    
    for i in results:
        if str(results[i]) in subjects:
            json_result[i] = str(results[i])
        else:
            json_result[i] = results[i]
            
    # json_result = remove_unknown(json_result)
    if auto == False:
        json_result = handle_unknown_subjects(json_result,subjects,topic)

    return json_result




def gpt_index_video(chunks:list,topic:str):
    subjects = None
    main_subject = topic
    is_new_subject = does_topic_exist(main_subject)
    if is_new_subject == False:
        print('The topic does NOT exist')
        subjects = get_new_subject_list(main_subject)
        subjects = extract_inner_subjects(subjects)
        write_new_subject(main_subject,subjects,'subjects_config.ini')
        time.sleep(70)
    else:
        print('The topic does exist')
        subjects = get_topic_from_config(main_subject)
            
    dict_list = []
    dict_counter = 0
    chunk_dict = {}
    counter = 1
    splitter = 15
    for chunk in chunks:
        if dict_counter % splitter == 0:
            new_dict = {}
            dict_list.append(new_dict)
        # chunk_dict[counter] = chunk
        new_dict[counter] = chunk
        counter += 1
        dict_counter += 1
        
    # results = send_prompt(subjects, chunk_dict)
    api_counter = 0
    results_dict = {}
    api_key = ak
    for dic in dict_list:
        if api_counter % 3 == 0 and api_counter != 0:
            time.sleep(65)
        res = send_prompt(subjects, dic,api_key,topic)
        results_dict.update(res)
        api_counter += 1
    print(results_dict)
        
    return results_dict, is_new_subject


def remove_unknown(results: dict):
    new_results = results.copy()
    keys = results.keys()
    for key in keys:
        if new_results[key] == 'Not Similar':
            new_results[key] = new_results[str(int(key)-1)]
            
    return new_results


def handle_unknown_subjects(results: dict,subjects_list: list,topic: str):
    new_results = results.copy()
    keys = list(results.keys())
    index = 1
    flag = False
    bad_subject_list = ["n/a","n/a (unknown subject)","unknown","uncategorized","unidentified","uncertain",
                    "unspecified","not found","subject not recognized","subject not found"
                    ,"unknown subject","null","null subject", "none","n/a (not related to subject list)"]
    # Fix if the first result in not found
    for i,subject in new_results.items():
        if subject not in subjects_list:
            bad_subject_flag = False
            for bad_subject in bad_subject_list:
                if str(subject).lower() in bad_subject_list:
                    bad_subject_flag = True
                    break
                elif bad_subject in str(subject).lower():
                    bad_subject_flag = True
                    break
                    
            if bad_subject_flag == False:
                flag = True
                subjects_list.append(subject)
                
    # for i,subject in new_results.items():
    #     if subject not in subjects_list and str(subject).lower() not in bad_subject_list:
    #         flag = True
    #         subjects_list.append(subject)
    
    if new_results[keys[index-1]] not in subjects_list:
        while new_results[keys[index-1]] not in subjects_list:
            subjects_list.append(new_results[keys[index-1]])
            
            if index == len(results):
                new_results[keys[0]] = random.choice(subjects_list)
                # raise Exception("Not found a true subject in the JSON.")
            index += 1
        new_results[keys[0]] = results[keys[index-1]]
        
    for key in keys:
        index = keys.index(key)
        if new_results[key] not in subjects_list:
            new_results[key] = new_results[keys[index-1]]
            
    if flag == True:
        subjects_list = list(set(subjects_list))
        write_new_subject(topic,subjects_list)
        
    return new_results


def get_new_subject_list(topic):
    openai.api_key = ak
    
    final_prompt = f"""
    Please provide the topic "{topic}" for which you would like me to generate a hierarchical list of relevant keywords. 
    The hierarchy will include subcategories and consist of only the most commonly used or fundamental keywords. 
    The entire output must be in JSON format with the subject as the key and the keywords as the corresponding values, and the subcategories will be enclosed in curly brackets and the keywords will be enclosed in square brackets.
    The generated list will not contain any null or missing values.
    """
    

    output = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.3,
        messages=[
            {"role": "user",
             "content": final_prompt}]
    )

    response = str(output["choices"][0]["message"]["content"])
    results = json.loads(response)
    return results


    
    # inner_subjects = extract_inner_subjects(results)
    
    # test_topic = inner_subjects[0]
    # upper_level = find_upper_level(results, test_topic)

    
# def extract_inner_subjects(data):
#     subjects = []
#     for key, value in data.items():
#         if isinstance(value, dict):
#             subjects.extend(extract_inner_subjects(value))
#         else:
#             if value == None:
#                 subjects.append(key)
#     return subjects

def extract_inner_subjects(data):
    subjects = []
    for key, value in data.items():
        if isinstance(value, dict):
            subjects.extend(extract_inner_subjects(value))
        elif isinstance(value, list):
            for val in value:
                subjects.append(val)
        # else:
        #     if value == None:
        #         subjects.append(key)
    return subjects

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


def does_topic_exist(topic: str,path='subjects_config.ini'):
    topic = topic.lower()
    content_path = os.getcwd()
    config_file_name = ""
    if platform == "win32":
        config_file_name = content_path + f"\Algo_Web_Server\{path}"
    else:
        config_file_name = content_path + f"/{path}"
    config_file_name = os.path.normpath(config_file_name)
    config = configparser.ConfigParser()

    config.read(config_file_name)

    if config.has_section(topic):
        return True
    else:
        return False
    
def get_topic_from_config(topic:str):
    topic = topic.lower()
    content_path = os.getcwd()
    if platform == "win32":
        config_file_name = content_path + "\Algo_Web_Server\subjects_config.ini"
    else:
        config_file_name = content_path + "/subjects_config.ini"
    config_file_name = os.path.normpath(config_file_name)
    config_file = open(config_file_name, "r")
    cp = configparser.ConfigParser()
    cp.read_file(config_file)
    subjects = []
    if cp.has_section(topic):
       subjects_str = cp.get(topic, "subjects")
       subjects = subjects_str.split(",")
       
    return subjects

# res = get_topic_from_config('math')
# print(res)

def find_upper_level(data, sub_subject):
    for key, value in data.items():
        if sub_subject in value:
            return key
        if isinstance(value, dict):
            upper_level = find_upper_level(value, sub_subject)
            if upper_level:
                return upper_level
    return None

def clean_json_string(json_str):
    try:
        # Remove unnecessary newlines and 'Topic: ' prefix
        json_str = json_str.replace('\n', '').replace('Topic: ', '')
        # Parse the JSON string
        data = json.loads(json_str)
        return data
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {str(e)}")
        return None
