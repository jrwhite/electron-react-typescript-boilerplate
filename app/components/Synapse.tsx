import * as React from 'react'
import { ActionPotential } from './ActionPotential'
import { RouteComponentProps } from 'react-router';
import { Point } from '../utils/geometry';
import { Line } from './Line';
import { ExciteNeuron } from '../actions/network'

export interface IProps extends RouteComponentProps<any> {
    finishFiringSynapse (id: string): void,
    id: string,
    axon: {id: string, neuronId: string},
    dend: {id: string, neuronId: string},
    width: number,
    length: number,
    speed: number,
    axonPos: Point,
    dendPos: Point,
    isFiring: boolean,
}

export class Synapse extends React.Component<IProps> {
    props: IProps

    render() {
        const {
            finishFiringSynapse,
            axonPos,
            dendPos,
            id,
            speed,
            isFiring,
        } = this.props

        const line = {start: axonPos, stop: dendPos}
        const length = Math.hypot(axonPos.x - dendPos.x, axonPos.y - dendPos.y)
        const apCallback = () => finishFiringSynapse(id)

        return (
            <g id={id}>
                <Line line={line} />

                {isFiring ? 
                <ActionPotential 
                    callback={apCallback}
                    type={'EXCIT'}
                    start={axonPos}
                    stop={dendPos}
                    speed={speed}
                    length={length}
                />
                : undefined}
            </g>
        )
    }
}