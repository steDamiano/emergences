//(e)mergences

StageLimiter.activate

b = NetAddr.new("127.0.0.1", 57120);

// Set up synth array
~notes = List.new(0);
~notes.postln
(
~revSend = Bus.audio(s, 2);
)

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
o = OSCFunc({
	arg msg, time, addr, recvPort;
	[msg, time, addr, recvPort].postln;
}, '/slider/phase', n);
)

(
		SynthDef(\bell, {
			|
			freq=556, findex=0, frate=2,
			dur=500, pos=0,
			amp=0.25,
			out=0
			|
			var sigA, sigB, sigC, sig, fmod;
			//env = EnvGen.ar(Env.triangle(5), doneAction:2);
			fmod = findex * SinOsc.kr(frate, mul:0.5, add:0.5) * Line.kr(0, 1, 10);
			sigA = Pulse.ar(freq + fmod, LFNoise2.kr(1).range(0.2, 0.8));
			sigB = VarSaw.ar(freq + fmod);
			sigC = WhiteNoise.ar() * 0.125;
			sig = SelectX.ar(LFNoise2.kr(2).range(0, 2), [sigA, sigB, sigC]);
			sig = LPF.ar(sig, freq*4 );
			sig = sig * amp * SinOsc.kr(frate/10, 0, 0.1);
			Out.ar(out, Pan2.ar(sig, pos));
		}).add;
)

(
		SynthDef(\rev, {
			arg in=0, out=0, mix=1, room=0.8;
			var sig;
			sig = In.ar(in, 2);
			sig = FreeVerb.ar(sig, mix, room);
			Out.ar(out, sig);
		}).add;
)

~rev = Synth(\rev, [\in, ~revSend]);

(
OSCdef(\start,
    {
		arg msg;
		if((msg[1] > 0), {x = Synth.new(\bell, [
			\out, ~revSend,
			\freq, msg[3]*100,
			\amp, 1,
			\findex, Pexprand(2, 20),
			\frate, msg[1],
			\pos, Pwhite(-0.8, 0.8, inf),
			\dur, Pwhite(0.1, 0.5),

		]);

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

(
OSCdef(\changePhase,
	{
		// Here set the phase parameters, msg[1] is parameter to set, msg[2] is ID
		arg msg;
		~notes[msg[2]].set(\frate, msg[1]);
}, 'slider/phase')
)





ServerOptions.outDevices; // output devices
Server.default.options.outDevice_("External Headphones");
Server.local.options.device ="External Headphones"

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

/*
(
SynthDef.new(\old,
	{
		//arg msg; //OSC message
		arg freq, amp;
		var sig;

		sig = Pulse.ar(freq, rrand(0.01,0.5), amp);//!2 * EnvGen.ar(Env.perc,doneAction:2);
		Out.ar(0, Pan2.ar(sig, 0));}).add;
)*/
