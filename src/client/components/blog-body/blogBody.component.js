import blogBodyController from './blogBody.controller';
import blogBody from './blogBody.html';
import './blogBody.style.scss';

const blogBodyComponent = {
    template: blogBody,
    controller: blogBodyController,
    bindings: {
        data: '<',
    },
};

export default blogBodyComponent;