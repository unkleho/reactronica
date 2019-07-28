webpackHotUpdate("static/development/pages/index.js",{

/***/ "../dist/index.es.js":
/*!***************************!*\
  !*** ../dist/index.es.js ***!
  \***************************/
/*! exports provided: Song, Track, Instrument, Effect, constants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Song", function() { return Song; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Track", function() { return Track; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instrument", function() { return Instrument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Effect", function() { return Effect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "constants", function() { return constants; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);



var commonjsGlobal =  true ? window : undefined;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var StartAudioContext = createCommonjsModule(function (module) {
/**
 *  StartAudioContext.js
 *  @author Yotam Mann
 *  @license http://opensource.org/licenses/MIT MIT License
 *  @copyright 2016 Yotam Mann
 */
(function (root, factory) {
	if (module.exports) {
        module.exports = factory();
	} else {
		root.StartAudioContext = factory();
  }
}(commonjsGlobal, function () {

	//TAP LISTENER/////////////////////////////////////////////////////////////

	/**
	 * @class  Listens for non-dragging tap ends on the given element
	 * @param {Element} element
	 * @internal
	 */
	var TapListener = function(element, context){

		this._dragged = false;

		this._element = element;

		this._bindedMove = this._moved.bind(this);
		this._bindedEnd = this._ended.bind(this, context);

		element.addEventListener("touchstart", this._bindedEnd);
		element.addEventListener("touchmove", this._bindedMove);
		element.addEventListener("touchend", this._bindedEnd);
		element.addEventListener("mouseup", this._bindedEnd);
	};

	/**
	 * drag move event
	 */
	TapListener.prototype._moved = function(e){
		this._dragged = true;
	};

	/**
	 * tap ended listener
	 */
	TapListener.prototype._ended = function(context){
		if (!this._dragged){
			startContext(context);
		}
		this._dragged = false;
	};

	/**
	 * remove all the bound events
	 */
	TapListener.prototype.dispose = function(){
		this._element.removeEventListener("touchstart", this._bindedEnd);
		this._element.removeEventListener("touchmove", this._bindedMove);
		this._element.removeEventListener("touchend", this._bindedEnd);
		this._element.removeEventListener("mouseup", this._bindedEnd);
		this._bindedMove = null;
		this._bindedEnd = null;
		this._element = null;
	};

	//END TAP LISTENER/////////////////////////////////////////////////////////

	/**
	 * Plays a silent sound and also invoke the "resume" method
	 * @param {AudioContext} context
	 * @private
	 */
	function startContext(context){
		// this accomplishes the iOS specific requirement
		var buffer = context.createBuffer(1, 1, context.sampleRate);
		var source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(context.destination);
		source.start(0);

		// resume the audio context
		if (context.resume){
			context.resume();
		}
	}

	/**
	 * Returns true if the audio context is started
	 * @param  {AudioContext}  context
	 * @return {Boolean}
	 * @private
	 */
	function isStarted(context){
		 return context.state === "running"
	}

	/**
	 * Invokes the callback as soon as the AudioContext
	 * is started
	 * @param  {AudioContext}   context
	 * @param  {Function} callback
	 */
	function onStarted(context, callback){

		function checkLoop(){
			if (isStarted(context)){
				callback();
			} else {
				requestAnimationFrame(checkLoop);
				if (context.resume){
					context.resume();
				}
			}
		}

		if (isStarted(context)){
			callback();
		} else {
			checkLoop();
		}
	}

	/**
	 * Add a tap listener to the audio context
	 * @param  {Array|Element|String|jQuery} element
	 * @param {Array} tapListeners
	 */
	function bindTapListener(element, tapListeners, context){
		if (Array.isArray(element) || (NodeList && element instanceof NodeList)){
			for (var i = 0; i < element.length; i++){
				bindTapListener(element[i], tapListeners, context);
			}
		} else if (typeof element === "string"){
			bindTapListener(document.querySelectorAll(element), tapListeners, context);
		} else if (element.jquery && typeof element.toArray === "function"){
			bindTapListener(element.toArray(), tapListeners, context);
		} else if (Element && element instanceof Element){
			//if it's an element, create a TapListener
			var tap = new TapListener(element, context);
			tapListeners.push(tap);
		} 
	}

	/**
	 * @param {AudioContext} context The AudioContext to start.
	 * @param {Array|String|Element|jQuery=} elements For iOS, the list of elements
	 *                                               to bind tap event listeners
	 *                                               which will start the AudioContext. If
	 *                                               no elements are given, it will bind
	 *                                               to the document.body.
	 * @param {Function=} callback The callback to invoke when the AudioContext is started.
	 * @return {Promise} The promise is invoked when the AudioContext
	 *                       is started.
	 */
	function StartAudioContext(context, elements, callback){

		//the promise is invoked when the AudioContext is started
		var promise = new Promise(function(success) {
			onStarted(context, success);
		});

		// The TapListeners bound to the elements
		var tapListeners = [];

		// add all the tap listeners
		if (!elements){
			elements = document.body;
		}
		bindTapListener(elements, tapListeners, context);

		//dispose all these tap listeners when the context is started
		promise.then(function(){
			for (var i = 0; i < tapListeners.length; i++){
				tapListeners[i].dispose();
			}
			tapListeners = null;

			if (callback){
				callback();
			}
		});

		return promise
	}

	return StartAudioContext
}));
});

// import Tone from 'tone';

// let tone;

if (true) {
  tone = __webpack_require__(/*! Tone */ "../node_modules/Tone/build/Tone.js");
} else {}

var SongContext = react__WEBPACK_IMPORTED_MODULE_0___default.a.createContext();

var Song = function Song(_ref) {
  var _ref$isPlaying = _ref.isPlaying,
      isPlaying = _ref$isPlaying === undefined ? false : _ref$isPlaying,
      _ref$tempo = _ref.tempo,
      tempo = _ref$tempo === undefined ? 90 : _ref$tempo,
      _ref$swing = _ref.swing,
      swing = _ref$swing === undefined ? 0 : _ref$swing,
      _ref$swingSubdivision = _ref.swingSubdivision,
      swingSubdivision = _ref$swingSubdivision === undefined ? '8n' : _ref$swingSubdivision,
      children = _ref.children;

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    tone.Transport.bpm.value = tempo;
    tone.Transport.swing = swing;
    tone.Transport.swingSubdivision = swingSubdivision;
  }, [tempo, swing, swingSubdivision]);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (isPlaying) {
      // Hack to get Tone to NOT use same settings from another instance
      tone.Transport.bpm.value = tempo;
      tone.Transport.swing = swing;
      tone.Transport.swingSubdivision = swingSubdivision;

      tone.Transport.start();

      // iOS Web Audio API requires this library.
      StartAudioContext(tone.context);
    } else {
      tone.Transport.stop();
    }
  }, [isPlaying]);

  if (false) {}

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    SongContext.Provider,
    {
      value: {
        // NOTE: Not sure what tracks are for...
        // tracks,
        // updateTracks: this.updateTracks,
        // instruments: [],
        isPlaying: isPlaying
      }
    },
    children
  );
};

Song.propTypes = {
  isPlaying: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  tempo: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  swing: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  swingSubdivision: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOf(['8n']),
  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.node
};

// NOTE: Is constants the best name for this file?

var effects = [{ id: 'feedbackDelay', name: 'Feedback delay' }, { id: 'distortion', name: 'Distortion' }, { id: 'freeverb', name: 'Freeverb' }, { id: 'panVol', name: 'Volume/Pan' }];

var instruments = [{ id: 'polySynth', name: 'Poly synth' }, { id: 'duoSynth', name: 'Duo synth' }, { id: 'sampler', name: 'Sampler' }];

var constants = {
  effects: effects,
  instruments: instruments
};

var NoteType = prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
  name: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  pitch: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  octave: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  accidental: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  midi: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number
});

var StepNoteType = prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
  note: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([NoteType, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]),
  position: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  duration: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  velocity: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number
});

var StepType = prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([StepNoteType, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(StepNoteType), prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string]);

var InstrumentTypes = prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOf(instruments.map(function (effect) {
  return effect.id;
}));

var EffectTypes = prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOf(effects.map(function (effect) {
  return effect.id;
}));

function buildSequencerStep(step, i) {
  if (typeof step === 'string') {
    return {
      notes: [{
        note: step
      }],
      index: i
    };
  } else if (step && step.note) {
    return {
      notes: [{
        note: step.note,
        duration: step.duration,
        velocity: step.velocity
      }],
      index: i
    };
  } else if (Array.isArray(step)) {
    return {
      notes: step.map(function (s) {
        if (typeof s === 'string') {
          return {
            note: s
          };
        }

        return s;
      }),
      index: i
    };
  }

  return {
    notes: [],
    index: i
  };
}

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var TrackContext = react__WEBPACK_IMPORTED_MODULE_0___default.a.createContext();

var TrackConsumer = function TrackConsumer(_ref) {
  var isPlaying = _ref.isPlaying,
      steps = _ref.steps,
      _ref$volume = _ref.volume,
      volume = _ref$volume === undefined ? 0 : _ref$volume,
      _ref$pan = _ref.pan,
      pan = _ref$pan === undefined ? 0 : _ref$pan,
      _ref$subdivision = _ref.subdivision,
      subdivision = _ref$subdivision === undefined ? '4n' : _ref$subdivision,
      _ref$effects = _ref.effects,
      effects = _ref$effects === undefined ? [] : _ref$effects,
      children = _ref.children,
      onStepPlay = _ref.onStepPlay;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]),
      _useState2 = slicedToArray(_useState, 2),
      effectsChain = _useState2[0],
      setEffectsChain = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]),
      _useState4 = slicedToArray(_useState3, 2),
      instruments = _useState4[0],
      setInstruments = _useState4[1];

  var sequencer = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])();
  var instrumentsRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(instruments);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    instrumentsRef.current = instruments;
  }, [instruments]);

  /*
  Tone.Sequence can't easily play chords. By default, arrays within steps are flattened out and subdivided. However an array of notes is our preferred way of representing chords. To get around this, buildSequencerStep() will transform notes and put them in a notes field as an array. We can then loop through and run triggerAttackRelease() to play the note/s.
  */
  var sequencerSteps = steps.map(buildSequencerStep);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    // -------------------------------------------------------------------------
    // STEPS
    // -------------------------------------------------------------------------

    // Start/Stop sequencer!
    if (isPlaying) {
      sequencer.current = new tone.Sequence(function (time, step) {
        step.notes.forEach(function (note) {
          instrumentsRef.current.map(function (instrument) {
            instrument.triggerAttackRelease(note.note, note.duration, undefined, note.velocity);
          });
        });

        if (typeof onStepPlay === 'function') {
          onStepPlay(step, step.index);
        }
      }, sequencerSteps, subdivision);

      sequencer.current.start(0);
    } else {
      if (sequencer.current) {
        sequencer.current.stop();
      }
    }
  }, [isPlaying]);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (sequencer.current) {
      sequencer.current.removeAll();

      sequencerSteps.forEach(function (note, i) {
        sequencer.current.add(i, note);
      });
    }
  }, [steps]);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    return function cleanup() {
      if (sequencer.current) {
        sequencer.current.dispose();
      }
    };
  }, []);

  var handleAddToEffectsChain = function handleAddToEffectsChain(effect) {
    // console.log('<Track />', 'onAddToEffectsChain');

    setEffectsChain(function (prevEffectsChain) {
      return [effect].concat(toConsumableArray(prevEffectsChain));
    });
  };

  var handleRemoveFromEffectsChain = function handleRemoveFromEffectsChain(effect) {
    // console.log('<Track />', 'onRemoveFromEffectsChain', effect);

    setEffectsChain(function (prevEffectsChain) {
      return prevEffectsChain.filter(function (e) {
        return e.id !== effect.id;
      });
    });
  };

  var handleInstrumentsUpdate = function handleInstrumentsUpdate(newInstruments) {
    setInstruments(newInstruments);
  };

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    TrackContext.Provider,
    {
      value: {
        effectsChain: effectsChain, // Used by Instrument
        onInstrumentsUpdate: handleInstrumentsUpdate,
        onAddToEffectsChain: handleAddToEffectsChain,
        onRemoveFromEffectsChain: handleRemoveFromEffectsChain,
        pan: pan,
        volume: volume
      }
    },
    children,
    effects
  );
};

TrackConsumer.propTypes = {
  // <Song /> props
  isPlaying: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,
  // <Track /> props
  steps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(StepType),
  volume: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  pan: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  subdivision: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, // react-music = resolution
  effects: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.element), // TODO: Consider accepting Tone effects signals
  onStepPlay: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};

var Track = function Track(props) {
  var value = react__WEBPACK_IMPORTED_MODULE_0___default.a.useContext(SongContext);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TrackConsumer, _extends({}, value, props));
};

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  var ref = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])();

  // Store current value in ref
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

var InstrumentConsumer = function InstrumentConsumer(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === undefined ? 'polySynth' : _ref$type,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? {
    polyphony: 4,
    oscillator: {
      partials: [0, 2, 3, 4]
    }
  } : _ref$options,
      _ref$notes = _ref.notes,
      notes = _ref$notes === undefined ? [] : _ref$notes,
      samples = _ref.samples,
      volume = _ref.volume,
      pan = _ref.pan,
      effectsChain = _ref.effectsChain,
      onInstrumentsUpdate = _ref.onInstrumentsUpdate;

  var synth = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])();
  var trackChannelBase = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(new tone.PanVol(pan, volume));
  var prevNotes = usePrevious(notes);

  // -------------------------------------------------------------------------
  // INSTRUMENT TYPE
  // -------------------------------------------------------------------------

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var _synth$current;

    // console.log(type);

    // if (synth.current) {
    //   synth.current.disconnect();
    // }

    if (type === 'polySynth') {
      synth.current = new tone.PolySynth(options.polyphony, tone.Synth, options);
    } else if (type === 'duoSynth') {
      synth.current = new tone.DuoSynth(options);
    } else if (type === 'sampler') {
      synth.current = new tone.Sampler(samples);
    }

    // trackChannelBase.current = new Tone.PanVol(pan, volume);
    // synth.current.chain(trackChannelBase.current, Tone.Master);

    // synth.current.disconnect();
    (_synth$current = synth.current).chain.apply(_synth$current, toConsumableArray(effectsChain).concat([trackChannelBase.current, tone.Master]));

    // Add this Instrument to Track Context
    onInstrumentsUpdate([synth.current]);

    return function cleanup() {
      if (synth.current) ;
    };
  }, [type]);

  // -------------------------------------------------------------------------
  // VOLUME / PAN
  // -------------------------------------------------------------------------

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    trackChannelBase.current.volume.value = volume;
  }, [volume]);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    trackChannelBase.current.pan.value = pan;
  }, [pan]);

  // -------------------------------------------------------------------------
  // NOTES
  // -------------------------------------------------------------------------

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    // Loop through all current notes
    notes.forEach(function (note) {
      // Check if note is playing
      var isPlaying = prevNotes.filter(function (n) {
        return n.name === note.name;
      }).length > 0;

      // Only play note is it isn't already playing
      if (!isPlaying) {
        synth.current.triggerAttack(note.name);
      }
    });

    // Loop through all previous notes
    prevNotes && prevNotes.forEach(function (note) {
      // Check if note is still playing
      var isPlaying = notes.filter(function (n) {
        return n.name === note.name;
      }).length > 0;

      if (!isPlaying) {
        synth.current.triggerRelease(note.name);
      }
    });
  }, [notes]);

  // -------------------------------------------------------------------------
  // EFFECTS CHAIN
  // -------------------------------------------------------------------------

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var _synth$current2;

    // console.log('<Instrument />', 'updateEffectsChain', effectsChain);

    // trackChannelBase.current = new Tone.PanVol(pan, volume);

    // NOTE: Using trackChannelBase causes effects to not turn off
    synth.current.disconnect();
    (_synth$current2 = synth.current).chain.apply(_synth$current2, toConsumableArray(effectsChain).concat([trackChannelBase.current, tone.Master]));
  }, [effectsChain]);

  return null;
};

InstrumentConsumer.propTypes = {
  // <Instrument /> Props
  type: InstrumentTypes.isRequired,
  options: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  notes: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(NoteType), // Currently played notes.
  samples: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  trackChannel: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object, // An instance of new this.Tone.PanVol()
  // polyphony: PropTypes.number,
  // <Track /> Props
  volume: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  pan: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  effectsChain: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array,
  onInstrumentsUpdate: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};

var Instrument = function Instrument(props) {
  var value = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(TrackContext);
  // const { Tone } = useContext(SongContext);

  if (false) {}

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(InstrumentConsumer, _extends({}, value, props));
};

var EffectConsumer = function EffectConsumer(_ref) {
  var type = _ref.type,
      id = _ref.id,
      _ref$delayTime = _ref.delayTime,
      delayTime = _ref$delayTime === undefined ? '8n' : _ref$delayTime,
      _ref$feedback = _ref.feedback,
      feedback = _ref$feedback === undefined ? 0.5 : _ref$feedback,
      onAddToEffectsChain = _ref.onAddToEffectsChain,
      onRemoveFromEffectsChain = _ref.onRemoveFromEffectsChain;

  var effect = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])();

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    // console.log('<Effect /> mount');
    // console.log(`id: ${id}`);

    if (type === 'feedbackDelay') {
      effect.current = new tone.FeedbackDelay(delayTime, feedback);
    } else if (type === 'distortion') {
      effect.current = new tone.Distortion(0.5);
    } else if (type === 'freeverb') {
      effect.current = new tone.Freeverb();
    } else if (type === 'panVol') {
      effect.current = new tone.PanVol();
    }

    effect.current.id = id;

    // Update effects chain
    // TODO: Work out which index to insert current this.effect
    onAddToEffectsChain(effect.current);

    return function () {
      // console.log('<Effect /> unmount');
      onRemoveFromEffectsChain(effect.current);
    };
  }, [type]);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (effect.current.feedback) {
      effect.current.feedback.value = feedback;
    }
  }, [feedback]);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (effect.current.delayTime) {
      effect.current.delayTime.value = delayTime;
    }
  }, [delayTime]);

  return null;
};

EffectConsumer.propTypes = {
  type: EffectTypes.isRequired,
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,
  options: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  delayTime: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  feedback: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  onAddToEffectsChain: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onRemoveFromEffectsChain: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};

var Effect = function Effect(props) {
  var value = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(TrackContext);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EffectConsumer, _extends({}, value, props));
};


//# sourceMappingURL=index.es.js.map


/***/ })

})
//# sourceMappingURL=index.js.b0bd0343bab11f6035fd.hot-update.js.map