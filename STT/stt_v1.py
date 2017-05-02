import base64
import googleapiclient.discovery
speech_file = '../Voice_003.flac' # The Beatles -> '../Voice_002.flac' # Birdy Nam Nam -> '../Voice_003.flac'

filename = "commands/play_artist.yml"
file = open(filename,"w") 


with open(speech_file, 'rb') as speech:
    # Base64 encode the binary audio file for inclusion in the JSON
    # request.
    speech_content = base64.b64encode(speech.read())

# Construct the request
service = googleapiclient.discovery.build('speech', 'v1')
service_request = service.speech().recognize(
    body={
          "config": {
            "maxAlternatives": 30,
            "languageCode": "en_US",
            "speechContexts": [
              {
                "phrases": [
                  "Play",
                  "Volume up",
                  "Stop"
                ]
              }
            ],
            "encoding": "FLAC"
          },
            'audio': {
                'content': speech_content
            }

        })

#### NLU test expectation
Artist = 'The Beatles' #'Birdy Nam Nam'
Track =  'White' #'the Hammerhead' # add all lowcase + "the" as optional


response = service_request.execute()
# print len(response['results'][0]['alternatives'])
recognized_text = 'Transcribed Text: \n'
recognized_confidence = 0
for i in range(len(response['results'][0]['alternatives'])):
    recognized_text = response['results'][0]['alternatives'][i]['transcript']
    # recognized_confidence += response['results'][i]['alternatives'][1]['confidence']
    print '\n',recognized_text
    file.write("- query: %s \n  goal: [ { slot_name: 'album', value: %s }, { slot_name: 'artist', value: %s } ]" %(recognized_text, Track, Artist))
    # file.write("- query: %s \n  goal: { data : {  intent: { intent_name : user_BJGIORoTx__PlayMusic }, slots: { slot_name: track , value: %s }, { slot_name: artist , value: %s } } }\n\n" %(recognized_text, Track, Artist))

file.close() 



#[ { slot_name: 'album', value: 'white' }, { slot_name: 'artist', value: 'the beatles' } ]
