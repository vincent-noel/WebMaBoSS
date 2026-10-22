from django.test import SimpleTestCase

from api.views.commons.parse import dumpIstates

from os.path import join
from tempfile import TemporaryDirectory
import maboss


class TestParse(SimpleTestCase):

	def testDumpIstates(self):

		# Initial states written as a value, which pymaboss >= 0.8.16 parses as booleans
		with TemporaryDirectory() as directory:
			with open(join(directory, "model.bnd"), "w") as bnd:
				bnd.write("Node A { logic = A; rate_up = @logic ? 1.0 : 0.0; rate_down = @logic ? 0.0 : 1.0; }\n")
				bnd.write("Node B { logic = A; rate_up = @logic ? 1.0 : 0.0; rate_down = @logic ? 0.0 : 1.0; }\n")
				bnd.write("Node C { logic = B; rate_up = @logic ? 1.0 : 0.0; rate_down = @logic ? 0.0 : 1.0; }\n")
			with open(join(directory, "model.cfg"), "w") as cfg:
				cfg.write("A.istate = 1;\nB.istate = 0;\n[C].istate = 0.3[0], 0.7[1];\n")

			model = maboss.load(join(directory, "model.bnd"), join(directory, "model.cfg"))

		initial_states = dumpIstates(model.network.get_istate())

		self.assertEqual(initial_states["A"], {0: 0, 1: 1})
		self.assertEqual(initial_states["B"], {0: 1, 1: 0})
		self.assertEqual(initial_states["C"], {0: 0.3, 1: 0.7})

		# The interface reads them with parseFloat, which doesn't accept booleans
		for istate in initial_states.values():
			for proba in istate.values():
				self.assertNotIsInstance(proba, bool)
