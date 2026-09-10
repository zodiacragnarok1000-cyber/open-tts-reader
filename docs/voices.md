# Voice discovery and selection

`SpeechSynthesis.getVoices()` returns the voices currently exposed to the page. Each voice is represented by a `SpeechSynthesisVoice` object.

## Voice metadata

Useful properties include:

| Property | Meaning |
|---|---|
| `name` | Human-readable voice name. |
| `lang` | BCP 47 language tag associated with the voice. |
| `default` | Indicates the voice exposed as the default by the implementation. |
| `localService` | Indicates whether the voice is supplied by a local speech synthesizer service. |
| `voiceURI` | URI identifying the type/location of the speech synthesis service. |

`localService` is especially important when explaining browser TTS privacy: a browser voice is not automatically synonymous with a purely local engine.

## Why `voiceschanged` matters

On some implementations the voice list is not ready when the document first executes JavaScript. A robust application therefore handles both the initial `getVoices()` call and the `voiceschanged` event.

```js
const synth = window.speechSynthesis;

function loadVoices() {
  const voices = synth.getVoices();
  renderVoiceList(voices);
}

loadVoices();
synth.addEventListener('voiceschanged', loadVoices);
```

## `lang` versus `voice`

`SpeechSynthesisUtterance.lang` describes the language/locale of the utterance. `SpeechSynthesisUtterance.voice` selects a concrete `SpeechSynthesisVoice` object.

If no explicit voice is assigned, the implementation can select an appropriate default for the utterance's language. Setting `voice` gives the application more direct control over the available choice.

## Voice variability

The same web page can expose different voices on different operating systems, browser builds, language installations, and device configurations. A production application should therefore treat the voice list as runtime data rather than assuming that a named voice exists everywhere.
