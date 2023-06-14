///working speech synthesis
var phrase = "NO TRACE ANYWHERE OF LIFE, you say, pah, no difficulty there, imagination not dead yet, yes, dead, good, imagination dead imagine.";
var phrase2 = "Islands, waters, azure, verdure, one glimpse and vanished, endlessly, omit. Till all white in the whiteness the rotunda. ";

   function speakPhrase() {
   
        var speech = new SpeechSynthesisUtterance(phrase);
        var voices = window.speechSynthesis.getVoices();
        speech.default = false;
        speech.pitch = 0.2;
        speech.rate = 0.9;
        speech.voice = voices.filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];
        speech.lang = 'en-GB'; //Also added as for some reason android devices used for testing loaded spanish language 
        window.speechSynthesis.speak(speech);
    }

    voices = window.speechSynthesis.getVoices();