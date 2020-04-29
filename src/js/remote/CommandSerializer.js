const ChangeAmplitudeCommand = require('../Command/ChangeAmplitudeCommand');
const ChangeFrequencyCommand = require('../Command/ChangeFrequencyCommand');

class CommandSerializer {
    constructor(lissajous){
        this.lissajous = lissajous;
    }

    serialize(command){
        switch(command.className){
            case 'ChangeAmplitudeCommand':
                return {
                    className: command.className,
                    amp: command.amp
                };
            case 'ChangeFrequencyCommand':
                return {
                    className: command.className,
                    freq: command.freq
                };
        }
    }

    deserialize(serializedCommand){
        switch(serializedCommand.className){
            case 'ChangeAmplitudeCommand':
                return new ChangeAmplitudeCommand(this.lissajous, serializedCommand.amp);
            case 'ChangeFrequencyCommand':
                return new ChangeFrequencyCommand(this.lissajous, serializedCommand.freq);
        }

        // If no command is found or wrong command is found
        console.log("No command, check for syntax");
        return null;
    }
}

module.exports = CommandSerializer;