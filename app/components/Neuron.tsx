import * as React from 'react'
import { RouteComponentProps, StaticRouter } from 'react-router';
import { Ellipse } from './Ellipse';
import { Point } from '../utils/geometry';
import { SelectNeuronAction, MoveNeuronAction, makeGhostSynapseAtAxon, MakeGhostSynapseAtAxonAction, makeGhostSynapseAtDend, MakeGhostSynapseAtDendAction, tryMakeSynapseAtAxon, tryMakeSynapseAtDend, tryMakeSynapseAtNewDend, } from '../actions/network';
import Draggable from 'react-draggable'
import { DendStateType } from '../reducers/network';
import { NeuronBody } from './NeuronBody'

export interface IProps extends RouteComponentProps<any> {
    selectNeuron: (payload: SelectNeuronAction) => void,
    moveNeuron: (payload: MoveNeuronAction) => void,
    tryMakeSynapseAtAxon: (id: string, neuronId: string) => void,
    tryMakeSynapseAtDend: (payload: MakeGhostSynapseAtDendAction) => void,
    tryMakeSynapseAtNewDend: (neuronId: string) => void
    id: string,
    pos: Point,
    dends: Array<DendStateType>
}

export class Neuron extends React.Component<IProps> {
    props: IProps

    handleNeuronClick (e: React.MouseEvent<SVGGElement>) {
        e.preventDefault()
        const { tryMakeSynapseAtNewDend, id } = this.props

        tryMakeSynapseAtNewDend(id)
    }

    handleAxonClick (e: React.MouseEvent<SVGCircleElement>) {
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
            dends
        } = this.props

        return (
            <g
                transform={"translate(" + pos.x + " " + pos.y + ")"}
            >
                <g
                        onClick = {this.handleNeuronClick.bind(this)}
                >
                    <NeuronBody dends={dends} />
                    // TODO: Add Soma
                </g>
                <circle cx={50} cy={0} r={5}
                    onClick = {this.handleAxonClick.bind(this)}
                />
            </g>
        )
    }
}