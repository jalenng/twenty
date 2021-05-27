import React from 'react';

export default class extends React.Component {

    static defaultProps = {
        backgroundColor: '#222222',
        radius: '8px',
    };

    render() {

        return (
            <div>

                <div
                    style={{
                        background: this.props.backgroundColor,
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        zIndex: -100,
                        borderRadius: this.props.radius
                    }}
                />

                {this.props.children}

            </div>
            
        );
    }
}

