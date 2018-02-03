import * as _ from 'lodash';
import * as kefir from 'kefir';

function createCombineObserver(targetContexts, baseObject) {
	let prevValues = [];
	let returnObject = baseObject;

	return (...newValues) => {
		// Compares the newValues and prevValues to confirm position has changed
		let changedArgPositions = newValues.reduce((memo, value, index, arr) => {
			return prevValues[index] !== value ? memo.concat(index) : memo;
		}, []);

		// To update only the changes arguments
		changedArgPositions.forEach(index => {
			let newChangedArg = newValues[index];
			let targetContext = targetContexts[index].slice();
			let target = returnObject;

			// Continuous updating references to the one before the end of the targetContext
			while (targetContext.length > 1) {
				target = target[targetContext.shift()];
			}

			target[targetContext.shift()] = newChangedArg;
		});

		prevValues = newValues.slice();
		return returnObject;
	};
}

function collectTargetObservablesAndContext(templateObject) {
	let targets = [],
		contexts = [];

	function walker(list, parentContext) {
		if (_.isArray(list)) {
			list.forEach(evaluator)
		} else {
			Object.keys(list).forEach(key => {
				evaluator(list[key], key);
			});
		}

		function evaluator(value, key) {
			let context = parentContext.slice();
			context.push(key);

			if (!!value && !!value.onValue) {
				targets.push(value);
				contexts.push(context);
			} else if (_.isArray(value) || (!!value && _.isObject(value))) {
				walker(value, context);
			}
		}
	}

	walker(templateObject, []);

	return {
		targets: targets,
		contexts: contexts
	};
}

export function combineTemplate(templateObject = {}) {

	let cloneTemplate = _.clone(templateObject);
	let collections = collectTargetObservablesAndContext(templateObject);

	return kefir.combine(
		collections.targets,
		createCombineObserver(collections.contexts, cloneTemplate)
	);
}

function zipObject(fields) {
	let obj = {};
	fields.forEach(([key, val]) => obj[key] = val);
	return obj;
}

function pairs(obj) {
	return Object.keys(obj).map(k => [k, obj[k]]);
}

function _toConsumablrArray(arr) {
	if (_.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];
        return arr2;
	} else {
		return Array.from(arr);
	}
}

function merge(...args) {
	return zipObject(args.reduce((p, a) => {
		return [].concat(_toConsumablrArray(p), _toConsumablrArray(pairs(a)));
	}, []));
}

export default function ffux(stateModel, opts) {
	opts = opts || {};

	checkStateModelIsValid(stateModel);
	const actions = composeActions(pairs(stateModel));
	return {
		listen,
		take,
		getActions,
		getInitialState
	};

	function listen(callback) {
		let stateStream = composeAppStateStream(pairs(stateModel), actions);
		return subscribe(stateStream, actions, callback);
	}

	function take(callback) {
		let stop;
		stop = listen(model => {
			_.defer(() => {
				stop();
				callback(model);
			});
		});
	}

	function getActions() {
		return actions;
	}

	function getInitialState() {
		return zipObject(pairs(stateModel).map(([name, store]) => {
			return [name, store.ffuxInitialState()];
		}));
	}

	function checkStateModelIsValid(model) {
		let invalidCount = pairs(model).filter(([__, store]) => !(store && store.__ffuxStore === true))

		if(invalidCount > 0) {
			throw new Error('Only stores are accepted in the state model');
		}
	}

	function composeActions(stateModelProps) {
		const actions = {};
		if (opts.flatActions) {
			stateModelProps.forEach(([name, prop]) => {
				const propActions = prop.ffuxActions();
				pairs(propActions).forEach(([actionName, action]) => {
					if (actions[actionName]) {
						throw new Error(`Action "${actionName}" defined more than once`);
					}
					actions[actionName] = action;
				});
			});
		} else {
			pairs(stateModel).forEach(([name, prop]) => actions[name] = prop.ffuxActions());
		}
		return actions;
	}
}

export function createStore({state, actions: actionNames = []}) {
	return function store(initialState, dependencies = {}) {
		if (arguments.length === 0) {
			throw new Error("Initial state must be given to the store");
		}

		const actionsByName = zipObject(actionNames.map(a => {
			return [a, createAction(a)];
		}));
		const actionStreams = zipObject(Object.keys(actionsByName).map(name => [name, actionsByName[name].stream]));
		const actionInterfaces = zipObject(Object.keys(actionsByName).map(name => [name, actionsByName[name].fn]));

		const stateStream = checkStateStream(state(initialState, actionStreams, dependencies), initialState);
		stateStream.ffuxActions = () => actionInterfaces;
		stateStream.ffuxInitialState = () => initialState;
		return stateStream;
	};
}

export function createComponent() {}

function composeAppStateStream(stateModelProps) {
	let template = zipObject(stateModelProps);
	return combineTemplate(template);
}

function createAction() {
	let callback;
	let callbackError;
	let emit = x => callback(x);
	let error = e => callbackError(e);

	let stream = kefir.stream(emitter => {
		callback = emitter.emit;
		callbackError = emitter.error;
		return function() {};
	});

	return {
		stream,
		fn
	};

	function fn(...args) {
		try {
			args.length === 1 ? emit(args[0]) : emit(args);
		} catch (err) {
			error(err);
		}
	}
}

function checkStateStream(stream) {
	if (!(stream instanceof kefir.Property))
		throw new Error('stores state stream must be a property with initial value');
	return stream;
}

function subscribe(stateP, actions, callback) {
	let usubValue = state => callback({state, actions});
	let usubError = error => { throw error };
	stateP.onValue(usubValue);
	stateP.onError(usubError);
	return () => {
		stateP.offValue(usubValue);
		stateP.offValue(usubError);
	};
}