import React from 'react';
import './styles.css';

export default class CSSapp extends React.Component {

    state = {
        showText: true,
        showTextAnim: "textClassSlideIn"
    }

    render() {
        return (
            <div>
                <div 
                    className="animatedBox" 
                    onClick={() => this.setState({
                        showText: !this.state.showText,
                        showTextAnim: !this.state.showText ? "textClassSlideIn" : "textClassSlideOut"
                    })}></div>
                <p className={this.state.showTextAnim}> THIS IS MY FRIST WORKING ANIMATION!</p>
            </div>
        );
    }
    
}