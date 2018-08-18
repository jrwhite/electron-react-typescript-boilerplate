import * as React from 'react'
import { RouteComponentProps, StaticRouter } from 'react-router';
import { Ellipse } from './Ellipse';
import { Point } from '../utils/geometry';
import { SelectNeuronAction, MoveNeuronAction, makeGhostSynapseAtAxon, MakeGhostSynapseAtAxonAction, makeGhostSynapseAtDend, MakeGhostSynapseAtDendAction, tryMakeSynapseAtAxon, tryMakeSynapseAtDend, } from '../actions/network';
import Draggable from 'react-draggable'

export interface IProps extends RouteComponentProps<any> {
    selectNeuron: (payload: SelectNeuronAction) => void,
    moveNeuron: (payload: MoveNeuronAction) => void,
    tryMakeSynapseAtAxon: (id: string, neuronId: string) => void,
    tryMakeSynapseAtDend: (payload: MakeGhostSynapseAtDendAction) => void,
    id: string,
    pos: Point
}

export class Neuron extends React.Component<IProps> {
    props: IProps

    handleClick (e: React.MouseEvent<SVGCircleElement>) {
        e.preventDefault()
        const { tryMakeSynapseAtAxon, id, pos } = this.props

        tryMakeSynapseAtAxon('a', id)
    }
    
    render() {
        const {
            selectNeuron,
            moveNeuron,
            pos,
            id,
        } = this.props

        return (
            <g
                transform={"translate(" + pos.x + " " + pos.y + ")"}
            >
                <Ellipse arcs={[{ start: 0, stop: 2 }]} major={50} minor={30} angle={0} />
                <Ellipse arcs={[{ start: 0, stop: 2 }]} major={30} minor={18} angle={0} />
                <circle cx={50} cy={0} r={5}
                    onClick = {this.handleClick.bind(this)}
                />
            </g>
        )
    }
}