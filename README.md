# [e]mergences

# Concept 
The project aims at creating an audio visual installation which enables to visually represent the sound being played by the users on a synth. 
The installation is set in a dark, empty room with screens on its walls and ceiling. The walls and ceiling are made by big screens, and behing every screen is located a speaker covered with a thin film which vibrates with sound. On the film a small mirror projects on the screen a laser pointed on it. With the sound the laser produces curves which can be seen inside the room.
Users can interact with the installation using their smartphones through a website, without having to install any third party application on them: with their smartphones users control synthesizers connected with the speakers and produce sounds which can be visualized with the lasers projecting on the screens.
Inside the room the users can also enable the AR view on their smartphones: this allows them to see in an immersive, augmented reality context, a 3D model of the sounds they are producing, based on the same physical principle as the lasers projection (lissajous curves).

# Technology
The application is the core of the installation, enabling the users to interact with it, control it and also to see its AR part. 
It is built using three languages: 
- javascript for the frontend and the backend (node.js)
- python to control the generative part of the show
- supercollider to build the synth that generates the sound.
The components that build up the application are one server, a frontent web app, a supercollider environment and a python app.

1. Server
The server is the component that manages the connection of all the parts of the application. It keeps track of the clients connection and disconnection, and receives, sends and broadcasts their messages. The server is made in a node.js environment using the socket.io library to handle the communications with the clients, osc.js library to send osc messages to supercollider, in order to play the synth and control its parameters, and the "spawn" function to establish a communication with the python application.

2. Webapp
The frontend for the users is handled by a web application bundled with the webpack bundler to manage the dependencies with all the libraries and components. The interface of the applications shows a timer, handled by the server, which scans the stages of the performance and enables the controls when the automatic generation is not active, enabling the user to interact with the application. The controls are a set of sliders to control the synth: at the moment of the connection a new synth with specific parameters is assigned to the user, who can control its parameters (amplitude, phase rate, frequency and damping), and the synth is played in real time through the speakers. Each time a user moves a slider a command is sent to the server, which forwards it to supercollider. On the UI there is also a second control to send a "Like" to the current figure represented to the server, which will use it for the automatic generation stage. In addition to the controls the user interface shows a representation of the 3D model of the lissajous curve which is generated by the sinusoids played by the connected users. The model is built in the following fashion: each user (to a maximum of 3 users) control a synth which is represented with its parameters by a sinusoid on one of the three cartesian axes (user 0 -> x, user 1 -> y, user 2 ->z) and the curve represents the figure with all the parameters given by the users input.

The figure is built using the three.js library for graphical rendering, and can be represented in AR using the Markerless AR library WebXR. To enable the AR mode the device should be XR enabled.

3. Automatic Generation
The installation runs in two separate stages: in the first stage users are free to control the application and play with it, expressing likes using a button to the figures they like more. The likes are sent to the server and stored in an array which, at the end of the first stage, is sent to the python process. This process generates a sequence of figures to be represented during a second stage, based on the likes array. The algorithm used for automatic generation is based on a genetic algorithms that generates four generations of curves that shares common features with the "liked" configurations. It uses the scipy and numpy libraries.

# Install and run 
The application at the moment is not deployed to a website, but the files to run it in a local network are present in the folder. Since WebXR requires the use of HTTPS, self generated certificates are used to set up the server. To run the application an installed python3 is required, with the libraries numpy and scipy installed as well. 

Then, download the project, edit line 14 in 'main.js' substituting your local machine IP and run following commands in a terminal:<br>

<code> npm install<br>
 node src/server<br>
 npm run dev<br>
</code>

Project built for the course Creative Programming and Computing @ Polimi, academic year 2019/2020