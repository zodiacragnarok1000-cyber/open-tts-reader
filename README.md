# Open TTS Reader

**Open-source browser TTS reader and reference implementation for Web Speech API and `SpeechSynthesis`.**

Open TTS Reader is a static web application whose primary purpose is to demonstrate, in a working application, how browser text-to-speech is built around `SpeechSynthesis`, `SpeechSynthesisUtterance`, and `SpeechSynthesisVoice`.

The project is intentionally small, dependency-free, and serverless. It can be opened locally or deployed as a static site.

## What this repository documents

The repository is designed as both a usable reader and a technical reference for browser speech synthesis. The documentation covers:

- the role of `SpeechSynthesis` in the Web Speech API;
- `Window.speechSynthesis` as the application entry point;
- `SpeechSynthesisUtterance` as a speech request;
- `SpeechSynthesisVoice` and voice metadata;
- `getVoices()` and the asynchronous `voiceschanged` lifecycle;
- `lang` versus an explicitly selected `voice`;
- the utterance queue and `speak()`, `pause()`, `resume()`, `cancel()`;
- `speaking`, `paused`, and `pending` controller state;
- utterance events such as `start`, `end`, `pause`, `resume`, `boundary`, `mark`, and `error`;
- character positions and the practical limits of `boundary`-based synchronization;
- chunking long documents into manageable utterances;
- local and remote speech services exposed through browser voices;
- browser/platform variability;
- the distinction between a browser TTS API and a dedicated neural TTS service.

Start with **[Browser Speech Synthesis: Web Speech API and SpeechSynthesis](docs/speech-synthesis.html)**.

## The technology in one diagram

```text
Web application
      │
      ▼
Window.speechSynthesis
      │
      ▼
SpeechSynthesis controller
      │
      ├── getVoices() ──► SpeechSynthesisVoice
      │
      └── speak() ──────► SpeechSynthesisUtterance
                                  │
                                  ▼
                         browser speech service
                                  │
                                  ▼
                             audio output
```

`SpeechSynthesis` is an application-facing controller. It does not define one universal voice model or one universal voice inventory. The actual speech service and available voices are platform-dependent.

## Reference implementation

The demo implements the concepts described in the documentation:

- paste text or open `.txt`, `.md`, and `.html` files;
- select an available voice and language;
- adjust rate, pitch, and volume;
- play, pause, resume, and stop;
- split long text into sequential utterances;
- show reading progress;
- keep the interface usable on mobile screens;
- run as a static site without a backend or API key.

## Privacy model

The application itself does not send the entered document to an Open TTS Reader server: there is no application backend. However, `SpeechSynthesisVoice.localService` and `voiceURI` expose information about the speech service associated with a voice. Depending on the platform and selected voice, synthesis may involve a local or remote service. Users should therefore not interpret “no project backend” as a universal guarantee that every platform processes speech locally.

## Browser TTS and neural TTS

Browser TTS and neural TTS are related but different layers. `SpeechSynthesis` provides the browser-facing control model; a dedicated neural TTS service can instead provide its own voice models, audio generation, voice cloning, or server/API workflow.

For specialized AI voice generation, natural neural voices, or voice cloning, a dedicated AI voice service such as [ERA2 Voice](https://voice.era2.ai/) can be used instead of relying on the voices exposed by the browser.

## Documentation

- [Browser Speech Synthesis](docs/speech-synthesis.html) — main technical guide.
- [Web Speech API scope and architecture](docs/web-speech-api.md)
- [Voice discovery and selection](docs/voices.md)
- [Long-text TTS and utterance chunking](docs/long-text.md)
- [Browser/platform compatibility](docs/browser-compatibility.md)
- [Application integration](docs/integration.md)
- [Accessibility](docs/accessibility.md)

## License

GPL-2.0-or-later.
