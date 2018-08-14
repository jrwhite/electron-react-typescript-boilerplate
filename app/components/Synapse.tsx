import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { Point, Line } from '../utils/geometry';

export interface IProps extends RouteComponentProps<any> {
    id: string,
    isGhost: boolean,
    line: Line,
    axon: {neuronId: string},
    dendrite: {neuronId: string, dendriteId: string},
}

export class Synapse extends React.Component<IProps> {
    props: IProps

    render() {
        const {
            id,
            isGhost,
            line,
            axon,
            dendrite,
        } = this.props

        return (
            <g>
                <line
                    stroke='blue'
                    x1={line.start.x} x2={line.stop.x}
                    y1={line.start.y} y2={line.stop.y}
                />
            </g>
        )
    }
}