b = NetAddr.new("127.0.0.1", 57120);

// Set up synth array
~notes = List.new(0);
~notes.postln

// printing OSC messages
(
o = OSCFunc({
	arg msg, time, addr, recvPort;
	[msg, time, addr, recvPort].postln;
}, '/button/1', n);
)
(
o = OSCFunc({
	arg msg, time, addr, recvPort;
	[msg, time, addr, recvPort].postln;
}, '/button/2', n);
)
(
o = OSCFunc({
	arg msg, time, addr, recvPort;
	[msg, time, addr, recvPort].postln;
}, '/slider/freq', n);
)
(
o = OSCFunc({
	arg msg, time, addr, recvPort;
	[msg, time, addr, recvPort].postln;
}, '/slider/amp', n);
)

(
SynthDef.new(\adolfo,
	{
		//arg msg; //OSC message
		arg note, amp;
		var sig;

		sig = Pulse.ar(note.midicps, rrand(0.01,0.5), amp);//!2 * EnvGen.ar(Env.perc,doneAction:2);
		Out.ar(0, Pan2.ar(sig, 0));}).add;
)

(
OSCdef(\start,
    {
		arg msg;
		if((msg[1] > 0), {
			x = Synth.new(\adolfo, [\note, 36, \amp, 0.5]);


			//freq = msg[1];
			//amp = msg[2];
			x.set(\freq, msg[1]*400);
			~notes.add(x);
			~notes.postln;
		})
}, 'button/1')
)

(
OSCdef(\stop,
    {
		arg msg;
		if((msg[1]==0 && ~notes[msg[2]]!= nil), {
			~notes[msg[2]].free;
			~notes.removeAt(msg[2]);
			~notes.postln;
	})
}, 'button/2')
)

(
OSCdef(\changeFreq,
	{
		arg msg;
		~notes[msg[2]].set(\note, 25+msg[1]);
}, 'slider/freq')
)

(
OSCdef(\changeAmp,
	{
		arg msg;
		~notes[msg[2]].set(\amp, msg[1]);
}, 'slider/amp')
)

//MIDI TEST
MIDIClient.init;
~test = MIDIOut.newByName("IAC Driver", "Bus 1");
~test.noteOn(16,60,60)
~test.noteOn(16,65,60)
~test.noteOff(16,65,60)