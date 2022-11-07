## How to run

This project has been developing with Nodejs version 16

### Not using docker: run with local env

- `yarn install`
- `yarn start`
- Open browser and see the result: http://localhost:3006/#/

### Using docker: build and run with production env

- Build image: `docker build -t anhtuta/lili-admin:v1 .`
- Run container: `docker-compose up`
- Open browser and see the result: http://localhost:3006/#/
- Open another terminal (within project folder), run following command to go inside the container and explore by yourself: `docker-compose exec app sh` (note: `app` là tên của service/container ta muốn xem)

## How to build and deploy to a static web server

- `yarn build`
- Copy all static files in `build` folder to your web server

## Code base

This is my code base, includes all of my latest updated common components!

Các components sau thường sẽ dùng chung cho nhiều project, và nếu update chúng ở project khác, thì sẽ cần update ở cả project này nữa:

- src\components\Auth (Sửa API endpoint và 1 vài chỗ nhỏ khác)
- src\components\Button
- src\components\Input
- src\components\Loadable (Cần sửa các page import trong Loadable)
- src\components\Modal
- src\components\Table
- src\components\Toast
- .prettierrc

## Một vài note về code của dự án

### Set port to run on local

On Windows:

```
"start": "set PORT=3006 && react-scripts start"
```

But when I switch to macOS, I need to change it to:

```
"start": "PORT=3006 react-scripts start"
```

=> Solution: using `cross-env`: https://stackoverflow.com/a/48669909/7688028

```
"start": "cross-env PORT=3006 react-scripts start",
```

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3006](http://localhost:3006) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
