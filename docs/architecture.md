# Browser TTS architecture

The application layer can be understood as a small state machine around the Web Speech API.

```text
             getVoices()
                  │
                  ▼
        SpeechSynthesisVoice[]
                  │
                  ▼
Text → chunk → SpeechSynthesisUtterance
                  │
                  ▼
             speak()
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   controller state      events
 speaking/paused/      start/end/
 pending               boundary/error
        │                   │
        └─────────┬─────────┘
                  ▼
             Reader UI
```

The important architectural boundary is between the standardized browser-facing objects and the speech service behind a particular voice. A web application controls the former; it does not get a universal, platform-independent TTS engine merely by calling `SpeechSynthesis`.
