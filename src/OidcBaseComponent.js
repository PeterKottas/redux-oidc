import PropTypes from 'prop-types';
import React from 'react';
import { redirectSuccess } from './actions';
import { OidcContextType } from './OidcProvider';

class OidcBaseComponent extends React.Component {
    static propTypes = {
    };

    static contextTypes = OidcContextType;

    constructor(props) {
        super(props);
        inputId = this.guid();
    }

    guid() {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
    }

    componentWillUnmount() {
        this.context.unregister(this);
    }

    componentDidMount() {
        this.context.register(this);
    }
}

export default CallbackComponent;
