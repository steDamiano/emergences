//(e)mergences

b = NetAddr.new("127.0.0.1", 57120);

// Set up synth array
~notes = List.new(0);
~notes.postln

// printing OSC messages
(
o = OSCFunc({
	arg msg, time, addr, recvPort;
	[msg, time, addr, recvPort].postln;
	msg[1].postln
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
		arg freq, amp;
		var sig;

		sig = Pulse.ar(freq, rrand(0.01,0.5), amp);//!2 * EnvGen.ar(Env.perc,doneAction:2);
		Out.ar(0, Pan2.ar(sig, 0));}).add;
)

(
OSCdef(\start,
    {
		arg msg;
		if((msg[1] > 0), {
			x = Synth.new(\adolfo, [\freq, msg[3]*100, \amp, 1]);


			//freq = msg[1];
			//amp = msg[2];
			// x.set(\freq, msg[1]*400);
			if(~notes[msg[2]] == nil, {
				~notes.add(x);
			},  {
				~notes.put(msg[2], x);
			});
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
			~notes[msg[2]] = 0;
			~notes.postln;
	})
}, 'button/2')
)

(
OSCdef(\changeFreq,
	{
		arg msg;
		~notes[msg[2]].set(\freq, msg[1] * 100);
}, 'slider/freq')
)

(
OSCdef(\changeAmp,
	{
		arg msg;
		~notes[msg[2]].set(\amp, msg[1]*10);
}, 'slider/amp')
)

//MIDI TEST
MIDIClient.init;
~test = MIDIOut.newByName("IAC Driver", "Bus 1");
~test.noteOn(16,60,60)
~test.noteOn(16,65,60)
~test.noteOff(16,65,60)
~notes[0].free
~notes.removeAt(0)
~notes.postln
~notes.add(Nil)
~notes[1].postln
