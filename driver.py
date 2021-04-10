import speech_recognition as sr
import sys

if (len(sys.argv) != 2):
    print("{\"code\": 1}")
else:
    filename = "./cache/" + sys.argv[1]
    r = sr.Recognizer()
    with sr.AudioFile(filename) as source:
        audio_data = r.record(source)
        try:
            text = r.recognize_google(audio_data)
            print("{\"code\": 0,\"text\":\"" + text + "\"}")
        except:
            print("{\"code\": 2}")
