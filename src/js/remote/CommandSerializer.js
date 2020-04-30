const ChangeAmplitudeCommand = require('../Command/ChangeAmplitudeCommand');
const ChangeFrequencyCommand = require('../Command/ChangeFrequencyCommand');
const ChangePhaseCommand = require('../Command/ChangePhaseCommand');

class CommandSerializer {
    constructor(lissajous){
        this.lissajous = lissajous;
    }

    serialize(command){
        switch(command.className){
            case 'ChangeAmplitudeCommand':
                return {
                    className: command.className,
                    amp: command.amp,
                    id: command.id
                };
            case 'ChangeFrequencyCommand':
                return {
                    className: command.className,
                    freq: command.freq,
                    id: command.id
                };
            case 'ChangePhaseCommand':
                return {
                    className: command.className,
                    phase: command.phase,
                    id: command.id
                }
        }
    }

    deserialize(serializedCommand){
        switch(serializedCommand.className){
            case 'ChangeAmplitudeCommand':
                return new ChangeAmplitudeCommand(this.lissajous, serializedCommand.amp, serializedCommand.id);
            case 'ChangeFrequencyCommand':
                return new ChangeFrequencyCommand(this.lissajous, serializedCommand.freq, serializedCommand.id);
            case 'ChangePhaseCommand':
                return new ChangePhaseCommand(this.lissajous, serializedCommand.phase, serializedCommand.id);
        }

        // If no command is found or wrong command is found
        console.log("No command, check for syntax");
        return null;
    }
}

module.exports = CommandSerializer;