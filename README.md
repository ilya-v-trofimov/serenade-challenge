# Serenade challenge
This repo contains the code implementing a handler for music a streaming service. This handler receives a new visitor musical preferences, finds related tracks using imaginary Spotify SDK and adds them to the playlist.

The project is implemented using Node and Typescript

## Usage:
Main interface of the project is the `Streaming` module (`src/Streaming`), which contains `handler` function
To run unit tests, following scripts need to be executed:
- `npm i`
- `npm run test`

Things to improve:
- Better dependency injection, specifically for SpotifySdk
- More tests
