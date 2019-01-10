import * as React from 'react';
import { Layer, Line } from 'react-konva';


export default class KonvaGridLayer extends React.Component {

    render() {
        // getting settings for drawing grid:
        const { width, height, blockSnapSize } = this.props;

        let padding = blockSnapSize;
        let blocksCount = width / blockSnapSize ^ 0;

        const makeVerticalGrid = [...Array(blocksCount+1)].map((elem, i) => {
            return (
                <Line
                    key={Number(`1${i}`)}
                    points={[Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height]} 
                    stroke={'#ddd'}
                    strokeWidth={1}
                >    
                </Line>
            ); 
        });

        const makeHorizontalGrid = [...Array(blocksCount+1)].map((elem, j) => {
            return (
                <Line
                    key={Number(`2${j}`)}
                    points={[0, Math.round(j * padding), width, Math.round(j * padding)]} 
                    stroke={'#ddd'}
                    strokeWidth={0.5}
                >    
                </Line>
            ); 
        });

        return (
            <Layer>
                {makeVerticalGrid}
                {makeHorizontalGrid}
                {this.props.children}
            </Layer>
        );
    }
    
};