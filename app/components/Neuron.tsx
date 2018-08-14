import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { Ellipse } from './Ellipse';
import { Point } from '../utils/geometry';
import { SelectNeuronAction, MoveNeuronAction, StartSynapseAction } from '../actions/network';
import Draggable from 'react-draggable'

export interface IProps extends RouteComponentProps<any> {
    selectNeuron: (payload: SelectNeuronAction) => void,
    moveNeuron: (payload: MoveNeuronAction) => void,
    startSynapse: (payload: StartSynapseAction) => void,
    id: string,
    pos: Point
}

export class Neuron extends React.Component<IProps> {
    props: IProps
    
    render() {
        const {
            selectNeuron,
            moveNeuron,
            startSynapse,
            pos,
            id,
        } = this.props

        return (
            <Draggable
                axis="both"
                position={pos}
                onStart={e => moveNeuron({id: id, pos: {x: e.clientX, y: e.clientY}})}
                onStop={e => moveNeuron({id: id, pos: {x: e.clientX, y: e.clientY}})}
            >
                <g
                    transform={"translate(" + pos.x + " " + pos.y + ")"}
                >
                    <Ellipse arcs={[{ start: 0, stop: 2 }]} major={50} minor={30} angle={0} />
                    <Ellipse arcs={[{ start: 0, stop: 2 }]} major={30} minor={18} angle={0} />
                    <circle fill='red' cx={50} cy={0} r={5} 
                        onClick={startSynapse.bind(this)}
                    />
                </g>
            </Draggable>
        )
    }
}