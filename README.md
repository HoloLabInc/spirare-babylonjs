# spirare-babylonjs

This repository contains applications and libraries for Project Spirare, utilizing Babylon.js.

## Project Spirare
Project Spirare is a project that defines and implements a versatile format for describing 3D content.  
In this project, a file format called POML is defined.

POML has the following features:

- XML-based format
- Ability to define the placement of files, such as 3D models, images, and videos
- Independent of specific engines or applications
- Loadable at runtime

## Applications
### [electron-app](./application/electron-app)
This is an desktop application that can edit and display POML files.

### [server-client-app](./application/server-client-app)
This is a web application that can edit and display POML files.  
POML files are saved in a server.

### [web-client-app](./application/web-client-app)
This is a web application that can edit and display POML files.  
POML files are not saved.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details.