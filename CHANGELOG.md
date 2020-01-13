# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Upcoming] - 2020-01-08

- Change `tempo` to `bpm` in `Song` to match `Tone` API
- Add `volume` and `isMuted` prop to `Song`
- Add `polyphony`, `oscillatorType`, `envelopeAttack`, `envelopeDecay`, `envelopeSustain` and `envelopeRelease` props to `Instrument`
- Remove `type` of `polySynth` from `Instrument` as it is just a wrapper around other synths
- Add `membraneSynth`, `metalSynth` and `pluckSynth` types to `Instrument`
- Update `AMSynth` and `FMSynth` values in `Instrument` `type` to `amSynth` and `fmSynth`
- Remove `/example` folder to focus on `/website` that already includes docs and examples
- Change `steps` from `step.note` to `step.name` in `Track`
- Add more Typescript definitions
- Change `Instrument` to use `useLayoutEffect` instead of `useEffect` for triggering `notes`
- Ensure `Instrument` and `Effect` don't crash if unknown `type` is passed

## [0.2.2] - 2019-09-18

- Add more effect types

## [0.2.1] - 2019-09-18

- Add more effect types
- Add more instrument types
- Update `constants` to `config`

## [0.2.0] - 2019-09-10

- Fix empty steps bug for Track
- Add more instrument types to Instrument
- Add Next JS documentation and examples website

## [0.1.1] - 2019-06-23

- Add website
- Fix sequence note repeat bug by adding JSON.stringify to Track

## [0.1.0] - 2019-06-23

- Refactor library to use React Hooks
- Update StepsEditorExample
- Set up `PUBLIC_URL` for audio files in example
- Add `constants` export for data about instrument and effects types.

## [0.0.5] - 2019-06-17

- Update <Track> steps to enable chords to be played
- Refactor example page
- Add ukulele tab example
- Update step editor example
- Add `react-testing-library` for testing examples
- Use css-modules in example

## [0.0.4] - 2018-08-25

- First changelog entry
