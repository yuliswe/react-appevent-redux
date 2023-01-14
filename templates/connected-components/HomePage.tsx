import React from "react";
import { connect } from "react-redux";
import { HomeAppState } from "../states/HomeAppState";
import { RootAppState } from "../states/RootAppState";

type _State = {
};

type _Props = {
    homeAppState: HomeAppState;
};

class _Home extends React.Component<_Props, _State> {
    constructor(props: _Props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <div>{this.props.homeAppState.welcomeText}</div>
            </React.Fragment>
        );
    }
}

export const HomePage = connect<_Props, {}, {}, RootAppState>((rootAppState: RootAppState) => ({
    homeAppState: rootAppState.home,
}))(_Home);
