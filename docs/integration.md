# Integrating browser TTS with SpeechSynthesis

This guide shows the smallest useful integration and then the pieces needed for a real reader.

## 1. Check availability

```js
const supported = 'speechSynthesis' in window;
```

The application should provide a fallback message or alternative when the API is unavailable.

## 2. Obtain the controller

```js
const synth = window.speechSynthesis;
```

## 3. Discover voices

```js
let voices = [];

function refreshVoices() {
  voices = synth.getVoices();
}

refreshVoices();
synth.addEventListener('voiceschanged', refreshVoices);
```

## 4. Create an utterance

```js
const utterance = new SpeechSynthesisUtterance('Hello from the browser.');
utterance.lang = 'en-US';
utterance.rate = 1;
utterance.pitch = 1;
utterance.volume = 1;
```

## 5. Select a voice

```js
const voice = voices.find(v => v.lang.startsWith('en'));
if (voice) utterance.voice = voice;
```

The code should not assume that a particular voice name exists.

## 6. Speak

```js
synth.speak(utterance);
```

`speak()` adds the utterance to the speech queue. It does not return an audio file.

## 7. Control playback

```js
synth.pause();
synth.resume();
synth.cancel();
```

## 8. Observe events

```js
utterance.addEventListener('start', () => {});
utterance.addEventListener('boundary', event => {
  console.log(event.charIndex);
});
utterance.addEventListener('end', () => {});
utterance.addEventListener('error', event => {
  console.error(event.error);
});
```

## 9. Build a document reader

For a real reader, add a document parser, sentence/chunk segmentation, application-level progress state, queue management, and a mapping between source text and utterances. Open TTS Reader provides a compact example of that architecture.
