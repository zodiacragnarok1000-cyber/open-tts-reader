# Web Speech API: scope and architecture

The Web Speech API exposes two distinct browser capabilities: speech recognition and speech synthesis. This project focuses on the synthesis side, also known as text-to-speech (TTS).

## Synthesis object model

The synthesis side is centered on four concepts:

```text
Window.speechSynthesis
        │
        ▼
 SpeechSynthesis
   │          │
   │          └── getVoices() → SpeechSynthesisVoice[]
   │
   └── speak() → SpeechSynthesisUtterance
```

`SpeechSynthesis` controls the synthesis service. `SpeechSynthesisUtterance` describes a piece of text and its requested speech parameters. `SpeechSynthesisVoice` describes a voice exposed by the system.

## What the API does not standardize

The API does not give a web application one universal TTS model, identical voice list, or identical audio renderer on every operating system. The browser acts as the application-facing layer while the underlying speech service is supplied by the platform/browser environment.

This distinction is important when documenting privacy, voice quality, availability, latency, and cross-browser behavior.

## Why a reference implementation is useful

API reference pages describe individual interfaces and methods. A real reader has to combine them into a lifecycle:

```text
load voices
   ↓
choose voice
   ↓
create utterance
   ↓
configure utterance
   ↓
queue with speak()
   ↓
observe events/state
   ↓
queue next chunk
```

Open TTS Reader implements this lifecycle without a backend so that the interaction between the objects can be inspected in one small codebase.
