# Google_STT 
Test --- python STT linked to node.js testing NLU app

Authentification
--------------------------------

If your not authentified yet on Google API Client Libraries please do it by following instructions on that link : 
https://developers.google.com/api-client-library/python/apis/discovery/v1

you could link your google API Client accound with your server by using either ``API Keys`` or ``OAuth 2.0``

Running local STT Sample
--------------------------------------

make sure you have python 2.7 on your machine 

    $ cd STT/
    $ python stt_v1.py 

this script takes short .flac file displaying a spoken query, eg : "play the Hammerhead from Birdy Nam Nam"
after encoding the .flac file with based 64 bytes script, we give it as an input to STT as below   

    
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
                      "Stop" # we could contextualise by adding more phrases. but the number of phrases is limited
                    ]
                  }
                ],
                "encoding": "FLAC"
              },
                'audio': {
                    'content': speech_content
                }

            })


#. Json Output

It display 10 guesses

    {"results": [{
          "alternatives": [
            {"transcript": "play the Hammerhead from birdie num num",
              "confidence": 0.83659744},
            {"transcript": "play the Hammerhead from Birdy num-num"},
            {"transcript": "play the Hammerhead from Birdy Nam Nam"},
            {"transcript": "play the Hammerhead from nerdy num num"},
            {"transcript": "play the Hammerhead from brooten MN"},
            {"transcript": "play the Hammerhead from routine of them"},
            {"transcript": "play the Hammerhead from 13 of them"},
            {"transcript": "play the hammerheads from nerdy num num"},
            {"transcript": "play the hammerheads from brooten MN"},
            {"transcript": "play the hammer head from nerdy num num"}]}]}

#. text Output 


It display 10 guesses


    play the Hammerhead from birdie num num

    play the Hammerhead from Birdy num-num

    play the Hammerhead from Birdy Nam Nam

    play the Hammerhead from nerdy num num

    play the Hammerhead from brooten MN

    play the Hammerhead from routine of them

    play the Hammerhead from 13 of them

    play the hammerheads from nerdy num num

    play the hammerheads from brooten MN

    play the hammer head from nerdy num num

