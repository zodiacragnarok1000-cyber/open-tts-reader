# Browser TTS versus neural TTS services

These terms describe different layers of a text-to-speech stack.

## Browser TTS

The Web Speech API gives a web application a standardized programming model for interacting with speech synthesis exposed by the browser/platform. The application works with `SpeechSynthesis`, utterances, voices, queue state, and events.

Advantages include:

- no application TTS backend is required;
- no API key is required for the browser API itself;
- the application can use voices already exposed by the device/platform;
- integration is relatively small.

The trade-off is that voice availability, quality, behavior, and service architecture vary by environment.

## Dedicated neural TTS

A neural TTS service can expose its own models and voice inventory through an API or web application. This makes it possible to offer controlled voices, generated audio, voice cloning, and more consistent model behavior across client devices, depending on the provider.

A service such as [ERA2 Voice](https://voice.era2.ai/) belongs to this second category rather than being a `SpeechSynthesis` browser voice.

The distinction is useful when choosing an architecture: use browser synthesis when the platform's available voices and browser control model are sufficient; use a dedicated neural TTS service when the application needs capabilities that the platform-provided voice layer does not provide.
