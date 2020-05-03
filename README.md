# birds-of-a-feather

Birds-of-a-feather is a agent based simulation. It allows you to specify the behavior of classes of agents and lets you explore how they interact with each other in a 2D environment.

### Installation
To use this software simply download the repository and open the `index.html` file in your browser of choice.

### Usage
The birds-of-a-feather simulation has four main sections
* About
* Simulation Environment
* Agent Interactions
* Agent Transitions \[WIP\]

##### About
A simple overview of the principles of the simulation and some of the theory that guides its structure.
##### Simulation Environment
Contains a control bar and the actual environment. In the control bar you can change the pen size for adding and removing agents and you can define and edit new species (classes of agents) then add them to the environment. At the bottom is a panel of preset simulation configurations which is a WIP to give you some examples of interesting behavior.
##### Agent Interations
Contains a matrix of interactions. Here you can specify the weighting of the four key reations an agent can have to another agent.
##### Agent Transitions \[WIP\]
Eventually, this have a list of species types an allow the user specify conditions where a species will change type thus making all species behave like finite state machines as well as physical units.

### Contributing
Right now there are no guidelines for contributing but if you are interested, please contact me at taitweicht@icloud.com. I'm hoping to add new features like the transitions, but at the same time the project needs major refactoring to orthogonalize the way the JavaScript interfaces with the HTML.

### Credit
Credit is given in files that contain code written by other authors. The majority of code is written by Tait Weicht as of now.
