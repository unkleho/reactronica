# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2021-10-12

- Fix ESLint issues

## [0.6.2] - 2021-10-10

- Fix new `samples` bug again, only adding new samples after initial render

## [0.6.1] - 2021-10-07

- Fix bug where subsequent renders weren't adding new `samples` to sampler Instrument
- Add test for above fix

## [0.6.0] - 2021-10-04

- Revert to Typescript 3.7.3 to match TSDX
- Improve `<Instrument>` `onLoad` type
- Change from `string` to `MidiNote` in `StepType`

## [0.5.3] - 2021-08-20

- Fix Track `steps` types and add `string[]`.

## [0.5.2] - 2021-05-02

- Fix `midiNotes` export.

## [0.5.1] - 2021-05-01

- Add `MidiNote` and `midiNotes`. Allow `null` in `StepType`.

## [0.5.0] - 2021-05-01

- Fix Track `steps` updating when new steps are different length to previous `steps`. Can't update steps length while music is playing though, still need to stop and play again.
- Update `StepNoteType` to allow `string` for `duration`
- Remove website folder and move to new repo

## [0.4.6] - 2021-03-15

- Fix bug where object step like `{ name: 'C3' }` works in `<Track>` `steps` prop.

## [0.4.5] - 2020-07-29

- Fix iOS audio by moving `StartAudioContext` into body click event. iOS needs a user trigger to enable audio.

## [0.4.4] - 2020-07-20

- Move `Tone.Channel` into `useEffect` and add cleanup function

## [0.4.3] - 2020-04-06

- Oops. Removed console log.

## [0.4.2] - 2020-04-04

- Update Instrument `notes` to not retrigger on every render. Revert back to `isPlaying` check and add unique `key` to `NoteType` to trigger sound.

## [0.4.1] - 2020-04-01

- Ensure new `samples` load even after initial mount of `sampler` type in `Instrument`

## [0.4.0] - 2020-03-29

- Install `tsdx` to manage pain of package config
- Migrate core to Typescript
- Remove Jest, Babel and ESLint, with `tsdx` managing these from now onwards
- Fix tests to work with Typescript

## [0.3.5] - 2020-03-20

- Update Instrument `notes` and allow multi trigger of same note
- Update Rollup config to includeDependencies
- Remove `tone` as peerDep and leave as dep

## [0.3.4] - 2020-03-16

- Add `fast-deep-equal` to improve steps update performance on `Track`

## [0.3.3] - 2020-03-08

- Refactor Track to use `Tone.Channel` instead of `Tone.PanVol`
- Add Track `mute` and `solo`
- Update `propTypes`

## [0.3.2] - 2020-03-03

- Add Create React Template for Reactronica
- Add `eq3` effect type with `low`, `mid`, `high`, `lowFrequency` and `highFrequency` props

## [0.3.1] - 2020-02-27

- Add `duration` and `velocity` for Instrument notes
- Add `onLoad` prop to `Instrument` for `type` of `sampler`

## [0.3.0] - 2020-02-07

- Change `tempo` to `bpm` in `Song` to match `Tone` API
- Add `volume` and `isMuted` prop to `Song`
- Add `polyphony`, `oscillator`, `envelope` props to `Instrument`
- Remove `type` of `polySynth` from `Instrument` as it is just a wrapper around other synths
- Add `membraneSynth`, `metalSynth` and `pluckSynth` types to `Instrument`
- Update `AMSynth` and `FMSynth` values in `Instrument` `type` to `amSynth` and `fmSynth`
- Remove `/example` folder to focus on `/website` that already includes docs and examples
- Change `steps` from `step.note` to `step.name` in `Track`
- Add more Typescript definitions
  <!-- - Change `Instrument` to use `useLayoutEffect` instead of `useEffect` for triggering `notes` -->
- Ensure `Instrument` and `Effect` don't crash if unknown `type` is passed
- Update `onStepPlay` arguments to `StepNoteType[]` and `number`.
- Add `wet` prop to `Effect`
- Update `propTypes`
- Update docs

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
