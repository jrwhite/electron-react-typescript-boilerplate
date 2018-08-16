import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { Point } from '../utils/geometry';
import { Line } from './Line';

export interface IProps extends RouteComponentProps<any> {
    id: string,
    axon: {id: string, neuronId: string},
    dend: {id: string, neuronId: string},
    length: number,
    width: number,
    speed: number,
    axonPos: Point,
    dendPos: Point
}

export class Synapse extends React.Component<IProps> {
    props: IProps

    render() {
        const {
            axonPos,
            dendPos,
        } = this.props

        const line = {start: axonPos, stop: dendPos}

        return (
            <g>
                <Line line={line} />
            </g>
        )
    }
}