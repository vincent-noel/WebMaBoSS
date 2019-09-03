from json import loads, dumps
from math import isnan

def tryFloat(value):
	try:
		return float(value)
	except ValueError:
		return str(value)

def parseIstates(istates):
	parsed_istates = {}
	for var, istate in loads(istates).items():
		t_istate = {int(key): tryFloat(value) for key, value in istate.items()}

		if any([isinstance(value, str) or isnan(value) for value in t_istate.values()]):
			t_istate = {0: 1.0, 1: 0.0}

		parsed_istates.update({var: t_istate})

	return parsed_istates


def dumpIstates(istates):
	# Here the problem is the variables with more than two states, who appear in the initial states as :
	# (Var_1, Var_2, Var_3) : {(0, 0, 0): 1, (1, 0, 0): 0, (1, 1, 0): 0, (1, 1, 1): 0}
	# The nice thing is that it shows the constraint that the state (0, 1, 1) is impossible. But I'm not sure
	# how to show this constraint on the interface (Probably merging them as a single multi state variable,
	# which they are. But for now, we just treat them as individual variables, ie. without the constraint.

	fixed_initial_states = {}
	for var, value in istates.items():
		if isinstance(var, tuple):
			t_values = {}
			for i, subvar in enumerate(var):
				t_values.update({subvar: {0: 'NaN', 1: 'NaN'}})

			fixed_initial_states.update(t_values)

		else:
			fixed_initial_states.update({var: value})

	return fixed_initial_states